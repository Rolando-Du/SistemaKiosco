from decimal import Decimal

from sqlalchemy import or_
from sqlalchemy.orm import Session

from database.modelos import Categoria, Producto


def crear_producto(
    db: Session,
    codigo: str,
    nombre: str,
    categoria_id: int,
    precio_compra: float,
    precio_venta: float,
    stock: int,
    stock_minimo: int,
    codigo_barras: str | None = None
):
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
        activo=True
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


def buscar_productos(db: Session, texto_busqueda: str):
    termino = f"%{texto_busqueda}%"

    productos = db.query(Producto).filter(
        Producto.activo == True,
        or_(
            Producto.nombre.ilike(termino),
            Producto.codigo.ilike(termino),
            Producto.codigo_barras.ilike(termino)
        )
    ).order_by(Producto.nombre.asc()).all()

    return productos


def listar_productos_stock_bajo(db: Session):
    productos = db.query(Producto).filter(
        Producto.activo == True,
        Producto.stock <= Producto.stock_minimo
    ).order_by(Producto.nombre.asc()).all()

    return productos