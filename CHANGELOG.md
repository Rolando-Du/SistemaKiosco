
# Changelog

Registro de cambios principales del proyecto **Sistema Kiosco**.

## [1.3.0] - Detalle completo de compras

### Agregado

- Agregado detalle completo de compras en el historial.
- Agregado botón **Ver detalle** en cada compra.
- Visualización de productos comprados por compra.
- Visualización de cantidad, precio unitario y subtotal por producto.
- Visualización del proveedor, total, estado y fecha de la compra.

### Frontend

- Agregada función `obtenerDetalleCompra` en el servicio de compras.
- Mejorada la pantalla de historial de compras.
- Agregada sección visual para consultar el detalle completo de una compra.
- Agregada versión responsive del detalle para pantallas chicas.
- Agregada tabla de detalle para escritorio.
- Agregado scroll automático hacia el detalle al seleccionar una compra.
- Agregada columna **Acciones** en el historial de compras.

### Backend

- Se reutilizó el endpoint existente `GET /compras/{compra_id}`.
- Se aprovechó la información ya disponible de `CompraDetalle`.
- El backend ya devolvía productos, cantidades, precios unitarios y subtotales.

### Repositorio

- Trabajo realizado en la rama `desarrollo-v1.3.0`.
- Cambios probados desde la interfaz.
- Cambios subidos a GitHub.

---

## [1.2.0] - Detalle completo de ventas

### Agregado

- Agregado detalle completo de ventas en el historial.
- Agregado botón **Ver detalle** en cada venta.
- Visualización de productos vendidos por venta.
- Visualización de cantidad, precio unitario y subtotal por producto.
- Visualización del total, método de pago, estado y fecha de la venta.

### Frontend

- Agregada función `obtenerDetalleVenta` en el servicio de ventas.
- Mejorada la pantalla de historial de ventas.
- Agregada sección visual para consultar el detalle completo de una venta.
- Agregada versión responsive del detalle para pantallas chicas.
- Agregada tabla de detalle para escritorio.
- Agregado scroll automático hacia el detalle al seleccionar una venta.

### Backend

- Se reutilizó el endpoint existente `GET /ventas/{venta_id}`.
- Se aprovechó la información ya disponible de `VentaDetalle`.
- El backend ya devolvía productos, cantidades, precios unitarios y subtotales.

### Repositorio

- Trabajo realizado en la rama `desarrollo-v1.2.0`.
- Cambios probados con build correcto del frontend.
- Cambios subidos a GitHub.

---

## [1.1.0] - Gestión mejorada de productos y proveedores

### Agregado

- Edición de productos desde el backend.
- Eliminación lógica de productos desde el backend.
- Edición de productos desde el frontend.
- Eliminación de productos desde el frontend.
- Generación automática de código interno para productos.
- Edición de proveedores desde el backend.
- Eliminación lógica de proveedores desde el backend.
- Edición de proveedores desde el frontend.
- Eliminación de proveedores desde el frontend.

### Backend

- Agregados endpoints para obtener producto por ID.
- Agregados endpoints para actualizar productos.
- Agregados endpoints para eliminar productos de forma lógica.
- Agregada generación automática de códigos de productos con formato `PRD-0001`.
- El código de barras quedó como dato opcional.
- Agregados endpoints para obtener proveedor por ID.
- Agregados endpoints para actualizar proveedores.
- Agregados endpoints para eliminar proveedores de forma lógica.
- Mejoradas las validaciones básicas en productos y proveedores.

### Frontend

- Agregados botones **Editar** y **Eliminar** en la pantalla de productos.
- Agregado formulario reutilizable para crear y editar productos.
- El código interno del producto ahora se genera automáticamente.
- Agregados botones **Editar** y **Eliminar** en la pantalla de proveedores.
- Agregado formulario reutilizable para crear y editar proveedores.
- Agregados mensajes visuales de creación, actualización y eliminación.
- Actualización automática de los listados luego de crear, editar o eliminar.

### Repositorio

- Trabajo realizado en la rama `desarrollo-v1.1.0`.
- Cambios probados con build correcto del frontend.
- Cambios subidos a GitHub.

---

## [1.0.0] - Versión inicial funcional

### Agregado

- Creación del backend con FastAPI.
- Configuración de base de datos SQLite.
- Integración con SQLAlchemy.
- Creación de estructura por carpetas:
  - database
  - routers
  - services
  - seguridad
- Creación del sistema de login.
- Creación de usuario administrador inicial.
- Hash de contraseña con PBKDF2.
- Configuración de CORS para conectar frontend y backend.
- Documentación automática de API con FastAPI Docs.

### Backend

- Módulo de usuarios.
- Módulo de productos.
- Módulo de ventas POS.
- Módulo de caja.
- Módulo de proveedores.
- Módulo de compras.
- Módulo de reportes.
- Endpoint de resumen general.
- Descuento automático de stock al registrar ventas.
- Aumento automático de stock al registrar compras.
- Apertura y cierre de caja.
- Cálculo de totales de ventas y compras.

### Frontend

- Creación del frontend con React y Vite.
- Configuración de Tailwind CSS.
- Configuración de React Router.
- Login conectado al backend.
- Rutas protegidas.
- Layout principal con menú lateral.
- Dashboard conectado al backend.
- Pantalla de productos.
- Pantalla de ventas POS.
- Pantalla de caja.
- Pantalla de compras.
- Pantalla de proveedores.
- Historial de ventas.
- Historial de compras.
- Servicios centralizados para consumir la API.

### Diseño

- Interfaz visual moderna.
- Diseño responsive para escritorio y pantallas chicas.
- Corrección del menú lateral.
- Botón de cerrar sesión separado del menú.
- Tablas convertidas a tarjetas en vistas móviles.
- Mejora visual de formularios, botones y secciones.

### Documentación

- Agregado de README principal.
- Agregadas instrucciones para ejecutar backend.
- Agregadas instrucciones para ejecutar frontend.
- Agregado usuario de prueba.
- Agregados endpoints principales.
- Agregadas capturas del sistema al README.

### Repositorio

- Proyecto versionado con Git.
- Proyecto subido a GitHub.
- Capturas guardadas en `docs/screenshots`.

---

## Próximas mejoras posibles

- Agregar filtros por fecha en historiales.
- Agregar exportación a PDF o Excel.
- Mejorar control de usuarios y roles.
- Agregar backups desde la interfaz.
- Preparar el sistema para instalación local.
- Preparar empaquetado o despliegue.

