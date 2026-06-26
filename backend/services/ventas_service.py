from decimal import Decimal

from sqlalchemy.orm import Session

from database.modelos import Producto, Usuario, Venta, VentaDetalle


def crear_venta(
    db: Session,
    usuario_id: int,
    productos_vendidos: list,
    metodo_pago: str = "EFECTIVO"
):
    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id,
        Usuario.activo == True
    ).first()

    if not usuario:
        return None, "El usuario no existe o está inactivo."

    if not productos_vendidos:
        return None, "La venta debe tener al menos un producto."

    detalles_preparados = []
    total = Decimal("0")

    for item in productos_vendidos:
        producto_id = item.get("producto_id")
        cantidad = item.get("cantidad")

        if not producto_id or not cantidad:
            return None, "Cada producto debe tener producto_id y cantidad."

        if cantidad <= 0:
            return None, "La cantidad debe ser mayor a cero."

        producto = db.query(Producto).filter(
            Producto.id == producto_id,
            Producto.activo == True
        ).first()

        if not producto:
            return None, f"El producto con id {producto_id} no existe o está inactivo."

        if producto.stock < cantidad:
            return None, f"No hay stock suficiente para {producto.nombre}."

        precio_unitario = Decimal(str(producto.precio_venta))
        subtotal = precio_unitario * Decimal(cantidad)

        detalles_preparados.append({
            "producto": producto,
            "cantidad": cantidad,
            "precio_unitario": precio_unitario,
            "subtotal": subtotal
        })

        total += subtotal

    nueva_venta = Venta(
        usuario_id=usuario_id,
        total=total,
        metodo_pago=metodo_pago.upper(),
        estado="FINALIZADA"
    )

    db.add(nueva_venta)
    db.flush()

    for detalle in detalles_preparados:
        producto = detalle["producto"]

        producto.stock = producto.stock - detalle["cantidad"]

        nuevo_detalle = VentaDetalle(
            venta_id=nueva_venta.id,
            producto_id=producto.id,
            cantidad=detalle["cantidad"],
            precio_unitario=detalle["precio_unitario"],
            subtotal=detalle["subtotal"]
        )

        db.add(nuevo_detalle)

    db.commit()
    db.refresh(nueva_venta)

    return nueva_venta, "Venta creada correctamente."


def listar_ventas(db: Session):
    ventas = db.query(Venta).order_by(
        Venta.fecha_creacion.desc()
    ).all()

    return ventas


def obtener_detalle_venta(db: Session, venta_id: int):
    venta = db.query(Venta).filter(
        Venta.id == venta_id
    ).first()

    if not venta:
        return None, [], "La venta no existe."

    detalles = db.query(VentaDetalle, Producto).join(
        Producto,
        VentaDetalle.producto_id == Producto.id
    ).filter(
        VentaDetalle.venta_id == venta_id
    ).all()

    return venta, detalles, "Detalle de venta obtenido correctamente."