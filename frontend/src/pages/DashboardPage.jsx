import { useEffect, useState } from "react";

import { obtenerResumenGeneral } from "../services/reportesService";

function DashboardPage() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarResumen() {
      try {
        const datos = await obtenerResumenGeneral();
        setResumen(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarResumen();
  }, []);

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">
        <h2 className="text-xl font-bold">Error al cargar el dashboard</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

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

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Backend conectado
          </span>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Productos</p>
          <strong className="mt-3 block text-3xl font-bold">
            {resumen.total_productos}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Total cargados</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <strong className="mt-3 block text-3xl font-bold">
            ${resumen.total_ventas}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {resumen.cantidad_ventas} ventas realizadas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Compras</p>
          <strong className="mt-3 block text-3xl font-bold">
            ${resumen.total_compras}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {resumen.cantidad_compras} compras realizadas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock bajo</p>
          <strong className="mt-3 block text-3xl font-bold">
            {resumen.productos_stock_bajo}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Productos a reponer</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">
          Resumen operativo
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-slate-500">Proveedores activos</p>
            <strong className="mt-2 block text-2xl">
              {resumen.total_proveedores}
            </strong>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-slate-500">Cantidad de ventas</p>
            <strong className="mt-2 block text-2xl">
              {resumen.cantidad_ventas}
            </strong>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-slate-500">Cantidad de compras</p>
            <strong className="mt-2 block text-2xl">
              {resumen.cantidad_compras}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;