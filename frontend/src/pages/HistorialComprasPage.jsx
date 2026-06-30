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
      (item) => item.id === Number(proveedorId)
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Historial de compras
            </h2>
            <p className="mt-2 text-slate-500">
              Consulta de compras registradas a proveedores
            </p>
          </div>

          <button
            onClick={actualizarCompras}
            disabled={actualizando}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
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

      <section className="mb-6 grid grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Compras</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {compras.length}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Total registradas</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total comprado</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {formatearDinero(calcularTotalComprado())}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Importe acumulado</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Promedio</p>
          <strong className="mt-3 block text-3xl font-bold text-slate-900">
            {compras.length > 0
              ? formatearDinero(calcularTotalComprado() / compras.length)
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Promedio por compra</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
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