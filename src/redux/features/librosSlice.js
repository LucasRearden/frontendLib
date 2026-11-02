import { createSlice } from "@reduxjs/toolkit";
import { cerrarSesionSlice } from "./sesionSlice";

const librosSlice = createSlice({
    name: "libros",
    initialState: [],
    reducers: {
        cargarLibrosInicialesSlice: (state, action) => action.payload,
                agregarLibroSlice: (state, action) => {
            state.unshift(action.payload);
        },
        actualizarLibroSlice: (state, action) => {
            const { id, cambios } = action.payload;
            const i = state.findIndex((l) => l._id === id);
            if (i !== -1) state[i] = { ...state[i], ...cambios };
        },
        borrarLibroSlice: (state, action) =>
            state.filter((l) => l._id !== action.payload),
    },
    extraReducers: (builder) => {
        // Al cerrar sesión se vacía la lista para no mostrar libros de otro usuario
        builder.addCase(cerrarSesionSlice, () => []);
    },
});

export const {
    cargarLibrosInicialesSlice,
    agregarLibroSlice,
    actualizarLibroSlice,
    borrarLibroSlice,
} = librosSlice.actions;
export default librosSlice.reducer;