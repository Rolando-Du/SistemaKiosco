from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Base SQLite local.
# Este archivo se va a crear dentro de la carpeta backend con el nombre kiosco.db
DATABASE_URL = "sqlite:///./kiosco.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def obtener_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()