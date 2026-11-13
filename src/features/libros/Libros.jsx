import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import Libro from './Libro'
import AgregarLibro from './AgregarLibro'

const LIMITE_PLUS = 4

const Libros = () => {
  const libros = useSelector((state) => state.librosSlice)
  const usuario = useSelector((state) => state.sesionSlice.usuario)
  const [filtro, setFiltro] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)

  const limiteAlcanzado =
    usuario?.plan === 'plus' && libros.length >= LIMITE_PLUS

  const texto = filtro.trim().toLowerCase()
  const visibles = libros.filter(
    (l) =>
      l.titulo?.toLowerCase().includes(texto) ||
      l.autor?.toLowerCase().includes(texto),
  )

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h2 className="h5 mb-1">Mis libros</h2>
          <span className="text-muted small">
            {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
            {usuario?.plan === 'plus' &&
              ` de ${LIMITE_PLUS} disponibles en tu plan`}
          </span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Form.Control
            style={{ width: 240 }}
            placeholder="Buscar por título o autor"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button
            onClick={() => setMostrarModal(true)}
            disabled={limiteAlcanzado}
          >
            Agregar libro
          </Button>
        </div>
      </div>

      {limiteAlcanzado && (
        <Alert variant="light">
          Llegaste al límite de {LIMITE_PLUS} libros del plan plus.
        </Alert>
      )}

      {libros.length === 0 ? (
        <Alert variant="light">
          Tu biblioteca está vacía. Agregá tu primer libro para empezar.
        </Alert>
      ) : visibles.length === 0 ? (
        <Alert variant="light">Ningún libro coincide con tu búsqueda.</Alert>
      ) : (
        <Row xs={2} md={3} lg={4} className="g-4">
          {visibles.map((libro) => (
            <Col key={libro._id}>
              <Libro libro={libro} />
            </Col>
          ))}
        </Row>
      )}

      <AgregarLibro show={mostrarModal} onHide={() => setMostrarModal(false)} />
    </>
  )
}

export default Libros
