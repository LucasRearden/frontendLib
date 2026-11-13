import api from '@/lib/api'

// El backend puede devolver `id` o `_id`: dejamos siempre `_id`
const normalizar = (libro) => ({ ...libro, _id: libro._id ?? libro.id })

export const obtenerMisLibrosApi = async (signal) => {
  const { data } = await api.get('/libros/mis-libros', { signal })
  const lista = Array.isArray(data) ? data : (data.libros ?? [])
  return lista.map(normalizar)
}

export const crearLibroApi = async (datos) => {
  const { data } = await api.post('/libros', datos)
  return normalizar(data.libro ?? data)
}

export const actualizarLibroApi = async (id, datos) => {
  const { data } = await api.patch(`/libros/${id}`, datos)
  return data
}

export const borrarLibroApi = async (id) => {
  await api.delete(`/libros/${id}`) // responde 204
}

export const obtenerCatalogoApi = async (params, signal) => {
  const { data } = await api.get('/libros', { params, signal })
  const lista = Array.isArray(data) ? data : (data.libros ?? [])
  return {
    libros: lista.map(normalizar),
    pagina: data.pagina ?? 1,
    total: data.total ?? lista.length,
    totalPaginas: data.totalPaginas ?? 1,
  }
}
