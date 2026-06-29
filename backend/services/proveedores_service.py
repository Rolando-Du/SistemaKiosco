from sqlalchemy.orm import Session

from database.modelos import Proveedor


def crear_proveedor(
    db: Session,
    nombre: str,
    telefono: str | None = None,
    email: str | None = None,
    direccion: str | None = None
):
    if not nombre.strip():
        return None, "El nombre del proveedor es obligatorio."

    nuevo_proveedor = Proveedor(
        nombre=nombre.strip(),
        telefono=telefono,
        email=email,
        direccion=direccion,
        activo=True
    )

    db.add(nuevo_proveedor)
    db.commit()
    db.refresh(nuevo_proveedor)

    return nuevo_proveedor, "Proveedor creado correctamente."


def listar_proveedores(db: Session):
    proveedores = db.query(Proveedor).filter(
        Proveedor.activo == True
    ).order_by(Proveedor.nombre.asc()).all()

    return proveedores