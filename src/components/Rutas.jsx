import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LayoutPublico from "./LayoutPublico.jsx";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Dashboard from "./Dashboard.jsx";
import Inicio from "./Inicio.jsx";
import BuscarLibros from "./BuscarLibros";
import CatalogoCompleto from "./CatalogoCompleto";
import Recomendaciones from "./Recomendaciones";
import SoloAdmin from "./SoloAdmin";
import Usuarios from "./Usuarios";
import Categorias from "./Categorias";
import CambiarPlan from "./CambiarPlan";
import Resumen from "./Resumen";

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPublico />}>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Inicio />} />
          <Route path="buscar" element={<BuscarLibros />} />
          <Route path="catalogo-completo" element={<CatalogoCompleto />} />
          <Route path="recomendaciones" element={<Recomendaciones />} />
          <Route path="plan" element={<CambiarPlan />} />
          <Route path="resumen" element={<Resumen />} />
          {/* Solo administradores */}
          <Route element={<SoloAdmin />}>
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;