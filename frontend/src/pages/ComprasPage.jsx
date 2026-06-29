import { useEffect, useState } from "react";

import { obtenerProductos } from "../services/productosService";
import { obtenerProveedores } from "../services/proveedoresService";
import { crearCompra, obtenerCompras } from "../services/comprasService";

function ComprasPage() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [proveedorId, setProveedorId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    Promise.all([obtenerProductos(), obtenerProveedores(), obtenerCompras()])
      .then(([productosDatos, proveedoresDatos, comprasDatos]) => {
        if (componenteActivo) {
          setProductos(productosDatos);
          setProveedores(proveedoresDatos);
          setCompras(comprasDatos);
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

  async function recargarDatos() {
    const [productosDatos, comprasDatos] = await Promise.all([
      obtenerProductos(),
      obtenerCompras(),
    ]);

    setProductos(productosDatos);
    setCompras(comprasDatos);
  }

  function manejarProductoSeleccionado(evento) {
    const idSeleccionado = evento.target.value;
    setProductoId(idSeleccionado);

    const producto = productos.find(
      (item) => item.id === Number(idSeleccionado)
    );

    if (producto) {
      setPrecioUnitario(String(producto.precio_compra));
    } else {
      setPrecioUnitario("");
    }
  }

  function agregarProducto() {
    setError("");
    setMensaje("");

    if (!productoId) {
      setError("Seleccioná un producto.");
      return;
    }

    if (Number(cantidad) <= 0) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }

    if (Number(precioUnitario) < 0 || precioUnitario === "") {
      setError("El precio unitario no puede estar vacío ni ser negativo.");
      return;
    }

    const producto = productos.find((item) => item.id === Number(productoId));

    if (!producto) {
      setError("El producto seleccionado no existe.");
      return;
    }

    const productoExistente = detalle.find(
      (item) => item.producto_id === producto.id
    );

    if (productoExistente) {
      setDetalle(
        detalle.map((item) => {
          if (item.producto_id !== producto.id) {
            return item;
          }

          return {
            ...item,
            cantidad: item.cantidad + Number(cantidad),
            precio_unitario: Number(precioUnitario),
          };
        })
      );
    } else {
      setDetalle([
        ...detalle,
        {
          producto_id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          cantidad: Number(cantidad),
          precio_unitario: Number(precioUnitario),
        },
      ]);
    }

    setProductoId("");
    setCantidad("1");
    setPrecioUnitario("");
  }

  function cambiarCantidad(productoId, nuevaCantidad) {
    const cantidadNumero = Number(nuevaCantidad);

    setDetalle(
      detalle.map((item) => {
        if (item.producto_id !== productoId) {
          return item;
        }

        return {
          ...item,
          cantidad: cantidadNumero < 1 ? 1 : cantidadNumero,
        };
      })
    );
  }

  function cambiarPrecio(productoId, nuevoPrecio) {
    const precioNumero = Number(nuevoPrecio);

    setDetalle(
      detalle.map((item) => {
        if (item.producto_id !== productoId) {
          return item;
        }

        return {
          ...item,
          precio_unitario: precioNumero < 0 ? 0 : precioNumero,
        };
      })
    );
  }

  function quitarProducto(productoId) {
    setDetalle(detalle.filter((item) => item.producto_id !== productoId));
  }

  function calcularSubtotal(item) {
    return item.cantidad * item.precio_unitario;
  }

  function calcularTotal() {
    return detalle.reduce((total, item) => total + calcularSubtotal(item), 0);
  }

  async function confirmarCompra() {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (!proveedorId) {
        setError("Seleccioná un proveedor.");
        return;
      }

      if (detalle.length === 0) {
        setError("La compra debe tener al menos un producto.");
        return;
      }

      const compra = {
        proveedor_id: Number(proveedorId),
        usuario_id: 1,
        productos: detalle.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
      };

      await crearCompra(compra);

      setMensaje("Compra creada correctamente.");
      setProveedorId("");
      setDetalle([]);
      await recargarDatos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-slate-600">Cargando compras...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Compras</h2>
            <p className="mt-2 text-slate-500">
              Registro de compras a proveedores y actualización de stock
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {compras.length} compras
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

      <div className="grid grid-cols-3 gap-6">
        <section className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Nueva compra</h3>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Proveedor
            </label>

            <select
              value={proveedorId}
              onChange={(evento) => setProveedorId(evento.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar proveedor</option>

              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <h4 className="mb-4 font-bold text-slate-900">
              Agregar producto
            </h4>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Producto
                </label>

                <select
                  value={productoId}
                  onChange={manejarProductoSeleccionado}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Seleccionar producto</option>

                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre} - Stock actual: {producto.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Cantidad
                </label>

                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(evento) => setCantidad(evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Precio compra
                </label>

                <input
                  type="number"
                  min="0"
                  value={precioUnitario}
                  onChange={(evento) => setPrecioUnitario(evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="col-span-4 flex justify-end">
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Agregar a la compra
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-4 font-bold text-slate-900">
              Productos de la compra
            </h4>

            {detalle.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Todavía no agregaste productos a la compra.
              </div>
            )}

            {detalle.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3">Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detalle.map((item) => (
                      <tr
                        key={item.producto_id}
                        className="border-b border-slate-100 text-sm"
                      >
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-700">
                            {item.nombre}
                          </p>
                          <p className="text-xs text-slate-400">
                            Código: {item.codigo}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(evento) =>
                              cambiarCantidad(
                                item.producto_id,
                                evento.target.value
                              )
                            }
                            className="w-24 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min="0"
                            value={item.precio_unitario}
                            onChange={(evento) =>
                              cambiarPrecio(
                                item.producto_id,
                                evento.target.value
                              )
                            }
                            className="w-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                          />
                        </td>

                        <td className="px-4 py-4 font-bold text-slate-700">
                          ${calcularSubtotal(item)}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => quitarProducto(item.producto_id)}
                            className="rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200"
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Resumen</h3>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Proveedor seleccionado</p>
              <strong className="mt-2 block text-slate-900">
                {proveedorId
                  ? proveedores.find(
                      (proveedor) => proveedor.id === Number(proveedorId)
                    )?.nombre
                  : "Sin seleccionar"}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Productos agregados</p>
              <strong className="mt-2 block text-2xl text-slate-900">
                {detalle.length}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total compra</p>
              <strong className="mt-2 block text-3xl text-slate-900">
                ${calcularTotal()}
              </strong>
            </div>

            <button
              onClick={confirmarCompra}
              disabled={guardando || detalle.length === 0}
              className="w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {guardando ? "Confirmando..." : "Confirmar compra"}
            </button>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-xl font-bold text-slate-900">
          Compras registradas
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="px-4 py-3">N°</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
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
                    Proveedor #{compra.proveedor_id}
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-700">
                    ${compra.total}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {compra.estado}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {new Date(compra.fecha_creacion).toLocaleString()}
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

export default ComprasPage;