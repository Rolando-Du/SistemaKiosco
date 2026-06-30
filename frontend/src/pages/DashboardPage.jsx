import { useEffect, useState } from "react";

import { obtenerResumenGeneral } from "../services/reportesService";

function formatearDinero(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function DashboardPage() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    obtenerResumenGeneral()
      .then((datos) => {
        if (componenteActivo) {
          setResumen(datos);
        }
      })
      .catch((error) => {
        if (componenteActivo) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (componenteActivo) {
          setCargando(false);
        }
      });

    return () => {
      componenteActivo = false;
    };
  }, []);

  async function actualizarDashboard() {
    try {
      setActualizando(true);
      setError("");

      const datos = await obtenerResumenGeneral();
      setResumen(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setActualizando(false);
    }
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando dashboard...</p>
      </div>
    );
  }

  if (error && !resumen) {
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Dashboard
            </h2>
            <p className="mt-2 text-slate-500">
              Resumen general actualizado del sistema
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              Sistema activo
            </span>

            <button
              onClick={actualizarDashboard}
              disabled={actualizando}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {actualizando ? "Actualizando..." : "Actualizar datos"}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Productos</p>
          <strong className="mt-3 block text-2xl font-bold text-slate-900 lg:text-3xl">
            {resumen.total_productos}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Total cargados</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 lg:text-3xl">
            {formatearDinero(resumen.total_ventas)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {resumen.cantidad_ventas} ventas realizadas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Compras</p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 lg:text-3xl">
            {formatearDinero(resumen.total_compras)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {resumen.cantidad_compras} compras realizadas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Stock bajo</p>
          <strong
            className={`mt-3 block text-2xl font-bold lg:text-3xl ${
              resumen.productos_stock_bajo > 0
                ? "text-red-600"
                : "text-green-700"
            }`}
          >
            {resumen.productos_stock_bajo}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Productos a reponer</p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Proveedores activos
          </p>
          <strong className="mt-3 block text-2xl font-bold text-slate-900 lg:text-3xl">
            {resumen.total_proveedores}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            Proveedores disponibles para compras
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Promedio por venta
          </p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 lg:text-3xl">
            {resumen.cantidad_ventas > 0
              ? formatearDinero(resumen.total_ventas / resumen.cantidad_ventas)
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            Total vendido dividido por ventas
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Promedio por compra
          </p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 lg:text-3xl">
            {resumen.cantidad_compras > 0
              ? formatearDinero(
                  resumen.total_compras / resumen.cantidad_compras,
                )
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            Total comprado dividido por compras
          </p>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;