# QuitoMove — Frontend (ReactJS)

![CI](https://github.com/alxanderC13/Front_App/actions/workflows/ci.yml/badge.svg)

Frontend del sistema de gestión de transporte público **MoviCore**, desarrollado como proyecto integrador. Consume la API REST desarrollada en Django (`gestiontrasporte`) y provee una sección pública (sin autenticación) y una sección privada/admin protegida por autenticación JWT y control de acceso por roles.

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Módulos funcionales](#módulos-funcionales)
- [Control de acceso por roles](#control-de-acceso-por-roles)
- [Conexión con el backend](#conexión-con-el-backend)
- [Evidencias](#evidencias)
- [Despliegue y CI/CD](#despliegue-y-cicd)


## Stack tecnológico

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v4** + **shadcn/ui** (Radix + preset Nova)
- **React Router v6** — enrutamiento y rutas protegidas
- **Zustand** — estado global (auth y stores por módulo)
- **Axios** — cliente HTTP con interceptors (JWT + refresh automático)
- **react-hook-form** + **zod** — formularios y validación tipada
- **lucide-react** — iconografía
- **sonner** — notificaciones (toasts) de éxito y error

## Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)**:

```
src/
├── domain/            # Entidades, enums, excepciones, puertos (contratos), servicios puros
├── application/       # Casos de uso (orquestación) y DTOs
├── infrastructure/    # Implementación real: Axios, storage, config, factories (wiring)
└── presentation/      # Stores Zustand, páginas, componentes, router, tema
```

**Regla de dependencias:** `presentation → application → domain`. La capa `infrastructure` implementa los contratos (`ports`) definidos en `domain`, y las `factories` conectan cada caso de uso con su adapter concreto. `presentation` nunca importa directamente de `infrastructure`.

## Requisitos

- Node.js ≥ 18 (recomendado 20)
- npm ≥ 9
- Backend `gestiontrasporte` (Django) corriendo localmente o desplegado

## Instalación

```bash
git clone https://github.com/alxanderC13/Front_App.git
cd Front_App
npm install
cp .env.example .env   # y ajusta la URL de la API si es necesario
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Variables de entorno

Archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Vite solo expone variables que empiecen con `VITE_`. Ajusta esta URL según dónde esté corriendo el backend (local o servidor desplegado). El archivo `.env` no se versiona; usa `.env.example` como plantilla.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (`http://localhost:5173`) |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción para probarlo |
| `npx tsc --noEmit` | Verifica errores de TypeScript sin generar archivos |

## Credenciales de prueba

> Estas credenciales dependen de los datos sembrados (`seed_demo`) o creados manualmente en la base de datos del backend con el que te conectes.

| Usuario | Contraseña | Rol |
|---|---|---|
| `conductor1` | `demo123` | Conductor (sin permisos de administrador) |
| `usuario1` | `demo123` | Usuario regular (solo lectura) |
| `anabel` | *(definida al crearla)* | Administrator (acceso total) |

El usuario administrador se crea con `createsuperuser` y se le asigna el grupo **Administrator** desde `/secure-admin/` → Users → Groups.

## Módulos funcionales

### Sección pública (sin autenticación)

- **Inicio** (`/`) — landing informativa del proyecto.
- **Rutas** (`/routes`) — catálogo de rutas activas del sistema de transporte.
- **Detalle de ruta** (`/routes/:id`) — paradas ordenadas de una ruta específica.
- **Contacto** (`/contact`) — información de contacto del proyecto.

### Sección privada / Admin (requiere login)

| Módulo | Ruta | Operaciones |
|---|---|---|
| Login | `/login` | Autenticación JWT (`access` + `refresh`) |
| Dashboard | `/admin` | KPIs reales del sistema (viajes, vehículos activos, incidentes, puntualidad) |
| Vehículos | `/admin/vehicles` | Listar (búsqueda + paginación), crear, editar, eliminar |
| Rutas | `/admin/routes` | Listar, crear, editar, eliminar |
| Conductores | `/admin/drivers` | Listar, crear, editar, eliminar |
| Asignaciones | `/admin/assignments` | Asignar conductor a vehículo, editar, eliminar |
| Viajes | `/admin/trips` | Listar, crear, editar, eliminar (con selects dependientes) |
| Incidentes | `/admin/incidents` | Listar, crear, editar, resolver, eliminar |
| Mi Perfil | `/admin/profile` | Editar datos de contacto y cambiar contraseña |
| Notificaciones | `/admin/notifications` | Listar, marcar como leída, marcar todas como leídas |

Todos los formularios incluyen validación con zod, estados de carga (loaders y textos "Guardando…"), confirmación antes de eliminar y mensajes de éxito/error mediante toasts.

## Control de acceso por roles

Los roles provienen de los `groups` de Django devueltos por `GET /api/auth/me/`:

- **Administrator**: acceso total (lectura y escritura) en todos los módulos protegidos.
- **User**: solo lectura; los botones de crear/editar/eliminar se ocultan y las peticiones de escritura devuelven 403 si se fuerzan directamente contra la API.

La restricción se aplica en **dos niveles**: en el frontend (ocultando acciones y bloqueando rutas con `PrivateRoute requireAdmin`) y en el backend (permiso `ReadOnlyOrAdminWrite`), por lo que no es una restricción solo cosmética.

## Conexión con el backend

El cliente Axios (`src/infrastructure/http/axios-client.ts`) agrega automáticamente el header `Authorization: Bearer <token>` a cada petición, y refresca el token automáticamente si expira (401) usando el endpoint `/api/auth/refresh/`. Si el refresh también falla, la sesión se limpia y el usuario es redirigido a `/login`.

Endpoints principales consumidos:

| Recurso | Endpoint |
|---|---|
| Login | `POST /api/auth/login/` |
| Usuario actual | `GET /api/auth/me/` |
| Refresh token | `POST /api/auth/refresh/` |
| Perfil | `PATCH /api/auth/profile/` |
| Cambiar contraseña | `POST /api/auth/change-password/` |
| Vehículos | `GET/POST/PATCH/DELETE /api/transport/vehicles/` |
| Rutas | `GET/POST/PATCH/DELETE /api/transport/routes/` |
| Conductores | `GET/POST/PATCH/DELETE /api/operations/drivers/` |
| Asignaciones | `GET/POST/PATCH/DELETE /api/operations/driver-assignments/` |
| Viajes | `GET/POST/PATCH/DELETE /api/operations/trips/` |
| Incidentes | `GET/POST/PATCH/DELETE /api/incidents/incidents/` |
| Notificaciones | `GET /api/notifications/notifications/` |
| Dashboard | `GET /api/analytics/dashboard/` |
| Catálogo público de rutas | `GET /api/public/routes/` |
| Paradas de una ruta (público) | `GET /api/public/routes/:id/stops/` |

Para levantar el backend en local:

```bash
python manage.py migrate
python manage.py setup_groups
python manage.py seed_demo
python manage.py runserver     # queda en http://127.0.0.1:8000
```

## Evidencias

Las capturas de pantalla del funcionamiento (pantalla pública, login, dashboard privado, listado consumiendo la API, formulario con respuesta exitosa y ejemplo de restricción por rol) se encuentran en la carpeta [`docs/evidencias/`](./docs/evidencias/).

## Despliegue y CI/CD

El pipeline de integración continua se ejecuta en GitHub Actions en cada push y pull request a `main`: instala dependencias (`npm ci`), verifica tipos (`npx tsc --noEmit`) y compila el proyecto (`npm run build`).

Ver [`docs/CI-CD.md`](./docs/CI-CD.md) para la documentación completa del pipeline de integración y despliegue continuo.