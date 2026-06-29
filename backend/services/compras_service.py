from decimal import Decimal

from sqlalchemy.orm import Session

from database.modelos import Compra, CompraDetalle, Producto, Proveedor, Usuario


def crear_compra(
    db: Session,
    proveedor_id: int,
    usuario_id: int,
    productos_comprados: list
):
    proveedor = db.query(Proveedor).filter(
        Proveedor.id == proveedor_id,
        Proveedor.activo == True
    ).first()

    if not proveedor:
        return None, "El proveedor no existe o está inactivo."

    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id,
        Usuario.activo == True
    ).first()

    if not usuario:
        return None, "El usuario no existe o está inactivo."

    if not productos_comprados:
        return None, "La compra debe tener al menos un producto."

    detalles_preparados = []
    total = Decimal("0")

    for item in productos_comprados:
        producto_id = item.get("producto_id")
        cantidad = item.get("cantidad")
        precio_unitario = item.get("precio_unitario")

        if not producto_id or not cantidad or precio_unitario is None:
            return None, "Cada producto debe tener producto_id, cantidad y precio_unitario."

        if cantidad <= 0:
            return None, "La cantidad debe ser mayor a cero."

        if precio_unitario < 0:
            return None, "El precio unitario no puede ser negativo."

        producto = db.query(Producto).filter(
            Producto.id == producto_id,
            Producto.activo == True
        ).first()

        if not producto:
            return None, f"El producto con id {producto_id} no existe o está inactivo."

        precio_decimal = Decimal(str(precio_unitario))
        subtotal = precio_decimal * Decimal(cantidad)

        detalles_preparados.append({
            "producto": producto,
            "cantidad": cantidad,
            "precio_unitario": precio_decimal,
            "subtotal": subtotal
        })

        total += subtotal

    nueva_compra = Compra(
        proveedor_id=proveedor_id,
        usuario_id=usuario_id,
        total=total,
        estado="FINALIZADA"
    )

    db.add(nueva_compra)
    db.flush()

    for detalle in detalles_preparados:
        producto = detalle["producto"]

        producto.stock = producto.stock + detalle["cantidad"]
        producto.precio_compra = detalle["precio_unitario"]

        nuevo_detalle = CompraDetalle(
            compra_id=nueva_compra.id,
            producto_id=producto.id,
            cantidad=detalle["cantidad"],
            precio_unitario=detalle["precio_unitario"],
            subtotal=detalle["subtotal"]
        )

        db.add(nuevo_detalle)

    db.commit()
    db.refresh(nueva_compra)

    return nueva_compra, "Compra creada correctamente."


def listar_compras(db: Session):
    compras = db.query(Compra).order_by(
        Compra.fecha_creacion.desc()
    ).all()

    return compras


def obtener_detalle_compra(db: Session, compra_id: int):
    compra = db.query(Compra).filter(
        Compra.id == compra_id
    ).first()

    if not compra:
        return None, [], "La compra no existe."

    detalles = db.query(CompraDetalle, Producto).join(
        Producto,
        CompraDetalle.producto_id == Producto.id
    ).filter(
        CompraDetalle.compra_id == compra_id
    ).all()

    return compra, detalles, "Detalle de compra obtenido correctamente."