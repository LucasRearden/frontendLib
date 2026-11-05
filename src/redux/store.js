import { configureStore } from "@reduxjs/toolkit";
import sesionSlice from "./features/sesionSlice";
import librosSlice from "./features/librosSlice";
import cargaSlice from "./features/cargaSlice";

export const store = configureStore({
    reducer: {
        sesionSlice,
        librosSlice,
        cargaSlice,
    },
});