from database.conexion import SessionLocal
from database.modelos import Categoria


CATEGORIAS_INICIALES = [
    "Bebidas",
    "Golosinas",
    "Snacks",
    "Librería",
    "Impresiones",
    "Fotocopias",
    "Otros"
]


def crear_categorias_iniciales():
    db = SessionLocal()

    try:
        for nombre_categoria in CATEGORIAS_INICIALES:
            categoria_existente = db.query(Categoria).filter(
                Categoria.nombre == nombre_categoria
            ).first()

            if not categoria_existente:
                nueva_categoria = Categoria(
                    nombre=nombre_categoria,
                    activo=True
                )
                db.add(nueva_categoria)

        db.commit()
        print("Categorías iniciales creadas correctamente.")

    finally:
        db.close()


if __name__ == "__main__":
    crear_categorias_iniciales()