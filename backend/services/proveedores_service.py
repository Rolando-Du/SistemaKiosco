from sqlalchemy.orm import Session

from database.modelos import Proveedor


def crear_proveedor(
    db: Session,
    nombre: str,
    telefono: str | None = None,
    email: str | None = None,
    direccion: str | None = None,
):
    nombre = nombre.strip()
    telefono = telefono.strip() if telefono else None
    email = email.strip() if email else None
    direccion = direccion.strip() if direccion else None

    if not nombre:
        return None, "El nombre del proveedor es obligatorio."

    nuevo_proveedor = Proveedor(
        nombre=nombre,
        telefono=telefono,
        email=email,
        direccion=direccion,
        activo=True,
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


def obtener_proveedor_por_id(db: Session, proveedor_id: int):
    proveedor = db.query(Proveedor).filter(
        Proveedor.id == proveedor_id,
        Proveedor.activo == True
    ).first()

    return proveedor


def editar_proveedor(
    db: Session,
    proveedor_id: int,
    nombre: str,
    telefono: str | None = None,
    email: str | None = None,
    direccion: str | None = None,
):
    proveedor = obtener_proveedor_por_id(db, proveedor_id)

    if not proveedor:
        return None, "El proveedor no existe o está inactivo."

    nombre = nombre.strip()
    telefono = telefono.strip() if telefono else None
    email = email.strip() if email else None
    direccion = direccion.strip() if direccion else None

    if not nombre:
        return None, "El nombre del proveedor es obligatorio."

    proveedor.nombre = nombre
    proveedor.telefono = telefono
    proveedor.email = email
    proveedor.direccion = direccion

    db.commit()
    db.refresh(proveedor)

    return proveedor, "Proveedor actualizado correctamente."


def eliminar_proveedor(db: Session, proveedor_id: int):
    proveedor = obtener_proveedor_por_id(db, proveedor_id)

    if not proveedor:
        return None, "El proveedor no existe o ya fue eliminado."

    proveedor.activo = False

    db.commit()
    db.refresh(proveedor)

    return proveedor, "Proveedor eliminado correctamente."