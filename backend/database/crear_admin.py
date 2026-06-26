from database.conexion import SessionLocal
from database.modelos import Usuario
from seguridad.auth import crear_hash_password


def crear_usuario_admin():
    db = SessionLocal()

    try:
        admin_existente = db.query(Usuario).filter(
            Usuario.usuario == "admin"
        ).first()

        if admin_existente:
            print("El usuario admin ya existe.")
            return

        nuevo_admin = Usuario(
            nombre="Administrador",
            usuario="admin",
            password_hash=crear_hash_password("admin123"),
            rol="ADMIN",
            activo=True
        )

        db.add(nuevo_admin)
        db.commit()

        print("Usuario admin creado correctamente.")

    finally:
        db.close()


if __name__ == "__main__":
    crear_usuario_admin()