import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Form,
  InputGroup,
  Spinner,
  Table,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  actualizarCategoriaApi,
  borrarCategoriaApi,
  crearCategoriaApi,
  obtenerCategoriasApi,
} from './categoriasServices'
import { mensajeDeError } from '@/lib/errores'

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [nueva, setNueva] = useState('')
  const [creando, setCreando] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const cargar = async () => {
      try {
        setCategorias(await obtenerCategoriasApi(controller.signal))
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

  const crear = async (e) => {
    e.preventDefault()
    try {
      setCreando(true)
      const c = await crearCategoriaApi(nueva.trim())
      setCategorias([...categorias, c])
      setNueva('')
      toast.success('Categoría creada')
    } catch (err) {
      toast.error(mensajeDeError(err))
    } finally {
      setCreando(false)
    }
  }

  const empezarEdicion = (c) => {
    setEditandoId(c._id)
    setNombreEdit(c.nombre)
  }

  const guardar = async (id) => {
    try {
      setGuardando(true)
      const nombre = nombreEdit.trim()
      await actualizarCategoriaApi(id, nombre)
      setCategorias(
        categorias.map((c) => (c._id === id ? { ...c, nombre } : c)),
      )
      setEditandoId(null)
      toast.success('Categoría actualizada')
    } catch (err) {
      toast.error(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (c) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return
    try {
      await borrarCategoriaApi(c._id)
      setCategorias(categorias.filter((x) => x._id !== c._id))
      toast.success('Categoría eliminada')
    } catch (err) {
      // Si tiene libros asociados el backend lo bloquea y avisa acá
      toast.error(mensajeDeError(err))
    }
  }

  if (cargando)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    )

  return (
    <>
      <h1 className="h4 mb-3">Categorías</h1>

      <Form onSubmit={crear} className="mb-4" style={{ maxWidth: 420 }}>
        <InputGroup>
          <Form.Control
            placeholder="Nombre de la nueva categoría"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <Button type="submit" disabled={!nueva.trim() || creando}>
            {creando ? <Spinner size="sm" animation="border" /> : 'Crear'}
          </Button>
        </InputGroup>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {!error && categorias.length === 0 && (
        <Alert variant="light">Todavía no hay categorías.</Alert>
      )}

      {categorias.length > 0 && (
        <Table responsive hover className="align-middle bg-white">
          <thead>
            <tr>
              <th>Nombre</th>
              <th style={{ width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c._id}>
                <td>
                  {editandoId === c._id ? (
                    <Form.Control
                      size="sm"
                      value={nombreEdit}
                      isInvalid={!nombreEdit.trim()}
                      onChange={(e) => setNombreEdit(e.target.value)}
                    />
                  ) : (
                    c.nombre
                  )}
                </td>
                <td className="d-flex gap-2">
                  {editandoId === c._id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => guardar(c._id)}
                        disabled={!nombreEdit.trim() || guardando}
                      >
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setEditandoId(null)}
                        disabled={guardando}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => empezarEdicion(c)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => borrar(c)}
                      >
                        Eliminar
                      </Button>
                    </>
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

export default Categorias
