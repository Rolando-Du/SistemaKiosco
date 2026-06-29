from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.proveedores_service import crear_proveedor, listar_proveedores

router = APIRouter(
    prefix="/proveedores",
    tags=["Proveedores"]
)


class ProveedorCrearRequest(BaseModel):
    nombre: str
    telefono: str | None = None
    email: str | None = None
    direccion: str | None = None


def convertir_proveedor(proveedor):
    return {
        "id": proveedor.id,
        "nombre": proveedor.nombre,
        "telefono": proveedor.telefono,
        "email": proveedor.email,
        "direccion": proveedor.direccion,
        "activo": proveedor.activo,
        "fecha_creacion": proveedor.fecha_creacion
    }


@router.get("/")
def obtener_proveedores(db: Session = Depends(obtener_db)):
    proveedores = listar_proveedores(db)
    return [convertir_proveedor(proveedor) for proveedor in proveedores]


@router.post("/")
def crear_nuevo_proveedor(
    datos: ProveedorCrearRequest,
    db: Session = Depends(obtener_db)
):
    proveedor, mensaje = crear_proveedor(
        db=db,
        nombre=datos.nombre,
        telefono=datos.telefono,
        email=datos.email,
        direccion=datos.direccion
    )

    if not proveedor:
        return {
            "creado": False,
            "mensaje": mensaje
        }

    return {
        "creado": True,
        "mensaje": mensaje,
        "proveedor": convertir_proveedor(proveedor)
    }