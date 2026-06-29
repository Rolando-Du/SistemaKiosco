import { useEffect, useState } from "react";

import { obtenerProductos } from "../services/productosService";
import { crearVenta } from "../services/ventasService";

function VentasPosPage() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
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

  function agregarProducto(producto) {
    setError("");
    setMensaje("");

    const productoEnCarrito = carrito.find(
      (item) => item.producto_id === producto.id
    );

    if (productoEnCarrito) {
      cambiarCantidad(producto.id, productoEnCarrito.cantidad + 1);
      return;
    }

    setCarrito([
      ...carrito,
      {
        producto_id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio_unitario: Number(producto.precio_venta),
        stock_disponible: producto.stock,
        cantidad: 1,
      },
    ]);
  }

  function cambiarCantidad(productoId, nuevaCantidad) {
    const cantidadNumero = Number(nuevaCantidad);

    setCarrito(
      carrito.map((item) => {
        if (item.producto_id !== productoId) {
          return item;
        }

        if (cantidadNumero < 1) {
          return {
            ...item,
            cantidad: 1,
          };
        }

        if (cantidadNumero > item.stock_disponible) {
          return {
            ...item,
            cantidad: item.stock_disponible,
          };
        }

        return {
          ...item,
          cantidad: cantidadNumero,
        };
      })
    );
  }

  function quitarProducto(productoId) {
    setCarrito(carrito.filter((item) => item.producto_id !== productoId));
  }

  function calcularSubtotal(item) {
    return item.precio_unitario * item.cantidad;
  }

  function calcularTotal() {
    return carrito.reduce((total, item) => total + calcularSubtotal(item), 0);
  }

  async function confirmarVenta() {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (carrito.length === 0) {
        setError("La venta debe tener al menos un producto.");
        return;
      }

      const venta = {
        usuario_id: 1,
        metodo_pago: metodoPago,
        productos: carrito.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })),
      };

      await crearVenta(venta);

      setMensaje("Venta creada correctamente.");
      setCarrito([]);
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
        <p className="text-slate-600">Cargando ventas POS...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Ventas POS</h2>
            <p className="mt-2 text-slate-500">
              Carga rápida de ventas y descuento automático de stock
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {productos.length} productos disponibles
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
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Productos
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Tocá un producto para agregarlo a la venta
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {productos.map((producto) => (
              <button
                key={producto.id}
                onClick={() => agregarProducto(producto)}
                disabled={producto.stock <= 0}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">
                      {producto.nombre}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Código: {producto.codigo}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    ${producto.precio_venta}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Stock disponible</span>
                  <strong
                    className={
                      producto.stock <= producto.stock_minimo
                        ? "text-red-600"
                        : "text-slate-800"
                    }
                  >
                    {producto.stock}
                  </strong>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Venta actual</h3>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Método de pago
            </label>

            <select
              value={metodoPago}
              onChange={(evento) => setMetodoPago(evento.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
            </select>
          </div>

          <div className="mt-6 space-y-3">
            {carrito.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Todavía no agregaste productos.
              </div>
            )}

            {carrito.map((item) => (
              <div
                key={item.producto_id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.nombre}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      ${item.precio_unitario} c/u
                    </p>
                  </div>

                  <button
                    onClick={() => quitarProducto(item.producto_id)}
                    className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-200"
                  >
                    Quitar
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <input
                    type="number"
                    min="1"
                    max={item.stock_disponible}
                    value={item.cantidad}
                    onChange={(evento) =>
                      cambiarCantidad(item.producto_id, evento.target.value)
                    }
                    className="w-24 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />

                  <strong className="text-slate-900">
                    ${calcularSubtotal(item)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total</span>
              <strong className="text-3xl text-slate-900">
                ${calcularTotal()}
              </strong>
            </div>

            <button
              onClick={confirmarVenta}
              disabled={guardando || carrito.length === 0}
              className="mt-5 w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {guardando ? "Confirmando..." : "Confirmar venta"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VentasPosPage;