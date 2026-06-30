import { NavLink, Outlet, useNavigate } from "react-router";

import { cerrarSesion, obtenerSesion } from "../services/authService";

function MainLayout() {
  const navigate = useNavigate();
  const usuario = obtenerSesion();

  function manejarCerrarSesion() {
    cerrarSesion();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col bg-slate-950 p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold">Sistema Kiosco</h1>

            <div className="mt-4 rounded-2xl bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Usuario</p>
              <p className="mt-1 font-bold text-white">
                {usuario?.nombre || "Usuario"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Rol: {usuario?.rol || "-"}
              </p>
            </div>

            <nav className="mt-8 flex flex-col gap-3">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Productos
              </NavLink>

              <NavLink
                to="/ventas-pos"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Ventas POS
              </NavLink>

              <NavLink
                to="/historial-ventas"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Historial de ventas
              </NavLink>

              <NavLink
                to="/caja"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Caja
              </NavLink>

              <NavLink
                to="/compras"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Compras
              </NavLink>

              <NavLink
                to="/historial-compras"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Historial de compras
              </NavLink>

              <NavLink
                to="/proveedores"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                Proveedores
              </NavLink>
            </nav>
          </div>

          <button
            onClick={manejarCerrarSesion}
            className="mt-auto rounded-xl bg-red-600 px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;