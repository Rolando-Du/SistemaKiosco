import { NavLink, Outlet, useNavigate } from "react-router";

import { cerrarSesion, obtenerSesion } from "../services/authService";

function MainLayout() {
  const navigate = useNavigate();
  const usuario = obtenerSesion();

  function manejarCerrarSesion() {
    cerrarSesion();
    navigate("/login", { replace: true });
  }

  function estiloLink({ isActive }) {
    return `rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
    }`;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="flex w-full flex-col bg-slate-950 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
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

            <nav className="mt-8 flex flex-col gap-6 pb-6">
              <div>
                <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Inicio
                </p>

                <div className="flex flex-col gap-3">
                  <NavLink to="/dashboard" className={estiloLink}>
                    Dashboard
                  </NavLink>
                </div>
              </div>

              <div>
                <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Operación
                </p>

                <div className="flex flex-col gap-3">
                  <NavLink to="/ventas-pos" className={estiloLink}>
                    Ventas POS
                  </NavLink>

                  <NavLink to="/caja" className={estiloLink}>
                    Caja
                  </NavLink>
                </div>
              </div>

              <div>
                <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Inventario
                </p>

                <div className="flex flex-col gap-3">
                  <NavLink to="/productos" className={estiloLink}>
                    Productos
                  </NavLink>
                </div>
              </div>

              <div>
                <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Compras y proveedores
                </p>

                <div className="flex flex-col gap-3">
                  <NavLink to="/compras" className={estiloLink}>
                    Compras
                  </NavLink>

                  <NavLink to="/proveedores" className={estiloLink}>
                    Proveedores
                  </NavLink>
                </div>
              </div>

              <div>
                <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Reportes
                </p>

                <div className="flex flex-col gap-3">
                  <NavLink to="/historial-ventas" className={estiloLink}>
                    Historial de ventas
                  </NavLink>

                  <NavLink to="/historial-compras" className={estiloLink}>
                    Historial de compras
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>

          <div className="shrink-0 border-t border-slate-800 pt-4">
            <button
              onClick={manejarCerrarSesion}
              className="w-full rounded-xl bg-red-600 px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;