import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// El backend firma en el token: id, username, role y plan.
// Con eso alcanza para mostrar al usuario sin pedir nada más al servidor.
const usuarioDesdeToken = (token) => {
  try {
    const { id, username, role, plan } = jwtDecode(token);
    return { id, username, role, plan };
  } catch {
    return null;
  }
};

// Al cargar la app (o al refrescar con F5) se recupera la sesión desde localStorage.
const cargarSesionInicial = () => {
  const token = localStorage.getItem("token");
  if (!token) return { token: null, usuario: null };

  try {
    const { exp } = jwtDecode(token);
    if (exp && exp * 1000 <= Date.now()) throw new Error("token vencido");
  } catch {
    localStorage.removeItem("token");
    return { token: null, usuario: null };
  }

  return { token, usuario: usuarioDesdeToken(token) };
};

const sesionSlice = createSlice({
  name: "sesionSlice",
  initialState: cargarSesionInicial(),
  reducers: {
    iniciarSesionSlice: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.usuario = usuarioDesdeToken(token);
    },
    cerrarSesionSlice: (state) => {
      state.token = null;
      state.usuario = null;
    },
  },
});

export const { iniciarSesionSlice, cerrarSesionSlice } = sesionSlice.actions;
export default sesionSlice.reducer;
