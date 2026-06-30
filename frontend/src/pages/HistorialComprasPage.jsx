import { useEffect, useState } from "react";

import { obtenerCompras } from "../services/comprasService";
import { obtenerProveedores } from "../services/proveedoresService";

function formatearDinero(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function HistorialComprasPage() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    Promise.all([obtenerCompras(), obtenerProveedores()])
      .then(([comprasDatos, proveedoresDatos]) => {
        if (componenteActivo) {
          setCompras(comprasDatos);
          setProveedores(proveedoresDatos);
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

  async function actualizarCompras() {
    try {
      setActualizando(true);
      setError("");

      const [comprasDatos, proveedoresDatos] = await Promise.all([
        obtenerCompras(),
        obtenerProveedores(),
      ]);

      setCompras(comprasDatos);
      setProveedores(proveedoresDatos);
    } catch (error) {
      setError(error.message);
    } finally {
      setActualizando(false);
    }
  }

  function obtenerNombreProveedor(proveedorId) {
    const proveedor = proveedores.find(
      (item) => item.id === Number(proveedorId),
    );

    return proveedor ? proveedor.nombre : `Proveedor #${proveedorId}`;
  }

  function calcularTotalComprado() {
    return compras.reduce((total, compra) => total + Number(compra.total), 0);
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando historial de compras...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Historial de compras
            </h2>
            <p className="mt-2 text-slate-500">
              Consulta de compras registradas a proveedores
            </p>
          </div>

          <button
            onClick={actualizarCompras}
            disabled={actualizando}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
          >
            {actualizando ? "Actualizando..." : "Actualizar compras"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Compras</p>
          <strong className="mt-3 block text-2xl font-bold text-slate-900 sm:text-3xl">
            {compras.length}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Total registradas</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total comprado</p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 sm:text-3xl">
            {formatearDinero(calcularTotalComprado())}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Importe acumulado</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Promedio</p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 sm:text-3xl">
            {compras.length > 0
              ? formatearDinero(calcularTotalComprado() / compras.length)
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Promedio por compra</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4 md:hidden">
          {compras.map((compra) => (
            <article
              key={compra.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Compra</p>
                  <strong className="text-slate-900">#{compra.id}</strong>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {compra.estado}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Proveedor</p>
                  <strong className="mt-1 block wrap-break-word text-slate-900">
                    {obtenerNombreProveedor(compra.proveedor_id)}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Total</p>
                  <strong className="mt-1 block text-slate-900">
                    {formatearDinero(compra.total)}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Usuario</p>
                  <strong className="mt-1 block text-slate-900">
                    Usuario #{compra.usuario_id}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Fecha</p>
                  <strong className="mt-1 block wrap-break-word text-slate-900">
                    {new Date(compra.fecha_creacion).toLocaleString()}
                  </strong>
                </div>
              </div>
            </article>
          ))}

          {compras.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Todavía no hay compras registradas.
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-225 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">N° compra</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {compras.map((compra) => (
                <tr
                  key={compra.id}
                  className="border-b border-slate-100 text-sm hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-bold text-slate-700">
                    #{compra.id}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {obtenerNombreProveedor(compra.proveedor_id)}
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-900">
                    {formatearDinero(compra.total)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {compra.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    Usuario #{compra.usuario_id}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {new Date(compra.fecha_creacion).toLocaleString()}
                  </td>
                </tr>
              ))}

              {compras.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Todavía no hay compras registradas.
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

export default HistorialComprasPage;