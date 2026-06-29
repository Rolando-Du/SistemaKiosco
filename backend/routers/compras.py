from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.compras_service import crear_compra, listar_compras, obtener_detalle_compra

router = APIRouter(
    prefix="/compras",
    tags=["Compras"]
)


class ProductoCompraRequest(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float


class CompraCrearRequest(BaseModel):
    proveedor_id: int
    usuario_id: int
    productos: list[ProductoCompraRequest]


def convertir_compra(compra):
    return {
        "id": compra.id,
        "proveedor_id": compra.proveedor_id,
        "usuario_id": compra.usuario_id,
        "total": float(compra.total),
        "estado": compra.estado,
        "fecha_creacion": compra.fecha_creacion
    }


@router.get("/")
def obtener_compras(db: Session = Depends(obtener_db)):
    compras = listar_compras(db)
    return [convertir_compra(compra) for compra in compras]


@router.get("/{compra_id}")
def obtener_compra_por_id(
    compra_id: int,
    db: Session = Depends(obtener_db)
):
    compra, detalles, mensaje = obtener_detalle_compra(db, compra_id)

    if not compra:
        return {
            "encontrada": False,
            "mensaje": mensaje
        }

    detalle_productos = []

    for detalle, producto in detalles:
        detalle_productos.append({
            "producto_id": producto.id,
            "codigo": producto.codigo,
            "nombre": producto.nombre,
            "cantidad": detalle.cantidad,
            "precio_unitario": float(detalle.precio_unitario),
            "subtotal": float(detalle.subtotal)
        })

    return {
        "encontrada": True,
        "mensaje": mensaje,
        "compra": convertir_compra(compra),
        "detalle": detalle_productos
    }


@router.post("/")
def crear_nueva_compra(
    datos: CompraCrearRequest,
    db: Session = Depends(obtener_db)
):
    productos_comprados = []

    for producto in datos.productos:
        productos_comprados.append({
            "producto_id": producto.producto_id,
            "cantidad": producto.cantidad,
            "precio_unitario": producto.precio_unitario
        })

    compra, mensaje = crear_compra(
        db=db,
        proveedor_id=datos.proveedor_id,
        usuario_id=datos.usuario_id,
        productos_comprados=productos_comprados
    )

    if not compra:
        return {
            "creada": False,
            "mensaje": mensaje
        }

    return {
        "creada": True,
        "mensaje": mensaje,
        "compra": convertir_compra(compra)
    }