import { API_URL } from "../config/api";

function prepararProveedorParaBackend(proveedor) {
  return {
    nombre: proveedor.nombre?.trim() || "",
    telefono: proveedor.telefono?.trim() || null,
    email: proveedor.email?.trim() || null,
    direccion: proveedor.direccion?.trim() || null,
  };
}

export async function obtenerProveedores() {
  const respuesta = await fetch(`${API_URL}/proveedores/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los proveedores.");
  }

  return await respuesta.json();
}

export async function obtenerProveedorPorId(proveedorId) {
  const respuesta = await fetch(`${API_URL}/proveedores/${proveedorId}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el proveedor.");
  }

  const datos = await respuesta.json();

  if (datos.encontrado === false) {
    throw new Error(datos.mensaje || "No se pudo obtener el proveedor.");
  }

  return datos.proveedor;
}

export async function crearProveedor(proveedor) {
  const proveedorPreparado = prepararProveedorParaBackend(proveedor);

  const respuesta = await fetch(`${API_URL}/proveedores/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proveedorPreparado),
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

export async function editarProveedor(proveedorId, proveedor) {
  const proveedorPreparado = prepararProveedorParaBackend(proveedor);

  const respuesta = await fetch(`${API_URL}/proveedores/${proveedorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proveedorPreparado),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo editar el proveedor.");
  }

  const datos = await respuesta.json();

  if (datos.actualizado === false) {
    throw new Error(datos.mensaje || "No se pudo editar el proveedor.");
  }

  return datos;
}

export async function eliminarProveedor(proveedorId) {
  const respuesta = await fetch(`${API_URL}/proveedores/${proveedorId}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el proveedor.");
  }

  const datos = await respuesta.json();

  if (datos.eliminado === false) {
    throw new Error(datos.mensaje || "No se pudo eliminar el proveedor.");
  }

  return datos;
}