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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Proveedores</h2>
            <p className="mt-2 text-slate-500">
              Listado y alta de proveedores del sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
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
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            Nuevo proveedor
          </h3>

          <form onSubmit={manejarSubmit} className="grid grid-cols-2 gap-4">
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

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {guardando ? "Guardando..." : "Guardar proveedor"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
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
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ProveedoresPage;