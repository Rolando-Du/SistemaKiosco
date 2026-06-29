const API_URL = "http://127.0.0.1:8000";

export async function obtenerCajaAbierta() {
  const respuesta = await fetch(`${API_URL}/caja/abierta`);

  if (!respuesta.ok) {
    throw new Error("No se pudo consultar la caja abierta.");
  }

  return await respuesta.json();
}

export async function abrirCaja(datosCaja) {
  const respuesta = await fetch(`${API_URL}/caja/abrir`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosCaja),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo abrir la caja.");
  }

  const datos = await respuesta.json();

  if (datos.abierta === false) {
    throw new Error(datos.mensaje || "No se pudo abrir la caja.");
  }

  return datos;
}

export async function cerrarCaja(datosCaja) {
  const respuesta = await fetch(`${API_URL}/caja/cerrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosCaja),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo cerrar la caja.");
  }

  const datos = await respuesta.json();

  if (datos.cerrada === false) {
    throw new Error(datos.mensaje || "No se pudo cerrar la caja.");
  }

  return datos;
}