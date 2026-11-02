import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";

import { registroApi } from "../services/authServices.js";
import { iniciarSesionSlice } from "../redux/features/sesionSlice.js";
import { mensajeDeError } from "../utils/errores.js";

// Mismas reglas que el backend (registerBodySchema)
const esquemaRegistro = Yup.object({
  username: Yup.string()
    .required("El usuario es obligatorio")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .matches(/^[a-zA-Z0-9]+$/, "El usuario solo puede tener letras y números"),
  email: Yup.string()
    .required("El email es obligatorio")
    .email("Ingresá un email válido"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña puede tener hasta 30 caracteres"),
  confirmPassword: Yup.string()
    .required("Repetí la contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});

const Registro = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const haySesion = useSelector((state) => Boolean(state.sesionSlice.token));
  const [errorApi, setErrorApi] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: esquemaRegistro,

    onSubmit: async (valores) => {
      setErrorApi("");
      try {
        // El backend espera exactamente estos cuatro campos
        const { token, user } = await registroApi({
          username: valores.username.trim(),
          email: valores.email.trim(),
          password: valores.password,
          confirmPassword: valores.confirmPassword,
        });

        jwtDecode(token);

        // Auto-login: el registro ya devuelve el token
        localStorage.setItem("token", token);
        dispatch(iniciarSesionSlice(token));

        toast.success(`Cuenta creada. Bienvenido, ${user.username}`);
        navigate("/dashboard");
      } catch (error) {
        setErrorApi(mensajeDeError(error));
      }
    },
  });

  if (haySesion) return <Navigate to="/dashboard" replace />;

  // Un campo del formulario (evita repetir el mismo bloque cuatro veces)
  const campo = (nombre, etiqueta, tipo, placeholder) => (
    <Form.Group className="mb-3" controlId={nombre}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        type={tipo}
        name={nombre}
        value={formik.values[nombre]}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched[nombre] && Boolean(formik.errors[nombre])}
      />
      <Form.Control.Feedback type="invalid">
        {formik.errors[nombre]}
      </Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Card style={{ width: "22rem", maxWidth: "100%" }}>
      <Card.Body>
        <Card.Title className="mb-3">Crear cuenta</Card.Title>

        {errorApi && <Alert variant="danger">{errorApi}</Alert>}

        <Form onSubmit={formik.handleSubmit} noValidate>
          {campo("username", "Usuario", "text", "Elegí un usuario")}
          {campo("email", "Email", "email", "Ingresá tu email")}
          {campo("password", "Contraseña", "password", "Elegí una contraseña")}
          {campo(
            "confirmPassword",
            "Repetir contraseña",
            "password",
            "Repetí la contraseña",
          )}

          {/* Deshabilitado mientras haya campos vacíos o inválidos */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </Form>

        <p className="text-center mt-3 mb-0">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </Card.Body>
    </Card>
  );
};

export default Registro;
