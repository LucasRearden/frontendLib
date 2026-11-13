import { useSelector } from 'react-redux'
import { Badge } from 'react-bootstrap'
import Contenido from '@/features/libros/Contenido'

const Inicio = () => {
  const usuario = useSelector((state) => state.sesionSlice.usuario)

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-4">
        <h1 className="h4 mb-0">Hola, {usuario?.username}</h1>
        <Badge bg={usuario?.role === 'admin' ? 'dark' : 'primary'}>
          {usuario?.role === 'admin'
            ? 'Administrador'
            : `Plan ${usuario?.plan}`}
        </Badge>
      </div>
      <Contenido />
    </>
  )
}

export default Inicio
