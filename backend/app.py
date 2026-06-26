from fastapi import FastAPI

from routers.usuarios import router as usuarios_router
from routers.productos import router as productos_router

app = FastAPI(
    title="Sistema Kiosco API",
    description="Backend inicial para el sistema de gestión de kiosco, librería e impresiones.",
    version="1.0.0"
)

app.include_router(usuarios_router)
app.include_router(productos_router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Sistema Kiosco funcionando correctamente"
    }