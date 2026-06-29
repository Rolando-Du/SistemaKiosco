import { API_URL } from "../config/api";

export async function obtenerCompras() {
  const respuesta = await fetch(`${API_URL}/compras/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las compras.");
  }

  return await respuesta.json();
}

export async function crearCompra(compra) {
  const respuesta = await fetch(`${API_URL}/compras/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(compra),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear la compra.");
  }

  const datos = await respuesta.json();

  if (datos.creada === false) {
    throw new Error(datos.mensaje || "No se pudo crear la compra.");
  }

  return datos;
}