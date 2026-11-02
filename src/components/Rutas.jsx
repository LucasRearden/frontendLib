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
    <Route element={<SoloAdmin />}>
    <Route path="usuarios" element={<Usuarios />} />
    <Route path="categorias" element={<Categorias />} />
</Route>
    
<Route path="recomendaciones" element={<Recomendaciones />} />
</Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
