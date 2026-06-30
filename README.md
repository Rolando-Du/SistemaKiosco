
# Sistema Kiosco

Sistema de gestión para kiosco, librería e impresiones desarrollado con **FastAPI**, **SQLite**, **React**, **Vite** y **Tailwind CSS**.

El sistema permite administrar productos, stock, ventas, compras, proveedores, caja diaria, reportes e historial de operaciones.

## Funcionalidades principales

* Login de usuarios.
* Rutas protegidas en el frontend.
* Dashboard con resumen general del sistema.
* Gestión de productos.
* Alta de productos desde el frontend.
* Ventas POS con descuento automático de stock.
* Historial de ventas.
* Apertura y cierre de caja.
* Gestión de proveedores.
* Registro de compras a proveedores.
* Aumento automático de stock al registrar compras.
* Historial de compras.
* Interfaz responsive para escritorio y pantallas chicas.

## Tecnologías utilizadas

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* pnpm

### Control de versiones

* Git
* GitHub

## Estructura general del proyecto

```text
SistemaKiosco/
├── backend/
│   ├── app.py
│   ├── database/
│   ├── routers/
│   ├── seguridad/
│   ├── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── backups/
├── docs/
│   └── screenshots/
├── .gitignore
└── README.md
```

## Cómo ejecutar el backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Activar el entorno virtual:

```bash
source ./entorno/Scripts/activate
```

Levantar el servidor:

```bash
python -m uvicorn app:app --reload
```

El backend queda disponible en:

```text
http://127.0.0.1:8000
```

La documentación automática de la API se puede ver en:

```text
http://127.0.0.1:8000/docs
```

## Cómo ejecutar el frontend

Entrar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
pnpm install
```

Levantar el frontend:

```bash
pnpm dev
```

El frontend queda disponible en:

```text
http://localhost:5173
```

## Usuario de prueba

```text
Usuario: admin
Contraseña: admin123
Rol: ADMIN
```

## Endpoints principales

### Usuarios

```text
POST /usuarios/login
```

### Productos

```text
GET  /productos/
POST /productos/
GET  /productos/buscar
GET  /productos/stock-bajo
```

### Ventas

```text
GET  /ventas/
POST /ventas/
GET  /ventas/{venta_id}
```

### Caja

```text
GET  /caja/abierta
POST /caja/abrir
POST /caja/cerrar
```

### Proveedores

```text
GET  /proveedores/
POST /proveedores/
```

### Compras

```text
GET  /compras/
POST /compras/
GET  /compras/{compra_id}
```

### Reportes

```text
GET /reportes/resumen
```

## Pantallas del sistema

* Login
* Dashboard
* Productos
* Ventas POS
* Historial de ventas
* Caja
* Compras
* Historial de compras
* Proveedores

## Capturas del sistema

### Login

![Pantalla de login](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Productos

![Productos](docs/screenshots/productos.png)

### Ventas POS

![Ventas POS](docs/screenshots/ventas-pos.png)

### Caja

![Caja](docs/screenshots/caja.png)

### Compras

![Compras](docs/screenshots/compras.png)

### Proveedores

![Proveedores](docs/screenshots/proveedores.png)

### Historial de ventas

![Historial de ventas](docs/screenshots/historial-ventas.png)

### Historial de compras

![Historial de compras](docs/screenshots/historial-compras.png)

## Estado actual del proyecto

El proyecto cuenta con un backend funcional, un frontend conectado al backend y una interfaz responsive.

También se encuentra versionado con Git y subido a GitHub.

## Repositorio

```text
https://github.com/Rolando-Du/SistemaKiosco
```

## Autor

Desarrollado por Rolando Duarte.