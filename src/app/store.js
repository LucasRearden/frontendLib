import { configureStore } from '@reduxjs/toolkit'
import sesionSlice from '@/features/auth/sesionSlice'
import librosSlice from '@/features/libros/librosSlice'
import cargaSlice from '@/lib/cargaSlice'

export const store = configureStore({
  reducer: {
    sesionSlice,
    librosSlice,
    cargaSlice,
  },
})
