import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { buscarGoogleBooksApi } from "../services/googleBooksServices";
import { mensajeDeError } from "../utils/errores";

const esquema = Yup.object({
    titulo: Yup.string().trim().min(2, "Mínimo 2 caracteres").required("Escribí un título"),
});

const BuscarLibros = () => {
    const [resultados, setResultados] = useState(null); // null = todavía no buscó
    const [error, setError] = useState("");

    const buscar = async ({ titulo }, { setSubmitting }) => {
        try {
            setError("");
            setResultados(await buscarGoogleBooksApi(titulo.trim()));
        } catch (e) {
            setResultados(null);
            setError(mensajeDeError(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
           <h1 className="h4 mb-1">Buscá libros en la red</h1>
<p className="text-muted mb-3">Escribí el título de un libro y te mostramos lo que encontramos.</p>

            <Formik initialValues={{ titulo: "" }} validationSchema={esquema} onSubmit={buscar}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
                        <div className="flex-grow-1">
                            <Form.Control
                                name="titulo"
                                placeholder="Título del libro"
                                value={values.titulo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.titulo && !!errors.titulo}
                            />
                            <Form.Control.Feedback type="invalid">{errors.titulo}</Form.Control.Feedback>
                        </div>
                        <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
                            {isSubmitting ? <Spinner size="sm" animation="border" /> : "Buscar"}
                        </Button>
                    </Form>
                )}
            </Formik>

            {error && <Alert variant="danger">{error}</Alert>}
            {resultados && resultados.length === 0 && (
                <Alert variant="light">No se encontraron resultados.</Alert>
            )}
            {resultados && resultados.length > 0 && (
                <Row xs={1} md={2} className="g-3">
                    {resultados.map((r, i) => (
                        <Col key={i}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h6">{r.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted small">
                                        {r.autores?.join(", ") || "Autor desconocido"}
                                    </Card.Subtitle>
                                    <Card.Text className="small texto-clamp">
                                        {r.descripcion || "Sin descripción."}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default BuscarLibros;