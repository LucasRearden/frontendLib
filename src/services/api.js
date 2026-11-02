import axios from "axios";
import { store } from "../redux/store.js";
import { cerrarSesionSlice } from "../redux/features/sesionSlice.js";

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
  return config;
});

// Interceptor de la respuesta: si el servidor dice 401, se limpia la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      store.dispatch(cerrarSesionSlice());
    }
    return Promise.reject(error);
  },
);

export default api;
