import { configureStore } from "@reduxjs/toolkit";
import sesionSlice from "./features/sesionSlice";
import librosSlice from "./features/librosSlice";

export const store = configureStore({
    reducer: {
        sesionSlice,
        librosSlice,
    },
});