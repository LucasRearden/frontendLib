import { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import Libro from "./Libro";
import AgregarLibro from "./AgregarLibro";

const LIMITE_PLUS = 4;

const Libros = () => {
    const libros = useSelector((state) => state.librosSlice);
    const usuario = useSelector((state) => state.sesionSlice.usuario);
    const [filtro, setFiltro] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    const limiteAlcanzado = usuario?.plan === "plus" && libros.length >= LIMITE_PLUS;

    const texto = filtro.trim().toLowerCase();
    const visibles = libros.filter(
        (l) =>
            l.titulo?.toLowerCase().includes(texto) ||
            l.autor?.toLowerCase().includes(texto)
    );

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center gap-3">
                    <h2 className="h5 mb-0">Mis libros ({libros.length})</h2>
                    <Button size="sm" onClick={() => setMostrarModal(true)} disabled={limiteAlcanzado}>
                        + Agregar libro
                    </Button>
                    {limiteAlcanzado && (
                        <small className="text-muted">Llegaste al límite de {LIMITE_PLUS} libros del plan plus.</small>
                    )}
                </div>
                <Form.Control
                    style={{ maxWidth: 260 }}
                    placeholder="Filtrar por título o autor"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            {libros.length === 0 ? (
                <Alert variant="light">Todavía no cargaste ningún libro.</Alert>
            ) : visibles.length === 0 ? (
                <Alert variant="light">Ningún libro coincide con el filtro.</Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-3">
                    {visibles.map((libro) => (
                        <Col key={libro._id}>
                            <Libro libro={libro} />
                        </Col>
                    ))}
                </Row>
            )}

            <AgregarLibro show={mostrarModal} onHide={() => setMostrarModal(false)} />
        </>
    );
};

export default Libros;