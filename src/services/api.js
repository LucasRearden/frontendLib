import axios from "axios";
import { store } from "../redux/store.js";
import { cerrarSesionSlice } from "../redux/features/sesionSlice.js";
import { iniciarCarga, terminarCarga } from "../redux/features/cargaSlice.js"; // LOADER

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de la petición: agrega el token (si hay) en cada llamada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Para una petición de fondo sin loader: api.get(url, { silencioso: true })
  if (!config.silencioso) store.dispatch(iniciarCarga()); // LOADER
  return config;
});

// Interceptor de la respuesta: si el servidor dice 401, se limpia la sesión
api.interceptors.response.use(
  (response) => {
    if (!response.config.silencioso) store.dispatch(terminarCarga()); // LOADER
    return response;
  },
  (error) => {
    if (!error.config?.silencioso) store.dispatch(terminarCarga()); // LOADER

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      store.dispatch(cerrarSesionSlice());
    }
    return Promise.reject(error);
  },
);

export default api;