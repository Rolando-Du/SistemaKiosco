function DashboardPage() {
  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
            <p className="mt-2 text-slate-500">
              Resumen general del sistema
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Backend conectado luego
          </span>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Productos</p>
          <strong className="mt-3 block text-3xl font-bold">0</strong>
          <p className="mt-2 text-sm text-slate-400">Total cargados</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <strong className="mt-3 block text-3xl font-bold">$0</strong>
          <p className="mt-2 text-sm text-slate-400">Total vendido</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Compras</p>
          <strong className="mt-3 block text-3xl font-bold">$0</strong>
          <p className="mt-2 text-sm text-slate-400">Total comprado</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock bajo</p>
          <strong className="mt-3 block text-3xl font-bold">0</strong>
          <p className="mt-2 text-sm text-slate-400">Productos a reponer</p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;