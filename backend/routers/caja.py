from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.caja_service import abrir_caja, cerrar_caja, obtener_caja_abierta

router = APIRouter(
    prefix="/caja",
    tags=["Caja"]
)


class AbrirCajaRequest(BaseModel):
    usuario_id: int
    monto_inicial: float


class CerrarCajaRequest(BaseModel):
    monto_final: float


def convertir_caja(caja):
    return {
        "id": caja.id,
        "usuario_id": caja.usuario_id,
        "monto_inicial": float(caja.monto_inicial),
        "monto_final": float(caja.monto_final) if caja.monto_final is not None else None,
        "total_ventas": float(caja.total_ventas),
        "diferencia": float(caja.diferencia) if caja.diferencia is not None else None,
        "estado": caja.estado,
        "fecha_apertura": caja.fecha_apertura,
        "fecha_cierre": caja.fecha_cierre
    }


@router.get("/abierta")
def obtener_abierta(db: Session = Depends(obtener_db)):
    caja = obtener_caja_abierta(db)

    if not caja:
        return {
            "abierta": False,
            "mensaje": "No hay caja abierta."
        }

    return {
        "abierta": True,
        "mensaje": "Caja abierta encontrada.",
        "caja": convertir_caja(caja)
    }


@router.post("/abrir")
def abrir(
    datos: AbrirCajaRequest,
    db: Session = Depends(obtener_db)
):
    caja, mensaje = abrir_caja(
        db=db,
        usuario_id=datos.usuario_id,
        monto_inicial=datos.monto_inicial
    )

    if not caja:
        return {
            "abierta": False,
            "mensaje": mensaje
        }

    return {
        "abierta": True,
        "mensaje": mensaje,
        "caja": convertir_caja(caja)
    }


@router.post("/cerrar")
def cerrar(
    datos: CerrarCajaRequest,
    db: Session = Depends(obtener_db)
):
    caja, mensaje = cerrar_caja(
        db=db,
        monto_final=datos.monto_final
    )

    if not caja:
        return {
            "cerrada": False,
            "mensaje": mensaje
        }

    return {
        "cerrada": True,
        "mensaje": mensaje,
        "caja": convertir_caja(caja)
    }