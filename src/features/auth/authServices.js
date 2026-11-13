import api from '@/lib/api'

// Responde { user, token }
export const loginApi = async (datosLogin) => {
  const resultado = await api.post('/auth/login', datosLogin)
  return resultado.data
}

// Responde { user, token }: el token permite dejar al usuario logueado al registrarse
export const registroApi = async (datosRegistro) => {
  const resultado = await api.post('/auth/register', datosRegistro)
  return resultado.data
}
