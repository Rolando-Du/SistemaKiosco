
# Changelog

Registro de cambios principales del proyecto **Sistema Kiosco**.

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

- Agregar edición y eliminación de productos.
- Agregar edición y eliminación de proveedores.
- Agregar detalle completo de ventas.
- Agregar detalle completo de compras.
- Agregar filtros por fecha en historiales.
- Agregar exportación a PDF o Excel.
- Mejorar control de usuarios y roles.
- Agregar backups desde la interfaz.
- Preparar el sistema para instalación local.
- Preparar empaquetado o despliegue.

