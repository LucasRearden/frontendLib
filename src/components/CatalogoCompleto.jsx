import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Pagination, Row, Spinner } from "react-bootstrap";
import { obtenerCatalogoApi } from "../services/librosServices";
import { obtenerCategoriasApi } from "../services/categoriasServices";
import { mensajeDeError } from "../utils/errores";

const POR_PAGINA = 9;
const vacios = { titulo: "", autor: "", categoria: "" };

const CatalogoCompleto = () => {
    const [form, setForm] = useState(vacios);       // lo que se escribe
    const [filtros, setFiltros] = useState(vacios); // lo que se aplicó
    const [pagina, setPagina] = useState(1);
    const [categorias, setCategorias] = useState([]);
    const [datos, setDatos] = useState({ libros: [], total: 0, totalPaginas: 1 });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        obtenerCategoriasApi().then(setCategorias).catch(() => {});
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            try {
                setCargando(true);
                setError("");
                const params = { pagina, limite: POR_PAGINA };
                Object.entries(filtros).forEach(([k, v]) => {
                    if (v.trim()) params[k] = v.trim();
                });
                setDatos(await obtenerCatalogoApi(params, controller.signal));
            } catch (e) {
                if (e.code === "ERR_CANCELED") return;
                setError(mensajeDeError(e));
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };
        cargar();
        return () => controller.abort();
    }, [filtros, pagina]);

    const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const aplicar = (e) => {
        e.preventDefault();
        setPagina(1);
        setFiltros(form);
    };

    const limpiar = () => {
        setForm(vacios);
        setPagina(1);
        setFiltros(vacios);
    };

    return (
        <>
            <h1 className="h4 mb-3">Catálogo completo</h1>

            <Form onSubmit={aplicar} className="mb-4">
                <Row className="g-2">
                    <Col md={4}>
                        <Form.Control name="titulo" placeholder="Título" value={form.titulo} onChange={cambiar} />
                    </Col>
                    <Col md={3}>
                        <Form.Control name="autor" placeholder="Autor" value={form.autor} onChange={cambiar} />
                    </Col>
                    <Col md={3}>
                        <Form.Select name="categoria" value={form.categoria} onChange={cambiar}>
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c._id} value={c._id}>{c.nombre}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2} className="d-flex gap-2">
                        <Button type="submit">Filtrar</Button>
                        <Button variant="outline-secondary" onClick={limpiar}>Limpiar</Button>
                    </Col>
                </Row>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            {cargando ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : datos.libros.length === 0 && !error ? (
                <Alert variant="light">No hay libros para mostrar.</Alert>
            ) : (
                <>
                    <p className="text-muted small">{datos.total} libro(s)</p>
                    <Row xs={1} md={2} lg={3} className="g-3">
                        {datos.libros.map((libro) => (
                            <Col key={libro._id}>
                                <Card className="h-100 shadow-sm">
                                    {libro.portadaUrl ? (
                                        <Card.Img variant="top" src={libro.portadaUrl} alt={libro.titulo}
                                            style={{ height: 160, objectFit: "cover" }} />
                                    ) : (
                                        <div className="bg-light text-muted d-flex align-items-center justify-content-center"
                                            style={{ height: 160 }}>Sin portada</div>
                                    )}
                                    <Card.Body>
                                        <Card.Title className="h6">{libro.titulo}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted small">{libro.autor}</Card.Subtitle>
                                        {libro.categoria?.nombre && <Badge bg="secondary">{libro.categoria.nombre}</Badge>}
                                        {libro.sinopsis && <Card.Text className="small texto-clamp mt-2">{libro.sinopsis}</Card.Text>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {datos.totalPaginas > 1 && (
                        <Pagination className="justify-content-center mt-4">
                            <Pagination.Prev disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} />
                            <Pagination.Item active>{pagina} / {datos.totalPaginas}</Pagination.Item>
                            <Pagination.Next disabled={pagina >= datos.totalPaginas} onClick={() => setPagina(pagina + 1)} />
                        </Pagination>
                    )}
                </>
            )}
        </>
    );
};

export default CatalogoCompleto;