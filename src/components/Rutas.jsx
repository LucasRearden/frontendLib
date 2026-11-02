import { Navigate, Route, Routes } from "react-router-dom";
import LayoutPublico from "./LayoutPublico";
import Login from "./Login";
import Registro from "./Registro";
import Dashboard from "./Dashboard";
import Inicio from "./Inicio";
import CatalogoCompleto from "./CatalogoCompleto";
import Recomendaciones from "./Recomendaciones";
import BuscarLibros from "./BuscarLibros";
import CambiarPlan from "./CambiarPlan";
import SoloAdmin from "./SoloAdmin";
import Usuarios from "./Usuarios";
import Categorias from "./Categorias";

const Rutas = () => (
    <Routes>
        <Route element={<LayoutPublico />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Inicio />} />
            <Route path="catalogo-completo" element={<CatalogoCompleto />} />
            <Route path="recomendaciones" element={<Recomendaciones />} />
            <Route path="buscar" element={<BuscarLibros />} />
            <Route path="plan" element={<CambiarPlan />} />

            <Route element={<SoloAdmin />}>
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="categorias" element={<Categorias />} />
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
);

export default Rutas;