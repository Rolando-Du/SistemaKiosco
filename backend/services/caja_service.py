from datetime import datetime
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from database.modelos import Caja, Usuario, Venta


def obtener_caja_abierta(db: Session):
    caja = db.query(Caja).filter(
        Caja.estado == "ABIERTA"
    ).first()

    return caja


def abrir_caja(
    db: Session,
    usuario_id: int,
    monto_inicial: float
):
    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id,
        Usuario.activo == True
    ).first()

    if not usuario:
        return None, "El usuario no existe o está inactivo."

    caja_abierta = obtener_caja_abierta(db)

    if caja_abierta:
        return None, "Ya existe una caja abierta."

    if monto_inicial < 0:
        return None, "El monto inicial no puede ser negativo."

    nueva_caja = Caja(
        usuario_id=usuario_id,
        monto_inicial=Decimal(str(monto_inicial)),
        total_ventas=Decimal("0"),
        estado="ABIERTA"
    )

    db.add(nueva_caja)
    db.commit()
    db.refresh(nueva_caja)

    return nueva_caja, "Caja abierta correctamente."


def cerrar_caja(
    db: Session,
    monto_final: float
):
    caja_abierta = obtener_caja_abierta(db)

    if not caja_abierta:
        return None, "No hay una caja abierta para cerrar."

    if monto_final < 0:
        return None, "El monto final no puede ser negativo."

    total_ventas = db.query(
        func.coalesce(func.sum(Venta.total), 0)
    ).filter(
        Venta.estado == "FINALIZADA",
        Venta.fecha_creacion >= caja_abierta.fecha_apertura
    ).scalar()

    total_ventas = Decimal(str(total_ventas))
    monto_final_decimal = Decimal(str(monto_final))

    total_esperado = caja_abierta.monto_inicial + total_ventas
    diferencia = monto_final_decimal - total_esperado

    caja_abierta.monto_final = monto_final_decimal
    caja_abierta.total_ventas = total_ventas
    caja_abierta.diferencia = diferencia
    caja_abierta.estado = "CERRADA"
    caja_abierta.fecha_cierre = datetime.now()

    db.commit()
    db.refresh(caja_abierta)

    return caja_abierta, "Caja cerrada correctamente."