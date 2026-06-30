import { useEffect, useState } from "react";

import {
  abrirCaja,
  cerrarCaja,
  obtenerCajaAbierta,
} from "../services/cajaService";

function CajaPage() {
  const [caja, setCaja] = useState(null);
  const [montoInicial, setMontoInicial] = useState("");
  const [montoFinal, setMontoFinal] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    obtenerCajaAbierta()
      .then((datos) => {
        if (componenteActivo) {
          if (datos.caja) {
            setCaja(datos.caja);
          } else {
            setCaja(null);
          }
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

  async function recargarCaja() {
    const datos = await obtenerCajaAbierta();

    if (datos.caja) {
      setCaja(datos.caja);
    } else {
      setCaja(null);
    }
  }

  async function manejarAbrirCaja(evento) {
    evento.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      const datos = await abrirCaja({
        usuario_id: 1,
        monto_inicial: Number(montoInicial),
      });

      setCaja(datos.caja);
      setMontoInicial("");
      setMensaje("Caja abierta correctamente.");
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  async function manejarCerrarCaja(evento) {
    evento.preventDefault();

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      await cerrarCaja({
        monto_final: Number(montoFinal),
      });

      setMontoFinal("");
      setMensaje("Caja cerrada correctamente.");
      await recargarCaja();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando caja...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Caja
            </h2>
            <p className="mt-2 text-slate-500">
              Apertura, control y cierre de caja diaria
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
              caja
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {caja ? "Caja abierta" : "Sin caja abierta"}
          </span>
        </div>
      </header>

      {mensaje && (
        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-green-700 shadow-sm">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
          <h3 className="text-xl font-bold text-slate-900">Estado de caja</h3>

          {!caja && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5 sm:p-6">
              <p className="text-slate-600">
                No hay una caja abierta actualmente.
              </p>
            </div>
          )}

          {caja && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Caja N°</p>
                <strong className="mt-2 block text-2xl text-slate-900 sm:text-3xl">
                  {caja.id}
                </strong>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Estado</p>
                <strong className="mt-2 block wrap-break-word text-2xl text-green-700 sm:text-3xl">
                  {caja.estado}
                </strong>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Monto inicial</p>
                <strong className="mt-2 block wrap-break-word text-2xl text-slate-900 sm:text-3xl">
                  ${caja.monto_inicial}
                </strong>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Total ventas</p>
                <strong className="mt-2 block wrap-break-word text-2xl text-slate-900 sm:text-3xl">
                  ${caja.total_ventas}
                </strong>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Fecha apertura</p>
                <strong className="mt-2 block wrap-break-word text-base text-slate-900 sm:text-lg">
                  {new Date(caja.fecha_apertura).toLocaleString()}
                </strong>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Usuario</p>
                <strong className="mt-2 block text-base text-slate-900 sm:text-lg">
                  Usuario #{caja.usuario_id}
                </strong>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          {!caja && (
            <>
              <h3 className="text-xl font-bold text-slate-900">Abrir caja</h3>

              <form onSubmit={manejarAbrirCaja} className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Monto inicial
                </label>

                <input
                  type="number"
                  min="0"
                  value={montoInicial}
                  onChange={(evento) => setMontoInicial(evento.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={procesando}
                  className="mt-5 w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {procesando ? "Abriendo..." : "Abrir caja"}
                </button>
              </form>
            </>
          )}

          {caja && (
            <>
              <h3 className="text-xl font-bold text-slate-900">Cerrar caja</h3>

              <form onSubmit={manejarCerrarCaja} className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Monto final contado
                </label>

                <input
                  type="number"
                  min="0"
                  value={montoFinal}
                  onChange={(evento) => setMontoFinal(evento.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={procesando}
                  className="mt-5 w-full rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {procesando ? "Cerrando..." : "Cerrar caja"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default CajaPage;