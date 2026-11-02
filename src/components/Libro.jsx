import { useState } from "react";
import { useDispatch } from "react-redux";
import { Badge, Button, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    actualizarLibroSlice,
    borrarLibroSlice,
} from "../redux/features/librosSlice";
import { actualizarLibroApi, borrarLibroApi } from "../services/librosServices";
import { mensajeDeError } from "../utils/errores";

const Libro = ({ libro }) => {
    const dispatch = useDispatch();
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(libro.titulo);
    const [autor, setAutor] = useState(libro.autor);
    const [sinopsis, setSinopsis] = useState(libro.sinopsis ?? "");
    const [guardando, setGuardando] = useState(false);

    const invalido = !titulo.trim() || !autor.trim();

    const cancelar = () => {
        setTitulo(libro.titulo);
        setAutor(libro.autor);
        setSinopsis(libro.sinopsis ?? "");
        setEditando(false);
    };

    const guardar = async () => {
        const cambios = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            sinopsis: sinopsis.trim(),
        };
        try {
            setGuardando(true);
            await actualizarLibroApi(libro._id, cambios);
            // El PATCH devuelve el libro sin populate: solo fusionamos lo editado
            dispatch(actualizarLibroSlice({ id: libro._id, cambios }));
            setEditando(false);
            toast.success("Libro actualizado");
        } catch (e) {
            toast.error(mensajeDeError(e));
        } finally {
            setGuardando(false);
        }
    };

    const borrar = async () => {
        if (!window.confirm(`¿Eliminar "${libro.titulo}"?`)) return;
        try {
            await borrarLibroApi(libro._id);
            dispatch(borrarLibroSlice(libro._id));
            toast.success("Libro eliminado");
        } catch (e) {
            toast.error(mensajeDeError(e));
        }
    };

    return (
        <Card className="h-100 shadow-sm">
            {libro.portadaUrl ? (
                <Card.Img
                    variant="top"
                    src={libro.portadaUrl}
                    alt={libro.titulo}
                    style={{ height: 180, objectFit: "cover" }}
                />
            ) : (
                <div
                    className="bg-light text-muted d-flex align-items-center justify-content-center"
                    style={{ height: 180 }}
                >
                    Sin portada
                </div>
            )}

            <Card.Body className="d-flex flex-column">
                {editando ? (
                    <>
                        <Form.Control
                            className="mb-2"
                            value={titulo}
                            isInvalid={!titulo.trim()}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título"
                        />
                        <Form.Control
                            className="mb-2"
                            value={autor}
                            isInvalid={!autor.trim()}
                            onChange={(e) => setAutor(e.target.value)}
                            placeholder="Autor"
                        />
                        <Form.Control
                            as="textarea"
                            rows={3}
                            className="mb-2"
                            value={sinopsis}
                            onChange={(e) => setSinopsis(e.target.value)}
                            placeholder="Sinopsis"
                        />
                        <div className="mt-auto d-flex gap-2">
                            <Button
                                size="sm"
                                onClick={guardar}
                                disabled={invalido || guardando}
                            >
                                Guardar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={cancelar}
                                disabled={guardando}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Card.Title className="h6">{libro.titulo}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted small">
                            {libro.autor}
                        </Card.Subtitle>
                        {libro.categoria?.nombre && (
                            <div className="mb-2">
                                <Badge bg="secondary">{libro.categoria.nombre}</Badge>
                            </div>
                        )}
                        {libro.sinopsis && (
                            <Card.Text className="small texto-clamp">
                                {libro.sinopsis}
                            </Card.Text>
                        )}
                        <div className="mt-auto d-flex gap-2">
                            <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => setEditando(true)}
                            >
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={borrar}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default Libro;