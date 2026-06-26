from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.conexion import obtener_db
from services.usuarios_service import login_usuario

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


class LoginRequest(BaseModel):
    usuario: str
    password: str


@router.post("/login")
def login(datos: LoginRequest, db: Session = Depends(obtener_db)):
    usuario = login_usuario(
        db=db,
        usuario=datos.usuario,
        password=datos.password
    )

    if not usuario:
        return {
            "acceso": False,
            "mensaje": "Usuario o contraseña incorrectos"
        }

    return {
        "acceso": True,
        "mensaje": "Login correcto",
        "usuario": usuario.usuario,
        "nombre": usuario.nombre,
        "rol": usuario.rol
    }