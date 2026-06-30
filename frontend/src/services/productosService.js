import { API_URL } from "../config/api";

function prepararProductoParaBackend(producto) {
  return {
    codigo: producto.codigo?.trim() || null,
    codigo_barras: producto.codigo_barras?.trim() || null,
    nombre: producto.nombre?.trim() || "",
    categoria_id: Number(producto.categoria_id),
    precio_compra: Number(producto.precio_compra),
    precio_venta: Number(producto.precio_venta),
    stock: Number(producto.stock),
    stock_minimo: Number(producto.stock_minimo),
  };
}

export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/productos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  const datos = await respuesta.json();

  return datos;
}

export async function obtenerProductoPorId(productoId) {
  const respuesta = await fetch(`${API_URL}/productos/${productoId}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el producto.");
  }

  const datos = await respuesta.json();

  if (datos.encontrado === false) {
    throw new Error(datos.mensaje || "No se pudo obtener el producto.");
  }

  return datos.producto;
}

export async function crearProducto(producto) {
  const productoPreparado = prepararProductoParaBackend(producto);

  const respuesta = await fetch(`${API_URL}/productos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productoPreparado),
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

export async function editarProducto(productoId, producto) {
  const productoPreparado = prepararProductoParaBackend(producto);

  const respuesta = await fetch(`${API_URL}/productos/${productoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productoPreparado),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo editar el producto.");
  }

  const datos = await respuesta.json();

  if (datos.actualizado === false) {
    throw new Error(datos.mensaje || "No se pudo editar el producto.");
  }

  return datos;
}

export async function eliminarProducto(productoId) {
  const respuesta = await fetch(`${API_URL}/productos/${productoId}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el producto.");
  }

  const datos = await respuesta.json();

  if (datos.eliminado === false) {
    throw new Error(datos.mensaje || "No se pudo eliminar el producto.");
  }

  return datos;
}