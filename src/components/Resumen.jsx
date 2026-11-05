import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import { cargarLibrosInicialesSlice } from "../redux/features/librosSlice";
import { obtenerMisLibrosApi } from "../services/librosServices";
import { obtenerUsuariosApi } from "../services/usuariosServices";
import { mensajeDeError } from "../utils/errores";
import UsoPlan from "./UsoPlan";
import GraficoBarras from "./GraficoBarras";

const MAX_CATEGORIAS = 7; // el resto se agrupa en "Otras"

const Resumen = () => {
    const dispatch = useDispatch();
    const usuario = useSelector((state) => state.sesionSlice.usuario);
    const libros = useSelector((state) => state.librosSlice);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const esAdmin = usuario?.role === "admin";

    useEffect(() => {
        const controller = new AbortController();
        const cargar = async () => {
            try {
                dispatch(cargarLibrosInicialesSlice(await obtenerMisLibrosApi(controller.signal)));
                if (esAdmin) setUsuarios(await obtenerUsuariosApi(controller.signal));
            } catch (e) {
                if (e.code === "ERR_CANCELED") return;
                setError(mensajeDeError(e));
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };
        cargar();
        return () => controller.abort();
    }, [dispatch, esAdmin]);

    // Libros del usuario agrupados por categoría, de mayor a menor
    const porCategoria = useMemo(() => {
        const cuenta = {};
        libros.forEach((l) => {
            const nombre = l.categoria?.nombre ?? "Sin categoría";
            cuenta[nombre] = (cuenta[nombre] ?? 0) + 1;
        });
        const orden = Object.entries(cuenta)
            .map(([etiqueta, valor]) => ({ etiqueta, valor }))
            .sort((a, b) => b.valor - a.valor);
        if (orden.length <= MAX_CATEGORIAS) return orden;
        const resto = orden.slice(MAX_CATEGORIAS).reduce((suma, d) => suma + d.valor, 0);
        return [...orden.slice(0, MAX_CATEGORIAS), { etiqueta: "Otras", valor: resto }];
    }, [libros]);

    const porPlan = useMemo(
        () => [
            { etiqueta: "Plus", valor: usuarios.filter((u) => u.plan === "plus").length },
            { etiqueta: "Premium", valor: usuarios.filter((u) => u.plan === "premium").length },
        ],
        [usuarios]
    );

    if (cargando) return <div className="text-center my-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <>
            <h1 className="h4 mb-4">Resumen</h1>

            <Row className="g-4">
                <Col md={5}>
                    <UsoPlan cantidad={libros.length} plan={usuario?.plan} />
                </Col>
                <Col md={7}>
                    <div className="card uso-card">
                        <h2 className="h5 mb-3">Mis libros por categoría</h2>
                        {porCategoria.length === 0 ? (
                            <p className="text-muted mb-0">Cuando cargues libros vas a ver acá cómo se reparten por categoría.</p>
                        ) : (
                            <GraficoBarras datos={porCategoria} unidad="libro" />
                        )}
                    </div>
                </Col>

                {esAdmin && (
                    <Col xs={12}>
                        <div className="card uso-card">
                            <h2 className="h5 mb-1">Usuarios por plan</h2>
                            <p className="text-muted small mb-3">{usuarios.length} usuarios registrados</p>
                            <GraficoBarras datos={porPlan} unidad="usuario" />
                        </div>
                    </Col>
                )}
            </Row>
        </>
    );
};

export default Resumen;