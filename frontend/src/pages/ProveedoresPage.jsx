import { useEffect, useState } from "react";

import {
  crearProveedor,
  obtenerProveedores,
} from "../services/proveedoresService";

const formularioInicial = {
  nombre: "",
  telefono: "",
  email: "",
  direccion: "",
};

function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    obtenerProveedores()
      .then((datos) => {
        if (componenteActivo) {
          setProveedores(datos);
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

  async function recargarProveedores() {
    const datos = await obtenerProveedores();
    setProveedores(datos);
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const nuevoProveedor = {
        nombre: formulario.nombre,
        telefono: formulario.telefono || null,
        email: formulario.email || null,
        direccion: formulario.direccion || null,
      };

      await crearProveedor(nuevoProveedor);

      setMensaje("Proveedor creado correctamente.");
      setFormulario(formularioInicial);
      setMostrarFormulario(false);
      await recargarProveedores();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando proveedores...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Proveedores
            </h2>
            <p className="mt-2 text-slate-500">
              Listado y alta de proveedores del sistema
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {proveedores.length} proveedores
            </span>

            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              {mostrarFormulario ? "Cancelar" : "+ Nuevo proveedor"}
            </button>
          </div>
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

      {mostrarFormulario && (
        <section className="mb-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            Nuevo proveedor
          </h3>

          <form
            onSubmit={manejarSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formulario.email}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Dirección
              </label>

              <input
                type="text"
                name="direccion"
                value={formulario.direccion}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                disabled={guardando}
                className="w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
              >
                {guardando ? "Guardando..." : "Guardar proveedor"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="md:hidden">
          <div className="space-y-4">
            {proveedores.map((proveedor) => (
              <article
                key={proveedor.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="wrap-break-word font-bold text-slate-900">
                      {proveedor.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {proveedor.telefono || "Sin teléfono"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Activo
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Email</p>
                    <strong className="mt-1 block wrap-break-word text-slate-900">
                      {proveedor.email || "-"}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Dirección</p>
                    <strong className="mt-1 block wrap-break-word text-slate-900">
                      {proveedor.direccion || "-"}
                    </strong>
                  </div>
                </div>
              </article>
            ))}

            {proveedores.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Todavía no hay proveedores cargados.
              </div>
            )}
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-225 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {proveedores.map((proveedor) => (
                <tr
                  key={proveedor.id}
                  className="border-b border-slate-100 text-sm hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-bold text-slate-700">
                    {proveedor.nombre}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {proveedor.telefono || "-"}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {proveedor.email || "-"}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {proveedor.direccion || "-"}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}

              {proveedores.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Todavía no hay proveedores cargados.
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

export default ProveedoresPage;