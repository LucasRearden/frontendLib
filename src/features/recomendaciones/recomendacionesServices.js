import api from '@/lib/api'

export const pedirRecomendacionesApi = async (libros) => {
  const { data } = await api.post('/recomendaciones', { libros })
  // El backend devuelve [{ titulo, descripcion }]
  return Array.isArray(data) ? data : (data.recomendaciones ?? [])
}
