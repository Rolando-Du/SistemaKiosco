from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.proveedores_service import (
    crear_proveedor,
    editar_proveedor,
    eliminar_proveedor,
    listar_proveedores,
    obtener_proveedor_por_id,
)

router = APIRouter(
    prefix="/proveedores",
    tags=["Proveedores"],
)


class ProveedorCrearRequest(BaseModel):
    nombre: str
    telefono: str | None = None
    email: str | None = None
    direccion: str | None = None


class ProveedorActualizarRequest(BaseModel):
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
        "fecha_creacion": proveedor.fecha_creacion,
    }


@router.get("/")
def obtener_proveedores(db: Session = Depends(obtener_db)):
    proveedores = listar_proveedores(db)
    return [convertir_proveedor(proveedor) for proveedor in proveedores]


@router.get("/{proveedor_id}")
def obtener_proveedor(
    proveedor_id: int,
    db: Session = Depends(obtener_db),
):
    proveedor = obtener_proveedor_por_id(db, proveedor_id)

    if not proveedor:
        return {
            "encontrado": False,
            "mensaje": "El proveedor no existe o está inactivo.",
        }

    return {
        "encontrado": True,
        "proveedor": convertir_proveedor(proveedor),
    }


@router.post("/")
def crear_nuevo_proveedor(
    datos: ProveedorCrearRequest,
    db: Session = Depends(obtener_db),
):
    proveedor, mensaje = crear_proveedor(
        db=db,
        nombre=datos.nombre,
        telefono=datos.telefono,
        email=datos.email,
        direccion=datos.direccion,
    )

    if not proveedor:
        return {
            "creado": False,
            "mensaje": mensaje,
        }

    return {
        "creado": True,
        "mensaje": mensaje,
        "proveedor": convertir_proveedor(proveedor),
    }


@router.put("/{proveedor_id}")
def actualizar_proveedor(
    proveedor_id: int,
    datos: ProveedorActualizarRequest,
    db: Session = Depends(obtener_db),
):
    proveedor, mensaje = editar_proveedor(
        db=db,
        proveedor_id=proveedor_id,
        nombre=datos.nombre,
        telefono=datos.telefono,
        email=datos.email,
        direccion=datos.direccion,
    )

    if not proveedor:
        return {
            "actualizado": False,
            "mensaje": mensaje,
        }

    return {
        "actualizado": True,
        "mensaje": mensaje,
        "proveedor": convertir_proveedor(proveedor),
    }


@router.delete("/{proveedor_id}")
def borrar_proveedor(
    proveedor_id: int,
    db: Session = Depends(obtener_db),
):
    proveedor, mensaje = eliminar_proveedor(
        db=db,
        proveedor_id=proveedor_id,
    )

    if not proveedor:
        return {
            "eliminado": False,
            "mensaje": mensaje,
        }

    return {
        "eliminado": True,
        "mensaje": mensaje,
        "proveedor": convertir_proveedor(proveedor),
    }