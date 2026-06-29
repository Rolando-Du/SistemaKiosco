from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.reportes_service import obtener_resumen_general

router = APIRouter(
    prefix="/reportes",
    tags=["Reportes"]
)


@router.get("/resumen")
def resumen_general(db: Session = Depends(obtener_db)):
    resumen = obtener_resumen_general(db)

    return {
        "mensaje": "Resumen general obtenido correctamente.",
        "resumen": resumen
    }