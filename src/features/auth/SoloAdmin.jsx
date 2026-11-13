import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const SoloAdmin = () => {
  const usuario = useSelector((state) => state.sesionSlice.usuario)
  return usuario?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  )
}

export default SoloAdmin
