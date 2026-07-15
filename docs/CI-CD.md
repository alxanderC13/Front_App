# Documentación de Despliegue CI/CD — QuitoMove Frontend

Este documento describe el pipeline de Integración Continua (CI) y Despliegue Continuo (CD) del frontend, usando **GitHub Actions** para CI y **Vercel** (o Netlify, ver alternativa) para CD.

## 1. Objetivo del pipeline

Automatizar, en cada cambio subido al repositorio:

1. **CI (Integración Continua)**: instalar dependencias, verificar tipos de TypeScript y compilar el proyecto, para detectar errores antes de que lleguen a producción.
2. **CD (Despliegue Continuo)**: publicar automáticamente la última versión funcional en una URL pública, sin pasos manuales.

## 2. Flujo general

```
git push (rama main)
        │
        ▼
GitHub Actions (CI)
  ├─ checkout del código
  ├─ instalar Node.js + dependencias (npm ci)
  ├─ npx tsc --noEmit   (verificación de tipos)
  └─ npm run build      (build de producción)
        │
        ▼  (si todo pasa)
Vercel (CD)
  └─ despliegue automático a producción
```

Si cualquier paso de CI falla (errores de TypeScript o de build), el pipeline se detiene y **no se despliega** una versión rota.

## 3. Configuración de CI — GitHub Actions

Archivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Verificar tipos de TypeScript
        run: npx tsc --noEmit

      - name: Compilar proyecto (build de producción)
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

Este workflow se ejecuta automáticamente en cada `push` o `pull request` hacia la rama `main`.

### Variable de entorno en CI

`VITE_API_BASE_URL` se guarda como **secret** del repositorio (no en el código), para no exponer URLs internas y poder cambiarla sin tocar el pipeline:

1. En GitHub: **Settings → Secrets and variables → Actions → New repository secret**.
2. Nombre: `VITE_API_BASE_URL`.
3. Valor: la URL pública del backend (ej. `https://api-quitomove.onrender.com/api`).

## 4. Configuración de CD — Vercel

Vercel se conecta directamente al repositorio de GitHub y despliega automáticamente:

1. Crear cuenta/proyecto en [vercel.com](https://vercel.com) e **importar el repositorio de GitHub**.
2. Configuración del proyecto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. En **Settings → Environment Variables**, agregar:
   - `VITE_API_BASE_URL` = URL pública del backend (la misma que en el secret de GitHub Actions).
4. Cada `push` a `main` dispara automáticamente un nuevo despliegue de producción. Cada `pull request` genera un **preview deployment** con una URL única para revisar cambios antes de mezclarlos.

### Alternativa: Netlify

Si se prefiere Netlify en vez de Vercel, la configuración equivalente es un archivo `netlify.toml` en la raíz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://api-quitomove.onrender.com/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

El bloque `redirects` es necesario porque React Router usa rutas del lado del cliente (`BrowserRouter`); sin esta regla, refrescar una ruta como `/admin/vehicles` directamente en el navegador devolvería 404.

## 5. Requisito de CORS en el backend

Para que el frontend desplegado pueda consumir la API, el backend Django debe incluir la URL de producción del frontend en `CORS_ALLOWED_ORIGINS` (variable de entorno del backend, gestionada por el equipo de backend):

```
CORS_ALLOWED_ORIGINS=https://quitomove-frontend.vercel.app
```

## 6. Rollback

- **Vercel/Netlify**: cada despliegue queda versionado; se puede revertir a cualquier despliegue anterior desde el dashboard con un clic ("Promote to Production" / "Rollback").
- **Git**: alternativamente, revertir el commit problemático (`git revert <hash>`) y hacer push dispara un nuevo despliegue correcto automáticamente.

## 7. Resumen del pipeline

| Etapa | Herramienta | Disparador | Resultado |
|---|---|---|---|
| CI | GitHub Actions | Push / PR a `main` | Verifica tipos y build; bloquea si falla |
| CD | Vercel (o Netlify) | Push a `main` (tras CI exitoso) | Despliegue automático a producción |
| Preview | Vercel (o Netlify) | Pull Request | URL de vista previa por cada PR |
