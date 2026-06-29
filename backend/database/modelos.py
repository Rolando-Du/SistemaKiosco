from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String

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


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), unique=True, index=True, nullable=False)
    codigo_barras = Column(String(100), unique=True, index=True, nullable=True)
    nombre = Column(String(150), index=True, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=False)
    precio_compra = Column(Numeric(10, 2), nullable=False, default=0)
    precio_venta = Column(Numeric(10, 2), nullable=False, default=0)
    stock = Column(Integer, nullable=False, default=0)
    stock_minimo = Column(Integer, nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)


class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False, default=0)
    metodo_pago = Column(String(30), nullable=False, default="EFECTIVO")
    estado = Column(String(30), nullable=False, default="FINALIZADA")
    fecha_creacion = Column(DateTime, nullable=False, default=datetime.now)


class VentaDetalle(Base):
    __tablename__ = "ventas_detalle"

    id = Column(Integer, primary_key=True, index=True)
    venta_id = Column(Integer, ForeignKey("ventas.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)


class Caja(Base):
    __tablename__ = "cajas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    monto_inicial = Column(Numeric(10, 2), nullable=False, default=0)
    monto_final = Column(Numeric(10, 2), nullable=True)
    total_ventas = Column(Numeric(10, 2), nullable=False, default=0)
    diferencia = Column(Numeric(10, 2), nullable=True)
    estado = Column(String(30), nullable=False, default="ABIERTA")
    fecha_apertura = Column(DateTime, nullable=False, default=datetime.now)
    fecha_cierre = Column(DateTime, nullable=True)