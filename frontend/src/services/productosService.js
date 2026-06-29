import { API_URL } from "../config/api";

export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/productos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  const datos = await respuesta.json();

  return datos;
}

export async function crearProducto(producto) {
  const respuesta = await fetch(`${API_URL}/productos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear el producto.");
  }

  const datos = await respuesta.json();

  if (datos.creado === false) {
    throw new Error(datos.mensaje || "No se pudo crear el producto.");
  }

  return datos;
}