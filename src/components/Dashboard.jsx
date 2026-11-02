import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import { toast } from "react-toastify";

import Menu from "./Menu.jsx";
import { cerrarSesionSlice } from "../redux/features/sesionSlice.js";
import { programarVencimiento, cancelarVencimiento } from "../utils/sesion.js";

// Protege todo lo que está bajo /dashboard: sin token, vuelve al login.
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.sesionSlice.token);

  // Cuando el token vence se cierra la sesión sola. Corre al iniciar sesión
  // y también al refrescar la página, porque depende del token que hay en Redux.
  useEffect(() => {
    if (!token) return;

    programarVencimiento(token, () => {
      dispatch(cerrarSesionSlice());
      toast.info("Tu sesión venció. Iniciá sesión nuevamente.");
      navigate("/login", { replace: true });
    });

    return cancelarVencimiento;
  }, [token, dispatch, navigate]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Menu />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default Dashboard;
