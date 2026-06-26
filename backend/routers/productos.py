from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.productos_service import (
    crear_producto,
    listar_productos,
    buscar_productos,
    listar_productos_stock_bajo
)

router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


class ProductoCrearRequest(BaseModel):
    codigo: str
    nombre: str
    categoria_id: int
    precio_compra: float
    precio_venta: float
    stock: int
    stock_minimo: int
    codigo_barras: str | None = None


def convertir_producto(producto):
    return {
        "id": producto.id,
        "codigo": producto.codigo,
        "codigo_barras": producto.codigo_barras,
        "nombre": producto.nombre,
        "categoria_id": producto.categoria_id,
        "precio_compra": float(producto.precio_compra),
        "precio_venta": float(producto.precio_venta),
        "stock": producto.stock,
        "stock_minimo": producto.stock_minimo,
        "activo": producto.activo
    }


@router.get("/")
def obtener_productos(db: Session = Depends(obtener_db)):
    productos = listar_productos(db)
    return [convertir_producto(producto) for producto in productos]


@router.get("/buscar")
def buscar(
    texto: str = Query(..., min_length=1),
    db: Session = Depends(obtener_db)
):
    productos = buscar_productos(db, texto)
    return [convertir_producto(producto) for producto in productos]


@router.get("/stock-bajo")
def obtener_stock_bajo(db: Session = Depends(obtener_db)):
    productos = listar_productos_stock_bajo(db)
    return [convertir_producto(producto) for producto in productos]


@router.post("/")
def crear_nuevo_producto(
    datos: ProductoCrearRequest,
    db: Session = Depends(obtener_db)
):
    producto, mensaje = crear_producto(
        db=db,
        codigo=datos.codigo,
        nombre=datos.nombre,
        categoria_id=datos.categoria_id,
        precio_compra=datos.precio_compra,
        precio_venta=datos.precio_venta,
        stock=datos.stock,
        stock_minimo=datos.stock_minimo,
        codigo_barras=datos.codigo_barras
    )

    if not producto:
        return {
            "creado": False,
            "mensaje": mensaje
        }

    return {
        "creado": True,
        "mensaje": mensaje,
        "producto": convertir_producto(producto)
    }