const API_URL = "http://127.0.0.1:8000";

export async function obtenerResumenGeneral() {
  const respuesta = await fetch(`${API_URL}/reportes/resumen`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el resumen general.");
  }

  const datos = await respuesta.json();

  return datos.resumen;
}