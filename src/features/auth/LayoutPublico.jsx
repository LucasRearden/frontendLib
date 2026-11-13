import { Outlet } from 'react-router-dom'

// Contenedor centrado para las pantallas sin sesión (login y registro)
const LayoutPublico = () => {
  return (
    <div className="layout-publico">
      <Outlet />
    </div>
  )
}

export default LayoutPublico
