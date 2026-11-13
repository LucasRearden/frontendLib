import { useEffect, useState } from 'react'
import { Alert, Badge, Spinner, Table } from 'react-bootstrap'
import { obtenerUsuariosApi } from './usuariosServices'
import { mensajeDeError } from '@/lib/errores'

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const cargar = async () => {
      try {
        setUsuarios(await obtenerUsuariosApi(controller.signal))
      } catch (e) {
        if (e.code === 'ERR_CANCELED') return
        setError(mensajeDeError(e))
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }
    cargar()
    return () => controller.abort()
  }, [])

  if (cargando)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    )

  return (
    <>
      <h1 className="h4 mb-3">Usuarios ({usuarios.length})</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && usuarios.length === 0 && (
        <Alert variant="light">No hay usuarios.</Alert>
      )}
      {usuarios.length > 0 && (
        <Table responsive hover className="align-middle bg-white">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <Badge
                    bg={u.plan === 'premium' ? 'warning' : 'secondary'}
                    text={u.plan === 'premium' ? 'dark' : undefined}
                  >
                    {u.plan}
                  </Badge>
                </td>
                <td>
                  {u.role === 'admin' ? (
                    <Badge bg="dark">Administrador</Badge>
                  ) : (
                    'Usuario'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default Usuarios
