from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from database.conexion import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    usuario = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(30), nullable=False, default="VENDEDOR")
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)