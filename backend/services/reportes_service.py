from sqlalchemy import func
from sqlalchemy.orm import Session

from database.modelos import Compra, Producto, Proveedor, Venta


def obtener_resumen_general(db: Session):
    total_productos = db.query(Producto).filter(
        Producto.activo == True
    ).count()

    productos_stock_bajo = db.query(Producto).filter(
        Producto.activo == True,
        Producto.stock <= Producto.stock_minimo
    ).count()

    total_proveedores = db.query(Proveedor).filter(
        Proveedor.activo == True
    ).count()

    total_ventas = db.query(
        func.coalesce(func.sum(Venta.total), 0)
    ).filter(
        Venta.estado == "FINALIZADA"
    ).scalar()

    cantidad_ventas = db.query(Venta).filter(
        Venta.estado == "FINALIZADA"
    ).count()

    total_compras = db.query(
        func.coalesce(func.sum(Compra.total), 0)
    ).filter(
        Compra.estado == "FINALIZADA"
    ).scalar()

    cantidad_compras = db.query(Compra).filter(
        Compra.estado == "FINALIZADA"
    ).count()

    return {
        "total_productos": total_productos,
        "productos_stock_bajo": productos_stock_bajo,
        "total_proveedores": total_proveedores,
        "cantidad_ventas": cantidad_ventas,
        "total_ventas": float(total_ventas),
        "cantidad_compras": cantidad_compras,
        "total_compras": float(total_compras)
    }