from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.ventas_service import crear_venta, listar_ventas, obtener_detalle_venta

router = APIRouter(
    prefix="/ventas",
    tags=["Ventas"]
)


class ProductoVentaRequest(BaseModel):
    producto_id: int
    cantidad: int


class VentaCrearRequest(BaseModel):
    usuario_id: int
    metodo_pago: str = "EFECTIVO"
    productos: list[ProductoVentaRequest]


def convertir_venta(venta):
    return {
        "id": venta.id,
        "usuario_id": venta.usuario_id,
        "total": float(venta.total),
        "metodo_pago": venta.metodo_pago,
        "estado": venta.estado,
        "fecha_creacion": venta.fecha_creacion
    }


@router.get("/")
def obtener_ventas(db: Session = Depends(obtener_db)):
    ventas = listar_ventas(db)
    return [convertir_venta(venta) for venta in ventas]


@router.get("/{venta_id}")
def obtener_venta_por_id(
    venta_id: int,
    db: Session = Depends(obtener_db)
):
    venta, detalles, mensaje = obtener_detalle_venta(db, venta_id)

    if not venta:
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
        "venta": convertir_venta(venta),
        "detalle": detalle_productos
    }


@router.post("/")
def crear_nueva_venta(
    datos: VentaCrearRequest,
    db: Session = Depends(obtener_db)
):
    productos_vendidos = []

    for producto in datos.productos:
        productos_vendidos.append({
            "producto_id": producto.producto_id,
            "cantidad": producto.cantidad
        })

    venta, mensaje = crear_venta(
        db=db,
        usuario_id=datos.usuario_id,
        productos_vendidos=productos_vendidos,
        metodo_pago=datos.metodo_pago
    )

    if not venta:
        return {
            "creada": False,
            "mensaje": mensaje
        }

    return {
        "creada": True,
        "mensaje": mensaje,
        "venta": convertir_venta(venta)
    }