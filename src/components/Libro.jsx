import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    actualizarLibroSlice,
    borrarLibroSlice,
} from "../redux/features/librosSlice";
import { actualizarLibroApi, borrarLibroApi } from "../services/librosServices";
import { mensajeDeError } from "../utils/errores";
import Portada from "./Portada";

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
        <div className="libro-tile">
            <Portada libro={libro} />

            {editando ? (
                <div className="d-flex flex-column gap-2">
                    <Form.Control size="sm" value={titulo} isInvalid={!titulo.trim()}
                        onChange={(e) => setTitulo(e.target.value)} placeholder="Título" />
                    <Form.Control size="sm" value={autor} isInvalid={!autor.trim()}
                        onChange={(e) => setAutor(e.target.value)} placeholder="Autor" />
                    <Form.Control size="sm" as="textarea" rows={3} value={sinopsis}
                        onChange={(e) => setSinopsis(e.target.value)} placeholder="Sinopsis" />
                    <div className="d-flex gap-2">
                        <Button size="sm" onClick={guardar} disabled={invalido || guardando}>Guardar</Button>
                        <Button size="sm" variant="outline-secondary" onClick={cancelar} disabled={guardando}>Cancelar</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <h3 className="libro-titulo">{libro.titulo}</h3>
                        <p className="libro-autor">{libro.autor}</p>
                        {libro.categoria?.nombre && <span className="etiqueta">{libro.categoria.nombre}</span>}
                        {libro.sinopsis && <p className="libro-sinopsis texto-clamp">{libro.sinopsis}</p>}
                    </div>
                    <div className="libro-acciones">
                        <button type="button" className="btn-texto" onClick={() => setEditando(true)}>Editar</button>
                        <button type="button" className="btn-texto peligro" onClick={borrar}>Eliminar</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Libro;