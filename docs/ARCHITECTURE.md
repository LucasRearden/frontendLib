# Arquitectura del frontend

## Organización

Estructura por features en `src/` (ver README). Estado global con Redux Toolkit: `sesionSlice` (auth), `librosSlice` (libros del usuario), `cargaSlice` (loader global).

## Flujos clave

- **Sesión**: el JWT vive en `localStorage`. Al iniciar, `sesionSlice` lo valida y deriva el usuario del token. `programarVencimiento` cierra la sesión al expirar.
- **HTTP**: `lib/api.js` (Axios) agrega `Authorization` y limpia la sesión ante un 401. Pasar `{ silencioso: true }` evita el loader global.
- **Errores**: `lib/errores.js` convierte el error de Axios en un mensaje para la UI.

## Desvíos del estándar de la casa

- JavaScript (JSX), sin TypeScript: no hay `typecheck`. `check` agrega `build` para detectar errores de import.
- React-Bootstrap en lugar de Tailwind v4.
- Sin tests todavía (`bun test --pass-with-no-tests`).
