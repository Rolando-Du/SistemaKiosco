import { useEffect, useState } from "react";

import { obtenerProductos } from "../services/productosService";

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarProductos() {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">
        <h2 className="text-xl font-bold">Error al cargar productos</h2>
        <p className="mt-2">{error}</p>
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

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {productos.length} productos
          </span>
        </div>
      </header>

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