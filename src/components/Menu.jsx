import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { toast } from "react-toastify";
import { cerrarSesionSlice } from "../redux/features/sesionSlice";
import { cancelarVencimiento } from "../utils/sesion";

const enlaces = [
    { to: "/dashboard", texto: "Inicio", end: true },
    { to: "/dashboard/catalogo-completo", texto: "Catálogo completo" },
    { to: "/dashboard/recomendaciones", texto: "Recomendaciones" },
    { to: "/dashboard/buscar", texto: "Buscar libros" },
];

const enlacesAdmin = [
    { to: "/dashboard/usuarios", texto: "Usuarios" },
    { to: "/dashboard/categorias", texto: "Categorías" },
];

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usuario = useSelector((state) => state.sesionSlice.usuario);

    const cerrarSesion = () => {
        cancelarVencimiento();
        localStorage.removeItem("token");
        dispatch(cerrarSesionSlice());
        toast.info("Sesión cerrada");
        navigate("/login");
    };

    return (
        <Navbar bg="white" expand="md" className="border-bottom mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">Librería</Navbar.Brand>
                <Navbar.Toggle aria-controls="menu" />
                <Navbar.Collapse id="menu">
                    <Nav className="me-auto">
                        {(usuario?.role === "admin" ? [...enlaces, ...enlacesAdmin] : enlaces).map((e) => (
                            <Nav.Link key={e.to} as={NavLink} to={e.to} end={e.end}>
                                {e.texto}
                            </Nav.Link>
                        ))}
                    </Nav>
                    <span className="me-3 text-muted">{usuario?.username}</span>
                    <Button variant="outline-secondary" size="sm" onClick={cerrarSesion}>
                        Cerrar sesión
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Menu;