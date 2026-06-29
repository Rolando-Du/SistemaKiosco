const API_URL = "http://127.0.0.1:8000";

export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/productos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  const datos = await respuesta.json();

  return datos;
}