import { useEffect, useState } from "react";

import {
  crearProducto,
  editarProducto,
  eliminarProducto,
  obtenerProductos,
} from "../services/productosService";

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
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
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

  function abrirFormularioNuevo() {
    setProductoEditandoId(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  }

  function cancelarFormulario() {
    setProductoEditandoId(null);
    setFormulario(formularioInicial);
    setMostrarFormulario(false);
    setError("");
  }

  function prepararEdicion(producto) {
    setProductoEditandoId(producto.id);
    setFormulario({
      codigo: producto.codigo || "",
      codigo_barras: producto.codigo_barras || "",
      nombre: producto.nombre || "",
      categoria_id: String(producto.categoria_id || "1"),
      precio_compra: String(producto.precio_compra ?? ""),
      precio_venta: String(producto.precio_venta ?? ""),
      stock: String(producto.stock ?? ""),
      stock_minimo: String(producto.stock_minimo ?? ""),
    });

    setMostrarFormulario(true);
    setError("");
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      const productoFormulario = {
        codigo: productoEditandoId ? formulario.codigo : null,
        codigo_barras: formulario.codigo_barras || null,
        nombre: formulario.nombre,
        categoria_id: Number(formulario.categoria_id),
        precio_compra: Number(formulario.precio_compra),
        precio_venta: Number(formulario.precio_venta),
        stock: Number(formulario.stock),
        stock_minimo: Number(formulario.stock_minimo),
      };

      if (productoEditandoId) {
        await editarProducto(productoEditandoId, productoFormulario);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(productoFormulario);
        setMensaje("Producto creado correctamente.");
      }

      setFormulario(formularioInicial);
      setProductoEditandoId(null);
      setMostrarFormulario(false);
      await recargarProductos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function manejarEliminar(producto) {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar el producto "${producto.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    try {
      setEliminandoId(producto.id);
      setError("");
      setMensaje("");

      await eliminarProducto(producto.id);

      if (productoEditandoId === producto.id) {
        setProductoEditandoId(null);
        setFormulario(formularioInicial);
        setMostrarFormulario(false);
      }

      setMensaje("Producto eliminado correctamente.");
      await recargarProductos();
    } catch (error) {
      setError(error.message);
    } finally {
      setEliminandoId(null);
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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Productos
            </h2>
            <p className="mt-2 text-slate-500">
              Listado de productos cargados en el sistema
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {productos.length} productos
            </span>

            <button
              onClick={
                mostrarFormulario ? cancelarFormulario : abrirFormularioNuevo
              }
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
        <section className="mb-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            {productoEditandoId ? "Editar producto" : "Nuevo producto"}
          </h3>

          <form
            onSubmit={manejarSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Código
              </label>

              <input
                type="text"
                name="codigo"
                value={
                  productoEditandoId
                    ? formulario.codigo
                    : "Se genera automáticamente"
                }
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
              />

              <p className="mt-1 text-xs text-slate-400">
                El código interno lo genera el sistema.
              </p>
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

            <div className="md:col-span-2">
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

            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:justify-end xl:col-span-4">
              <button
                type="button"
                onClick={cancelarFormulario}
                className="w-full rounded-xl bg-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300 md:w-auto"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando}
                className="w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto"
              >
                {guardando
                  ? "Guardando..."
                  : productoEditandoId
                    ? "Actualizar producto"
                    : "Guardar producto"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="md:hidden">
          <div className="space-y-4">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      Código {producto.codigo}
                    </p>
                    <h3 className="mt-1 wrap-break-word font-bold text-slate-900">
                      {producto.nombre}
                    </h3>
                  </div>

                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Activo
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Stock</p>
                    <strong
                      className={`mt-1 block ${
                        producto.stock <= producto.stock_minimo
                          ? "text-red-600"
                          : "text-green-700"
                      }`}
                    >
                      {producto.stock}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Stock mínimo</p>
                    <strong className="mt-1 block text-slate-900">
                      {producto.stock_minimo}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Compra</p>
                    <strong className="mt-1 block text-slate-900">
                      ${producto.precio_compra}
                    </strong>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-slate-500">Venta</p>
                    <strong className="mt-1 block text-slate-900">
                      ${producto.precio_venta}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => prepararEdicion(producto)}
                    className="w-full rounded-xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-200"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => manejarEliminar(producto)}
                    disabled={eliminandoId === producto.id}
                    className="w-full rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {eliminandoId === producto.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}

            {productos.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Todavía no hay productos cargados.
              </div>
            )}
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-262.5 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Stock mínimo</th>
                <th className="px-4 py-3">Precio compra</th>
                <th className="px-4 py-3">Precio venta</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
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

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => prepararEdicion(producto)}
                        className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => manejarEliminar(producto)}
                        disabled={eliminandoId === producto.id}
                        className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {eliminandoId === producto.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Todavía no hay productos cargados.
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

export default ProductosPage;