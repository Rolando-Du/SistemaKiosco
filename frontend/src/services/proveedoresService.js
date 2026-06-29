const API_URL = "http://127.0.0.1:8000";

export async function obtenerProveedores() {
  const respuesta = await fetch(`${API_URL}/proveedores/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los proveedores.");
  }

  return await respuesta.json();
}

export async function crearProveedor(proveedor) {
  const respuesta = await fetch(`${API_URL}/proveedores/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proveedor),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear el proveedor.");
  }

  const datos = await respuesta.json();

  if (datos.creado === false) {
    throw new Error(datos.mensaje || "No se pudo crear el proveedor.");
  }

  return datos;
}