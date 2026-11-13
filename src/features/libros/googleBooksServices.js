import api from '@/lib/api'

export const buscarGoogleBooksApi = async (titulo, signal) => {
  const { data } = await api.get('/google-books', {
    params: { q: titulo },
    signal,
  })
  if (Array.isArray(data)) return data
  return data?.resultados ?? data?.libros ?? data?.items ?? []
}
