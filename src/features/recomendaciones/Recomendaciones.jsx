import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import { pedirRecomendacionesApi } from './recomendacionesServices'
import { mensajeDeError } from '@/lib/errores'

const MAXIMO = 8

const Recomendaciones = () => {
  const misLibros = useSelector((state) => state.librosSlice)
  const [titulo, setTitulo] = useState('')
  const [lista, setLista] = useState([])
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const completo = lista.length >= MAXIMO

  const agregar = (e) => {
    e.preventDefault()
    const t = titulo.trim()
    if (!t || completo) return
    if (lista.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setError('Ese libro ya está en la lista.')
      return
    }
    setError('')
    setLista([...lista, t])
    setTitulo('')
  }

  const quitar = (t) => setLista(lista.filter((x) => x !== t))

  const usarMisLibros = () => {
    setError('')
    setLista(misLibros.slice(0, MAXIMO).map((l) => l.titulo))
  }

  const pedir = async () => {
    try {
      setCargando(true)
      setError('')
      setResultado(await pedirRecomendacionesApi(lista))
    } catch (e) {
      setResultado(null)
      setError(mensajeDeError(e))
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <h1 className="h4 mb-1">Recomendaciones</h1>
      <p className="text-muted">
        Agregá hasta {MAXIMO} libros que te gustaron y te sugerimos qué leer
        después.
      </p>

      <Form onSubmit={agregar} className="mb-3">
        <InputGroup>
          <Form.Control
            placeholder={completo ? 'Llegaste al máximo' : 'Título de un libro'}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={completo}
          />
          <Button type="submit" disabled={!titulo.trim() || completo}>
            Agregar
          </Button>
        </InputGroup>
      </Form>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        {lista.map((t) => (
          <Badge
            key={t}
            bg="secondary"
            className="d-flex align-items-center gap-2 fw-normal fs-6"
          >
            {t}
            <button
              type="button"
              className="btn-close btn-close-white"
              style={{ fontSize: 10 }}
              aria-label={`Quitar ${t}`}
              onClick={() => quitar(t)}
            />
          </Badge>
        ))}
        {lista.length === 0 && (
          <span className="text-muted small">Todavía no agregaste libros.</span>
        )}
      </div>

      <div className="d-flex align-items-center gap-2 mb-4">
        <Button onClick={pedir} disabled={lista.length === 0 || cargando}>
          {cargando ? <Spinner size="sm" animation="border" /> : 'Recomendarme'}
        </Button>
        {misLibros.length > 0 && (
          <Button
            variant="outline-secondary"
            onClick={usarMisLibros}
            disabled={cargando}
          >
            Usar mis libros
          </Button>
        )}
        <small className="text-muted ms-auto">
          {lista.length}/{MAXIMO}
        </small>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {resultado && resultado.length === 0 && (
        <Alert variant="light">No hubo recomendaciones.</Alert>
      )}
      {resultado && resultado.length > 0 && (
        <Row xs={1} md={3} className="g-3">
          {resultado.map((r) => (
            <Col key={`${r.titulo}|${r.descripcion}`}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="h6">{r.titulo}</Card.Title>
                  <Card.Text className="small">{r.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default Recomendaciones
