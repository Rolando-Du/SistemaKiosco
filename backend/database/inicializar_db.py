from database.conexion import Base, engine
from database import modelos


def crear_tablas():
    Base.metadata.create_all(bind=engine)
    print("Base de datos y tablas creadas correctamente.")


if __name__ == "__main__":
    crear_tablas()