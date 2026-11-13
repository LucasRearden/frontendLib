import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { actualizarLibroSlice, borrarLibroSlice } from './librosSlice'
import { actualizarLibroApi, borrarLibroApi } from './librosServices'
import { borrarImagenApi } from './imagenesServices'
import { mensajeDeError } from '@/lib/errores'
import Portada from './Portada'
import SubirImagen from './SubirImagen'

const Libro = ({ libro }) => {
  const dispatch = useDispatch()
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(libro.titulo)
  const [autor, setAutor] = useState(libro.autor)
  const [sinopsis, setSinopsis] = useState(libro.sinopsis ?? '')
  const [guardando, setGuardando] = useState(false)
  // Foto nueva ya subida a Cloudinary, todavía sin guardar en el libro
  // (ref: solo se lee al guardar/cancelar, no se muestra en pantalla)
  const nuevaUrl = useRef('')
  const nuevaPublicId = useRef('')
  const setNuevaUrl = (v) => (nuevaUrl.current = v)
  const setNuevaPublicId = (v) => (nuevaPublicId.current = v)
  const [imagenPendiente, setImagenPendiente] = useState(false)

  const invalido = !titulo.trim() || !autor.trim()

  const cancelar = () => {
    // Si subió una foto nueva y canceló, la borramos para no dejarla huérfana
    if (nuevaPublicId.current) {
      borrarImagenApi(nuevaPublicId.current).catch(() => {})
    }
    setNuevaUrl('')
    setNuevaPublicId('')
    setTitulo(libro.titulo)
    setAutor(libro.autor)
    setSinopsis(libro.sinopsis ?? '')
    setEditando(false)
  }

  const guardar = async () => {
    const cambios = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      sinopsis: sinopsis.trim(),
    }
    const urlNueva = nuevaUrl.current
    if (urlNueva) {
      cambios.portadaUrl = urlNueva
      cambios.portadaPublicId = nuevaPublicId.current
    }

    try {
      setGuardando(true)
      await actualizarLibroApi(libro._id, cambios)
      // El PATCH devuelve el libro sin populate: solo fusionamos lo editado
      dispatch(actualizarLibroSlice({ id: libro._id, cambios }))

      // La foto anterior ya no se usa: se borra de Cloudinary (sin romper si falla)
      if (urlNueva && libro.portadaPublicId) {
        borrarImagenApi(libro.portadaPublicId).catch(() => {})
      }
      setNuevaUrl('')
      setNuevaPublicId('')
      setEditando(false)
      toast.success('Libro actualizado')
    } catch (e) {
      toast.error(mensajeDeError(e))
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async () => {
    if (!window.confirm(`¿Eliminar "${libro.titulo}"?`)) return
    try {
      await borrarLibroApi(libro._id)
      dispatch(borrarLibroSlice(libro._id))
      toast.success('Libro eliminado')
    } catch (e) {
      toast.error(mensajeDeError(e))
    }
  }

  return (
    <div className="libro-tile">
      <Portada libro={libro} />

      {editando ? (
        <div className="d-flex flex-column gap-2">
          <Form.Control
            size="sm"
            value={titulo}
            isInvalid={!titulo.trim()}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />
          <Form.Control
            size="sm"
            value={autor}
            isInvalid={!autor.trim()}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Autor"
          />
          <Form.Control
            size="sm"
            as="textarea"
            rows={3}
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            placeholder="Sinopsis"
          />

          <SubirImagen
            resetKey={editando}
            titulo="Cambiar portada"
            ayuda="Si no querés cambiarla, dejalo así y guardá."
            onPendingChange={setImagenPendiente}
            handleImgURL={setNuevaUrl}
            handleImgPublicId={setNuevaPublicId}
          />

          <div className="d-flex align-items-center gap-2">
            <Button
              size="sm"
              onClick={guardar}
              disabled={invalido || guardando || imagenPendiente}
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
            {imagenPendiente && (
              <span className="text-muted small">Subí o quitá la imagen.</span>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="libro-titulo">{libro.titulo}</h3>
            <p className="libro-autor">{libro.autor}</p>
            {libro.categoria?.nombre && (
              <span className="etiqueta">{libro.categoria.nombre}</span>
            )}
            {libro.sinopsis && (
              <p className="libro-sinopsis texto-clamp">{libro.sinopsis}</p>
            )}
          </div>
          <div className="libro-acciones">
            <button
              type="button"
              className="btn-texto"
              onClick={() => setEditando(true)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn-texto peligro"
              onClick={borrar}
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Libro
