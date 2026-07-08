import { useEffect, useState } from "react";

import {
  obtenerDetalleVenta,
  obtenerVentas,
} from "../services/ventasService";

const filtrosIniciales = {
  fechaDesde: "",
  fechaHasta: "",
};

function formatearDinero(valor) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-AR");
}

function crearFechaDesde(valor) {
  if (!valor) {
    return null;
  }

  return new Date(`${valor}T00:00:00`);
}

function crearFechaHasta(valor) {
  if (!valor) {
    return null;
  }

  return new Date(`${valor}T23:59:59.999`);
}

function HistorialVentasPage() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [filtrosFormulario, setFiltrosFormulario] =
    useState(filtrosIniciales);
  const [filtrosAplicados, setFiltrosAplicados] = useState(filtrosIniciales);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [cargandoDetalleId, setCargandoDetalleId] = useState(null);
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

  async function verDetalleVenta(ventaId) {
    try {
      setCargandoDetalleId(ventaId);
      setError("");

      const datos = await obtenerDetalleVenta(ventaId);

      setVentaSeleccionada(datos.venta);
      setDetalleVenta(datos.detalle || []);

      setTimeout(() => {
        const detalle = document.getElementById("detalle-venta");
        detalle?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargandoDetalleId(null);
    }
  }

  function cerrarDetalle() {
    setVentaSeleccionada(null);
    setDetalleVenta([]);
  }

  function manejarCambioFiltro(evento) {
    const { name, value } = evento.target;

    setFiltrosFormulario({
      ...filtrosFormulario,
      [name]: value,
    });
  }

  function manejarFiltrar(evento) {
    evento.preventDefault();
    setFiltrosAplicados(filtrosFormulario);
    cerrarDetalle();
  }

  function limpiarFiltros() {
    setFiltrosFormulario(filtrosIniciales);
    setFiltrosAplicados(filtrosIniciales);
    cerrarDetalle();
  }

  function obtenerVentasFiltradas() {
    const fechaDesde = crearFechaDesde(filtrosAplicados.fechaDesde);
    const fechaHasta = crearFechaHasta(filtrosAplicados.fechaHasta);

    return ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha_creacion);

      if (fechaDesde && fechaVenta < fechaDesde) {
        return false;
      }

      if (fechaHasta && fechaVenta > fechaHasta) {
        return false;
      }

      return true;
    });
  }

  const ventasFiltradas = obtenerVentasFiltradas();
  const filtrosActivos =
    filtrosAplicados.fechaDesde || filtrosAplicados.fechaHasta;

  function calcularTotalVendido() {
    return ventasFiltradas.reduce(
      (total, venta) => total + Number(venta.total),
      0,
    );
  }

  function calcularCantidadProductosDetalle() {
    return detalleVenta.reduce(
      (total, producto) => total + Number(producto.cantidad),
      0,
    );
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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Historial de ventas
            </h2>
            <p className="mt-2 text-slate-500">
              Consulta de ventas registradas en el sistema
            </p>
          </div>

          <button
            onClick={actualizarVentas}
            disabled={actualizando}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
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

      <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-slate-900">
            Filtros por fecha
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Filtrá las ventas por un rango de fechas.
          </p>
        </div>

        <form
          onSubmit={manejarFiltrar}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Fecha desde
            </label>

            <input
              type="date"
              name="fechaDesde"
              value={filtrosFormulario.fechaDesde}
              onChange={manejarCambioFiltro}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Fecha hasta
            </label>

            <input
              type="date"
              name="fechaHasta"
              value={filtrosFormulario.fechaHasta}
              onChange={manejarCambioFiltro}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Filtrar
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={limpiarFiltros}
              className="w-full rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
            >
              Limpiar filtros
            </button>
          </div>
        </form>

        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {filtrosActivos ? (
            <p>
              Mostrando <strong>{ventasFiltradas.length}</strong> de{" "}
              <strong>{ventas.length}</strong> ventas registradas.
            </p>
          ) : (
            <p>
              Mostrando todas las ventas registradas:{" "}
              <strong>{ventas.length}</strong>.
            </p>
          )}
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {filtrosActivos ? "Ventas filtradas" : "Ventas"}
          </p>
          <strong className="mt-3 block text-2xl font-bold text-slate-900 sm:text-3xl">
            {ventasFiltradas.length}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {filtrosActivos ? "Total del período" : "Total registradas"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {filtrosActivos ? "Total vendido filtrado" : "Total vendido"}
          </p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 sm:text-3xl">
            {formatearDinero(calcularTotalVendido())}
          </strong>
          <p className="mt-2 text-sm text-slate-400">
            {filtrosActivos ? "Importe del período" : "Importe acumulado"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {filtrosActivos ? "Promedio filtrado" : "Promedio"}
          </p>
          <strong className="mt-3 block wrap-break-word text-2xl font-bold text-slate-900 sm:text-3xl">
            {ventasFiltradas.length > 0
              ? formatearDinero(
                  calcularTotalVendido() / ventasFiltradas.length,
                )
              : formatearDinero(0)}
          </strong>
          <p className="mt-2 text-sm text-slate-400">Promedio por venta</p>
        </div>
      </section>

      {ventaSeleccionada && (
        <section
          id="detalle-venta"
          className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Detalle completo
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                Venta #{ventaSeleccionada.id}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Fecha: {formatearFecha(ventaSeleccionada.fecha_creacion)}
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarDetalle}
              className="w-full rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300 sm:w-auto"
            >
              Cerrar detalle
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total</p>
              <strong className="mt-1 block text-xl text-slate-900">
                {formatearDinero(ventaSeleccionada.total)}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Método de pago</p>
              <strong className="mt-1 block text-xl text-slate-900">
                {ventaSeleccionada.metodo_pago}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Productos vendidos</p>
              <strong className="mt-1 block text-xl text-slate-900">
                {calcularCantidadProductosDetalle()}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Estado</p>
              <strong className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {ventaSeleccionada.estado}
              </strong>
            </div>
          </div>

          <div className="md:hidden">
            <div className="space-y-3">
              {detalleVenta.map((producto) => (
                <article
                  key={`${producto.producto_id}-${producto.nombre}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div>
                    <p className="text-xs text-slate-400">
                      Código: {producto.codigo}
                    </p>
                    <h4 className="mt-1 wrap-break-word font-bold text-slate-900">
                      {producto.nombre}
                    </h4>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-sm text-slate-500">Cantidad</p>
                      <strong className="mt-1 block text-slate-900">
                        {producto.cantidad}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-sm text-slate-500">Precio unitario</p>
                      <strong className="mt-1 block text-slate-900">
                        {formatearDinero(producto.precio_unitario)}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-sm text-slate-500">Subtotal</p>
                      <strong className="mt-1 block text-slate-900">
                        {formatearDinero(producto.subtotal)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-200 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Precio unitario</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {detalleVenta.map((producto) => (
                  <tr
                    key={`${producto.producto_id}-${producto.nombre}`}
                    className="border-b border-slate-100 text-sm"
                  >
                    <td className="px-4 py-4 font-bold text-slate-700">
                      {producto.codigo}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {producto.nombre}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {producto.cantidad}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatearDinero(producto.precio_unitario)}
                    </td>

                    <td className="px-4 py-4 font-bold text-slate-900">
                      {formatearDinero(producto.subtotal)}
                    </td>
                  </tr>
                ))}

                {detalleVenta.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Esta venta no tiene productos cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4 md:hidden">
          {ventasFiltradas.map((venta) => (
            <article
              key={venta.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Venta</p>
                  <strong className="text-slate-900">#{venta.id}</strong>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {venta.estado}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Total</p>
                  <strong className="mt-1 block text-slate-900">
                    {formatearDinero(venta.total)}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Método de pago</p>
                  <strong className="mt-1 block text-slate-900">
                    {venta.metodo_pago}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Usuario</p>
                  <strong className="mt-1 block text-slate-900">
                    Usuario #{venta.usuario_id}
                  </strong>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-sm text-slate-500">Fecha</p>
                  <strong className="mt-1 block wrap-break-word text-slate-900">
                    {formatearFecha(venta.fecha_creacion)}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => verDetalleVenta(venta.id)}
                disabled={cargandoDetalleId === venta.id}
                className="mt-4 w-full rounded-xl bg-blue-100 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                {cargandoDetalleId === venta.id
                  ? "Cargando detalle..."
                  : "Ver detalle"}
              </button>
            </article>
          ))}

          {ventasFiltradas.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No hay ventas para el rango de fechas seleccionado.
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-262.5 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">N° venta</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Método de pago</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((venta) => (
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
                    {formatearFecha(venta.fecha_creacion)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => verDetalleVenta(venta.id)}
                      disabled={cargandoDetalleId === venta.id}
                      className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      {cargandoDetalleId === venta.id
                        ? "Cargando..."
                        : "Ver detalle"}
                    </button>
                  </td>
                </tr>
              ))}

              {ventasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No hay ventas para el rango de fechas seleccionado.
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