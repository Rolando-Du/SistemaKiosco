import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

import {
  estaAutenticado,
  guardarSesion,
  loginUsuario,
} from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (estaAutenticado()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    try {
      setCargando(true);
      setError("");

      const datos = await loginUsuario({
        usuario,
        password,
      });

      guardarSesion(datos);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Sistema Kiosco
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Ingresá con tu usuario para continuar
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Usuario
            </label>

            <input
              type="text"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="admin123"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;