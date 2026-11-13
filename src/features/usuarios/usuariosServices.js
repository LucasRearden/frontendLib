import api from '@/lib/api'

const normalizar = (u) => ({ ...u, _id: u._id ?? u.id })

export const obtenerUsuariosApi = async (signal) => {
  const { data } = await api.get('/usuarios', { signal })
  const lista = Array.isArray(data) ? data : (data.usuarios ?? [])
  return lista.map(normalizar)
}

// Pasa al usuario autenticado a premium. El backend responde { user, token }
export const cambiarPlanApi = async () => {
  const { data } = await api.put('/usuarios/plan')
  return data
}
