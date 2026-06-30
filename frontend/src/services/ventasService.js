import { API_URL } from "../config/api";

export async function obtenerVentas() {
  const respuesta = await fetch(`${API_URL}/ventas/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las ventas.");
  }

  return await respuesta.json();
}

export async function crearVenta(venta) {
  const respuesta = await fetch(`${API_URL}/ventas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(venta),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear la venta.");
  }

  const datos = await respuesta.json();

  if (datos.creada === false) {
    throw new Error(datos.mensaje || "No se pudo crear la venta.");
  }

  return datos;
}