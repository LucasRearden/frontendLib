import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { cambiarPlanApi } from "../services/usuariosServices";
import { cerrarSesionSlice, iniciarSesionSlice } from "../redux/features/sesionSlice";
import { cancelarVencimiento, programarVencimiento } from "../utils/sesion";
import { mensajeDeError } from "../utils/errores";

const PLANES = [
    {
        id: "plus",
        nombre: "Plus",
        detalle: "El plan con el que empezás.",
        items: ["Hasta 4 libros propios", "Catálogo, búsqueda y recomendaciones"],
    },
    {
        id: "premium",
        nombre: "Premium",
        detalle: "Para quienes quieren una biblioteca sin tope.",
        items: ["Libros propios sin límite", "Catálogo, búsqueda y recomendaciones"],
    },
];

const CambiarPlan = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usuario = useSelector((state) => state.sesionSlice.usuario);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [cambiando, setCambiando] = useState(false);

    const esPremium = usuario?.plan === "premium";

    const cerrarSesion = (mensaje) => {
        cancelarVencimiento();
        localStorage.removeItem("token");
        dispatch(cerrarSesionSlice());
        toast.info(mensaje);
        navigate("/login", { replace: true });
    };

    const confirmar = async () => {
        try {
            setCambiando(true);
            const data = await cambiarPlanApi();

            if (!data?.token) {
                // El backend no devolvió un token nuevo: hay que volver a entrar para que el plan aplique
                cerrarSesion("Plan actualizado. Iniciá sesión de nuevo para usarlo.");
                return;
            }

            // El plan viaja dentro del token: lo reemplazamos para que el cambio valga ya
            localStorage.setItem("token", data.token);
            dispatch(iniciarSesionSlice(data.token));
            programarVencimiento(data.token, () => cerrarSesion("Tu sesión venció. Iniciá sesión nuevamente."));
            setMostrarModal(false);
            toast.success("Ahora tenés el plan premium");
        } catch (e) {
            toast.error(mensajeDeError(e));
        } finally {
            setCambiando(false);
        }
    };

    return (
        <>
            <h1 className="h4 mb-1">Mi plan</h1>
            <p className="text-muted mb-4">
                Tu plan actual es <strong>{esPremium ? "Premium" : "Plus"}</strong>.
            </p>

            <Row className="g-4">
                {PLANES.map((plan) => {
                    const actual = usuario?.plan === plan.id;
                    return (
                        <Col md={6} key={plan.id}>
                            <div className={`card plan-card ${actual ? "actual" : ""}`}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <h2 className="h5 mb-1">{plan.nombre}</h2>
                                    {actual && <span className="etiqueta">Tu plan</span>}
                                </div>
                                <p className="text-muted small mb-0">{plan.detalle}</p>
                                <ul className="plan-lista">
                                    {plan.items.map((item) => <li key={item}>{item}</li>)}
                                </ul>

                                {plan.id === "premium" && !esPremium && (
                                    <Button className="mt-3" onClick={() => setMostrarModal(true)}>
                                        Pasar a Premium
                                    </Button>
                                )}
                            </div>
                        </Col>
                    );
                })}
            </Row>

            {esPremium && (
                <p className="text-muted small mt-4">
                    Ya tenés el plan más completo. No hace falta hacer nada más.
                </p>
            )}

            <Modal show={mostrarModal} onHide={() => !cambiando && setMostrarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="h5">Pasar a Premium</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Vas a poder cargar libros sin límite. El cambio se aplica enseguida.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setMostrarModal(false)} disabled={cambiando}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmar} disabled={cambiando}>
                        {cambiando ? <Spinner size="sm" animation="border" /> : "Confirmar cambio"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CambiarPlan;