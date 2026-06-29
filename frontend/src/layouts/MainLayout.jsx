import { NavLink, Outlet } from "react-router";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-950 text-white p-6">
          <h1 className="text-2xl font-bold mb-8">Sistema Kiosco</h1>

          <nav className="flex flex-col gap-3">
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

            <button className="rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              Productos
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              Ventas POS
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              Caja
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              Compras
            </button>

            <button className="rounded-xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-700">
              Proveedores
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;