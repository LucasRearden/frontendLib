import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { cargarLibrosInicialesSlice } from '@/features/libros/librosSlice'
import { obtenerMisLibrosApi } from '@/features/libros/librosServices'

const Perfil = () => {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.sesionSlice.usuario)
  const token = useSelector((state) => state.sesionSlice.token)
  const libros = useSelector((state) => state.librosSlice)

  // Para que la cantidad de libros sea la real aunque no hayas pasado por Inicio
  useEffect(() => {
    const controller = new AbortController()
    obtenerMisLibrosApi(controller.signal)
      .then((lista) => dispatch(cargarLibrosInicialesSlice(lista)))
      .catch(() => {})
    return () => controller.abort()
  }, [dispatch])

  // El token trae la fecha de vencimiento de la sesión
  const vence = useMemo(() => {
    try {
      const { exp } = jwtDecode(token)
      return exp ? new Date(exp * 1000) : null
    } catch {
      return null
    }
  }, [token])

  const esAdmin = usuario?.role === 'admin'

  return (
    <>
      <h1 className="h4 mb-4">Mi perfil</h1>

      <div className="card uso-card" style={{ maxWidth: 520 }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="avatar" aria-hidden="true">
            {usuario?.username?.[0]}
          </div>
          <div>
            <h2 className="h5 mb-1">{usuario?.username}</h2>
            <span className="etiqueta">
              {esAdmin ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        <dl className="perfil-datos">
          <div>
            <dt>Plan</dt>
            <dd>
              {usuario?.plan === 'premium' ? 'Premium' : 'Plus'}
              {usuario?.plan !== 'premium' && (
                <>
                  {' '}
                  · <Link to="/dashboard/plan">Pasar a premium</Link>
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>Libros cargados</dt>
            <dd>{libros.length}</dd>
          </div>
          {vence && (
            <div>
              <dt>Tu sesión vence</dt>
              <dd>
                {vence.toLocaleString('es-UY', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </dd>
            </div>
          )}
        </dl>

        <Link to="/dashboard/resumen" className="small mt-3">
          Ver mi resumen de uso
        </Link>
      </div>
    </>
  )
}

export default Perfil
