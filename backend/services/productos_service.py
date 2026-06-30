from decimal import Decimal

from sqlalchemy import or_
from sqlalchemy.orm import Session

from database.modelos import Categoria, Producto


def generar_codigo_producto(db: Session):
    ultimo_producto = db.query(Producto).order_by(Producto.id.desc()).first()

    if not ultimo_producto:
        siguiente_numero = 1
    else:
        siguiente_numero = ultimo_producto.id + 1

    while True:
        codigo_generado = f"PRD-{siguiente_numero:04d}"

        producto_existente = db.query(Producto).filter(
            Producto.codigo == codigo_generado
        ).first()

        if not producto_existente:
            return codigo_generado

        siguiente_numero += 1


def crear_producto(
    db: Session,
    codigo: str | None,
    nombre: str,
    categoria_id: int,
    precio_compra: float,
    precio_venta: float,
    stock: int,
    stock_minimo: int,
    codigo_barras: str | None = None,
):
    codigo = codigo.strip() if codigo else ""
    nombre = nombre.strip()
    codigo_barras = codigo_barras.strip() if codigo_barras else None

    if not codigo:
        codigo = generar_codigo_producto(db)

    if not nombre:
        return None, "El nombre del producto es obligatorio."

    producto_existente = db.query(Producto).filter(
        Producto.codigo == codigo
    ).first()

    if producto_existente:
        return None, "Ya existe un producto con ese código."

    if codigo_barras:
        producto_por_barra = db.query(Producto).filter(
            Producto.codigo_barras == codigo_barras
        ).first()

        if producto_por_barra:
            return None, "Ya existe un producto con ese código de barras."

    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id,
        Categoria.activo == True
    ).first()

    if not categoria:
        return None, "La categoría no existe o está inactiva."

    if precio_compra < 0 or precio_venta < 0:
        return None, "Los precios no pueden ser negativos."

    if stock < 0 or stock_minimo < 0:
        return None, "El stock no puede ser negativo."

    nuevo_producto = Producto(
        codigo=codigo,
        codigo_barras=codigo_barras,
        nombre=nombre,
        categoria_id=categoria_id,
        precio_compra=Decimal(str(precio_compra)),
        precio_venta=Decimal(str(precio_venta)),
        stock=stock,
        stock_minimo=stock_minimo,
        activo=True,
    )

    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)

    return nuevo_producto, "Producto creado correctamente."


def listar_productos(db: Session):
    productos = db.query(Producto).filter(
        Producto.activo == True
    ).order_by(Producto.nombre.asc()).all()

    return productos


def obtener_producto_por_id(db: Session, producto_id: int):
    producto = db.query(Producto).filter(
        Producto.id == producto_id,
        Producto.activo == True
    ).first()

    return producto


def buscar_productos(db: Session, texto_busqueda: str):
    termino = f"%{texto_busqueda}%"

    productos = db.query(Producto).filter(
        Producto.activo == True,
        or_(
            Producto.nombre.ilike(termino),
            Producto.codigo.ilike(termino),
            Producto.codigo_barras.ilike(termino),
        )
    ).order_by(Producto.nombre.asc()).all()

    return productos


def listar_productos_stock_bajo(db: Session):
    productos = db.query(Producto).filter(
        Producto.activo == True,
        Producto.stock <= Producto.stock_minimo
    ).order_by(Producto.nombre.asc()).all()

    return productos


def editar_producto(
    db: Session,
    producto_id: int,
    codigo: str,
    nombre: str,
    categoria_id: int,
    precio_compra: float,
    precio_venta: float,
    stock: int,
    stock_minimo: int,
    codigo_barras: str | None = None,
):
    producto = obtener_producto_por_id(db, producto_id)

    if not producto:
        return None, "El producto no existe o está inactivo."

    codigo = codigo.strip()
    nombre = nombre.strip()
    codigo_barras = codigo_barras.strip() if codigo_barras else None

    if not codigo:
        return None, "El código del producto es obligatorio."

    if not nombre:
        return None, "El nombre del producto es obligatorio."

    producto_con_mismo_codigo = db.query(Producto).filter(
        Producto.codigo == codigo,
        Producto.id != producto_id
    ).first()

    if producto_con_mismo_codigo:
        return None, "Ya existe otro producto con ese código."

    if codigo_barras:
        producto_con_mismo_codigo_barras = db.query(Producto).filter(
            Producto.codigo_barras == codigo_barras,
            Producto.id != producto_id
        ).first()

        if producto_con_mismo_codigo_barras:
            return None, "Ya existe otro producto con ese código de barras."

    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id,
        Categoria.activo == True
    ).first()

    if not categoria:
        return None, "La categoría no existe o está inactiva."

    if precio_compra < 0 or precio_venta < 0:
        return None, "Los precios no pueden ser negativos."

    if stock < 0 or stock_minimo < 0:
        return None, "El stock no puede ser negativo."

    producto.codigo = codigo
    producto.codigo_barras = codigo_barras
    producto.nombre = nombre
    producto.categoria_id = categoria_id
    producto.precio_compra = Decimal(str(precio_compra))
    producto.precio_venta = Decimal(str(precio_venta))
    producto.stock = stock
    producto.stock_minimo = stock_minimo

    db.commit()
    db.refresh(producto)

    return producto, "Producto actualizado correctamente."


def eliminar_producto(db: Session, producto_id: int):
    producto = obtener_producto_por_id(db, producto_id)

    if not producto:
        return None, "El producto no existe o ya fue eliminado."

    producto.activo = False

    db.commit()
    db.refresh(producto)

    return producto, "Producto eliminado correctamente."