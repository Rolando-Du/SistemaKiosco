import { useEffect, useState } from "react";

import { obtenerVentas } from "../services/ventasService";

function formatearDinero(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function HistorialVentasPage() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    obtenerVentas()
      .then((datos) => {
        if (componenteActivo) {
          setVentas(datos);
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

  async function actualizarVentas() {
    try {
      setActualizando(true);
      setError("");

      const datos = await obtenerVentas();
      setVentas(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setActualizando(false);
    }
  }

  function calcularTotalVendido() {
    return ventas.reduce((total, venta) => total + Number(venta.total), 0);
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando historial de ventas...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Historial de ventas
            </h2>
            <p className="mt-2 text-slate-500">
              Consulta de ventas registradas en el sistema
            </p>
          </div>

          <button
            onClick={actualizarVentas}
            disabled={actualizando}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {actualizando ? "Actualizando..." : "Actualizar ventas"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ventas</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {ventas.length}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Total registradas</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total vendido</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {formatearDinero(calcularTotalVendido())}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Importe acumulado</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Promedio</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {ventas.length > 0
              ? formatearDinero(calcularTotalVendido() / ventas.length)
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Promedio por venta</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">N° venta</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Método de pago</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {ventas.map((venta) => (
                <tr
                  key={venta.id}
                  className="border-b border-slate-100 text-sm hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-bold text-slate-700">
                    #{venta.id}
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-900">
                    {formatearDinero(venta.total)}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {venta.metodo_pago}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {venta.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    Usuario #{venta.usuario_id}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {new Date(venta.fecha_creacion).toLocaleString()}
                  </td>
                </tr>
              ))}

              {ventas.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Todavía no hay ventas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default HistorialVentasPage;