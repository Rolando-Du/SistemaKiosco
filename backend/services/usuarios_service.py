from sqlalchemy.orm import Session

from database.modelos import Usuario
from seguridad.auth import verificar_password


def login_usuario(db: Session, usuario: str, password: str):
    usuario_encontrado = db.query(Usuario).filter(
        Usuario.usuario == usuario
    ).first()

    if not usuario_encontrado:
        return None

    if not usuario_encontrado.activo:
        return None

    password_correcta = verificar_password(
        password,
        usuario_encontrado.password_hash
    )

    if not password_correcta:
        return None

    return usuario_encontrado