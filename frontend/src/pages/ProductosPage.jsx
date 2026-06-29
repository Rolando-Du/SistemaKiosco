import { useEffect, useState } from "react";

import { crearProducto, obtenerProductos } from "../services/productosService";

const formularioInicial = {
  codigo: "",
  codigo_barras: "",
  nombre: "",
  categoria_id: "1",
  precio_compra: "",
  precio_venta: "",
  stock: "",
  stock_minimo: "",
};

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    obtenerProductos()
      .then((datos) => {
        if (componenteActivo) {
          setProductos(datos);
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

  async function recargarProductos() {
    const datos = await obtenerProductos();
    setProductos(datos);
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

      const nuevoProducto = {
        codigo: formulario.codigo,
        codigo_barras: formulario.codigo_barras || null,
        nombre: formulario.nombre,
        categoria_id: Number(formulario.categoria_id),
        precio_compra: Number(formulario.precio_compra),
        precio_venta: Number(formulario.precio_venta),
        stock: Number(formulario.stock),
        stock_minimo: Number(formulario.stock_minimo),
      };

      await crearProducto(nuevoProducto);

      setMensaje("Producto creado correctamente.");
      setFormulario(formularioInicial);
      setMostrarFormulario(false);
      await recargarProductos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Productos</h2>
            <p className="mt-2 text-slate-500">
              Listado de productos cargados en el sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {productos.length} productos
            </span>

            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              {mostrarFormulario ? "Cancelar" : "+ Nuevo producto"}
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
            Nuevo producto
          </h3>

          <form onSubmit={manejarSubmit} className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                value={formulario.codigo}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Código de barras
              </label>
              <input
                type="text"
                name="codigo_barras"
                value={formulario.codigo_barras}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
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
                Categoría
              </label>
              <select
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="1">Bebidas</option>
                <option value="2">Golosinas</option>
                <option value="3">Snacks</option>
                <option value="4">Librería</option>
                <option value="5">Impresiones</option>
                <option value="6">Fotocopias</option>
                <option value="7">Otros</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Precio compra
              </label>
              <input
                type="number"
                name="precio_compra"
                value={formulario.precio_compra}
                onChange={manejarCambio}
                required
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Precio venta
              </label>
              <input
                type="number"
                name="precio_venta"
                value={formulario.precio_venta}
                onChange={manejarCambio}
                required
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formulario.stock}
                onChange={manejarCambio}
                required
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Stock mínimo
              </label>
              <input
                type="number"
                name="stock_minimo"
                value={formulario.stock_minimo}
                onChange={manejarCambio}
                required
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {guardando ? "Guardando..." : "Guardar producto"}
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
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Stock mínimo</th>
                <th className="px-4 py-3">Precio compra</th>
                <th className="px-4 py-3">Precio venta</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-b border-slate-100 text-sm hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {producto.codigo}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {producto.nombre}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        producto.stock <= producto.stock_minimo
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {producto.stock}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {producto.stock_minimo}
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-700">
                    ${producto.precio_compra}
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-700">
                    ${producto.precio_venta}
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

export default ProductosPage;