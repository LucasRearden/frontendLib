import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { agregarLibroSlice } from './librosSlice'
import { crearLibroApi } from './librosServices'
import { obtenerCategoriasApi } from '@/features/categorias/categoriasServices'
import { borrarImagenApi } from './imagenesServices'
import SubirImagen from './SubirImagen'
import { mensajeDeError } from '@/lib/errores'

const esquema = Yup.object({
  titulo: Yup.string().trim().required('El título es obligatorio'),
  autor: Yup.string().trim().required('El autor es obligatorio'),
  categoria: Yup.string().required('Elegí una categoría'),
  sinopsis: Yup.string().trim(),
})

const AgregarLibro = ({ show, onHide }) => {
  const dispatch = useDispatch()
  const [categorias, setCategorias] = useState([])
  const [cargandoCat, setCargandoCat] = useState(false)
  const [errorCat, setErrorCat] = useState('')
  const [errorApi, setErrorApi] = useState('')
  // public_id de la imagen subida pero todavía no guardada con un libro
  const publicIdRef = useRef('')
  // Hay una imagen elegida pero sin subir
  const [imagenPendiente, setImagenPendiente] = useState(false)

  // Las categorías se piden al abrir el modal
  useEffect(() => {
    if (!show) return
    const controller = new AbortController()
    const cargar = async () => {
      try {
        setCargandoCat(true)
        setErrorCat('')
        const lista = await obtenerCategoriasApi(controller.signal)
        if (controller.signal.aborted) return
        setCategorias(lista)
      } catch (e) {
        if (e.code === 'ERR_CANCELED') return
        setErrorCat(mensajeDeError(e))
      } finally {
        if (!controller.signal.aborted) setCargandoCat(false)
      }
    }
    cargar()
    return () => controller.abort()
  }, [show])

  const cerrar = () => {
    setErrorApi('')
    // Si subió una imagen y canceló, la borramos de Cloudinary para no dejar huérfanas
    if (publicIdRef.current) {
      borrarImagenApi(publicIdRef.current).catch(() => {})
      publicIdRef.current = ''
    }
    onHide()
  }

  const crear = async (valores, { setSubmitting, resetForm }) => {
    const datos = {
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      categoria: valores.categoria, // id de la categoría
    }
    if (valores.sinopsis.trim()) datos.sinopsis = valores.sinopsis.trim()
    if (valores.portadaUrl) {
      datos.portadaUrl = valores.portadaUrl
      datos.portadaPublicId = valores.portadaPublicId
    }

    try {
      setErrorApi('')
      const nuevo = await crearLibroApi(datos)
      // El POST puede devolver la categoría como id: guardamos el objeto para la etiqueta
      const categoria = categorias.find((c) => c._id === valores.categoria)
      dispatch(agregarLibroSlice({ ...nuevo, categoria }))
      toast.success('Libro agregado')
      publicIdRef.current = '' // la imagen ya quedó asociada al libro
      resetForm()
      onHide()
    } catch (e) {
      setErrorApi(mensajeDeError(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={cerrar} centered>
      <Formik
        initialValues={{
          titulo: '',
          autor: '',
          categoria: '',
          sinopsis: '',
          portadaUrl: '',
          portadaPublicId: '',
        }}
        validationSchema={esquema}
        onSubmit={crear}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Header closeButton>
              <Modal.Title className="h5">Agregar libro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {errorApi && <Alert variant="danger">{errorApi}</Alert>}
              {errorCat && (
                <Alert variant="warning">
                  No se pudieron cargar las categorías: {errorCat}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  name="titulo"
                  value={values.titulo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.titulo && !!errors.titulo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.titulo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  name="autor"
                  value={values.autor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.autor && !!errors.autor}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.autor}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="categoria"
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={cargandoCat}
                  isInvalid={touched.categoria && !!errors.categoria}
                >
                  <option value="">
                    {cargandoCat ? 'Cargando...' : 'Elegí una categoría'}
                  </option>
                  {categorias.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoria}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Sinopsis <span className="text-muted">(opcional)</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="sinopsis"
                  value={values.sinopsis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <SubirImagen
                  resetKey={show}
                  onPendingChange={setImagenPendiente}
                  handleImgURL={(v) => setFieldValue('portadaUrl', v)}
                  handleImgPublicId={(v) => {
                    publicIdRef.current = v
                    setFieldValue('portadaPublicId', v)
                  }}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                onClick={cerrar}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              {imagenPendiente && (
                <span className="text-muted small me-auto">
                  Subí la imagen o quitala para continuar.
                </span>
              )}
              <Button
                type="submit"
                disabled={!dirty || !isValid || isSubmitting || imagenPendiente}
              >
                {isSubmitting ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  'Agregar'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AgregarLibro
