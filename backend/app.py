from fastapi import FastAPI

from routers.usuarios import router as usuarios_router
from routers.productos import router as productos_router
from routers.ventas import router as ventas_router
from routers.caja import router as caja_router
from routers.proveedores import router as proveedores_router
from routers.compras import router as compras_router

app = FastAPI(
    title="Sistema Kiosco API",
    description="Backend inicial para el sistema de gestión de kiosco, librería e impresiones.",
    version="1.0.0"
)

app.include_router(usuarios_router)
app.include_router(productos_router)
app.include_router(ventas_router)
app.include_router(caja_router)
app.include_router(proveedores_router)
app.include_router(compras_router)


@app.get("/")
def inicio():
    return {
        "mensaje": "Sistema Kiosco funcionando correctamente"
    }