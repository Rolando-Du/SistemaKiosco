import { API_URL } from "../config/api";

const CLAVE_SESION = "sistema_kiosco_usuario";

export async function loginUsuario(credenciales) {
  const respuesta = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credenciales),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo iniciar sesión.");
  }

  const datos = await respuesta.json();

  if (datos.acceso === false) {
    throw new Error(datos.mensaje || "Usuario o contraseña incorrectos.");
  }

  return datos;
}

export function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

export function obtenerSesion() {
  const sesion = localStorage.getItem(CLAVE_SESION);

  if (!sesion) {
    return null;
  }

  return JSON.parse(sesion);
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

export function estaAutenticado() {
  return obtenerSesion() !== null;
}