import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/estilos.css";
import "./styles/tema.css";

import { store } from "./redux/store.js";
import Rutas from "./components/Rutas.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <Rutas />
    </Provider>
  </StrictMode>,
);