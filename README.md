# frontendLib

SPA de gestión de biblioteca personal: cada usuario administra sus libros, busca en Google Books, recibe recomendaciones y gestiona su plan. Los administradores además gestionan usuarios y categorías.

Frontend de un backend REST aparte (autenticación JWT, libros, categorías, usuarios, imágenes, recomendaciones).

## Stack

React 19 · Vite · Redux Toolkit · React Router 7 · Axios · Formik + Yup · React-Bootstrap · Chart.js · Oxlint + Oxfmt · Bun

## Requisitos

- [Bun](https://bun.sh) 1.4.4

## Puesta en marcha

```bash
bun install
cp .env.example .env   # completar VITE_API_URL
bun run dev
```

## Variables de entorno

| Variable       | Descripción                                            |
| -------------- | ------------------------------------------------------ |
| `VITE_API_URL` | URL base del backend (ej. `http://localhost:3000/api`) |

## Scripts

| Script                 | Qué hace                                             |
| ---------------------- | ---------------------------------------------------- |
| `bun run dev`          | Servidor de desarrollo                               |
| `bun run build`        | Build de producción en `dist/`                       |
| `bun run preview`      | Sirve el build                                       |
| `bun run lint`         | Oxlint                                               |
| `bun run format`       | Oxfmt (escribe)                                      |
| `bun run format:check` | Oxfmt (solo verifica)                                |
| `bun run test`         | `bun test` (pasa sin tests)                          |
| `bun run check`        | lint + format:check + test + build (lo que corre CI) |

## Estructura

```
src/
├── main.jsx            entrada: providers y montaje
├── app/                store de Redux y rutas
├── features/           un directorio por dominio
│   ├── auth/           login, registro, sesión (slice, token, vencimiento), guard de admin
│   ├── dashboard/      layout autenticado, menú, inicio
│   ├── libros/         catálogo, mis libros, alta/edición, Google Books, imágenes
│   ├── categorias/     ABM de categorías (admin)
│   ├── usuarios/       listado (admin), perfil, cambio de plan
│   ├── resumen/        métricas y gráfico
│   └── recomendaciones/
├── components/         componentes compartidos (LoaderGlobal)
├── lib/                cliente HTTP (api), loader global (cargaSlice), manejo de errores
└── styles/             estilos globales y tema
```

Reglas: cada feature contiene sus componentes, slice y servicios; lo compartido va en `components/` o `lib/`. Los imports entre carpetas usan el alias `@/` (= `src/`); dentro de una misma carpeta, rutas relativas.

## Rutas

| Ruta                                     | Acceso  |
| ---------------------------------------- | ------- |
| `/login`, `/registro`                    | público |
| `/dashboard`                             | usuario |
| `/dashboard/buscar`                      | usuario |
| `/dashboard/catalogo-completo`           | usuario |
| `/dashboard/recomendaciones`             | usuario |
| `/dashboard/plan`, `/resumen`, `/perfil` | usuario |
| `/dashboard/usuarios`, `/categorias`     | admin   |

## CI

- `.github/workflows/checks.yml`: `bun run check` en PR y push a `main`.
- `.github/workflows/format.yml`: `bun run format:check` en PR y push a `main`.

Ambos en `ubuntu-latest` con Bun fijado en 1.4.4 y `bun install --frozen-lockfile`.

## Deploy

Vercel (`vercel.json` reescribe todo a `index.html` para el router del cliente).

## Docs

Ver [`docs/`](docs/README.md).
