import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LayoutPublico from '@/features/auth/LayoutPublico'
import Login from '@/features/auth/Login'
import Registro from '@/features/auth/Registro'
import Dashboard from '@/features/dashboard/Dashboard'
import Inicio from '@/features/dashboard/Inicio'
import BuscarLibros from '@/features/libros/BuscarLibros'
import CatalogoCompleto from '@/features/libros/CatalogoCompleto'
import Recomendaciones from '@/features/recomendaciones/Recomendaciones'
import SoloAdmin from '@/features/auth/SoloAdmin'
import Usuarios from '@/features/usuarios/Usuarios'
import Categorias from '@/features/categorias/Categorias'
import CambiarPlan from '@/features/usuarios/CambiarPlan'
import Resumen from '@/features/resumen/Resumen'
import Perfil from '@/features/usuarios/Perfil'

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
          <Route path="perfil" element={<Perfil />} />
          {/* Solo administradores */}
          <Route element={<SoloAdmin />}>
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Rutas
