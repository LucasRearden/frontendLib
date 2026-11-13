import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { loginApi } from './authServices'
import { iniciarSesionSlice } from './sesionSlice'
import { mensajeDeError } from '@/lib/errores'

// Mismas reglas que el backend (loginBodySchema)
const esquemaLogin = Yup.object({
  identificador: Yup.string()
    .required('El usuario o email es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(3, 'La contraseña debe tener al menos 3 caracteres')
    .max(30, 'La contraseña puede tener hasta 30 caracteres'),
})

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const haySesion = useSelector((state) => Boolean(state.sesionSlice.token))
  const [errorApi, setErrorApi] = useState('')

  const formik = useFormik({
    initialValues: {
      identificador: '',
      password: '',
    },

    validationSchema: esquemaLogin,

    onSubmit: async (valores) => {
      setErrorApi('')
      try {
        const { token, user } = await loginApi({
          identificador: valores.identificador.trim(),
          password: valores.password,
        })

        // Lanza error si el token no tiene formato JWT válido
        jwtDecode(token)

        localStorage.setItem('token', token)
        dispatch(iniciarSesionSlice(token))

        toast.success(`Bienvenido, ${user.username}`)
        navigate('/dashboard')
      } catch (error) {
        setErrorApi(mensajeDeError(error))
      }
    },
  })

  // Si ya hay sesión no tiene sentido mostrar el login
  if (haySesion) return <Navigate to="/dashboard" replace />

  return (
    <Card style={{ width: '22rem', maxWidth: '100%' }}>
      <Card.Body>
        <Card.Title className="mb-3">Iniciar sesión</Card.Title>

        {errorApi && <Alert variant="danger">{errorApi}</Alert>}

        <Form onSubmit={formik.handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="identificador">
            <Form.Label>Usuario o email</Form.Label>
            <Form.Control
              type="text"
              name="identificador"
              value={formik.values.identificador}
              placeholder="Ingresá tu usuario o email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.identificador &&
                Boolean(formik.errors.identificador)
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.identificador}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formik.values.password}
              placeholder="Ingresá tu contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.password && Boolean(formik.errors.password)
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Deshabilitado mientras haya campos vacíos o inválidos */}
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </Button>
        </Form>

        <p className="text-center mt-3 mb-0">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </Card.Body>
    </Card>
  )
}

export default Login
