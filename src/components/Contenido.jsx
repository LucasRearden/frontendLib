import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Spinner } from "react-bootstrap";
import { cargarLibrosInicialesSlice } from "../redux/features/librosSlice";
import { obtenerMisLibrosApi } from "../services/librosServices";
import { mensajeDeError } from "../utils/errores";
import Libros from "./Libros";

const Contenido = () => {
    const dispatch = useDispatch();
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            try {
                const libros = await obtenerMisLibrosApi(controller.signal);
                dispatch(cargarLibrosInicialesSlice(libros));
                setError("");
            } catch (e) {
                if (e.code === "ERR_CANCELED") return;
                setError(mensajeDeError(e));
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };
        cargar();
        return () => controller.abort();
    }, [dispatch]);

    if (cargando) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" />
            </div>
        );
    }
    if (error) return <Alert variant="danger">{error}</Alert>;
    return <Libros />;
};

export default Contenido;