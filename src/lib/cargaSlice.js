import { createSlice } from '@reduxjs/toolkit'

// Cuenta cuántas peticiones están en curso. Si hay alguna, se muestra el loader.
const cargaSlice = createSlice({
  name: 'carga',
  initialState: { pendientes: 0 },
  reducers: {
    iniciarCarga: (state) => {
      state.pendientes += 1
    },
    terminarCarga: (state) => {
      state.pendientes = Math.max(0, state.pendientes - 1)
    },
  },
})

export const { iniciarCarga, terminarCarga } = cargaSlice.actions
export default cargaSlice.reducer
