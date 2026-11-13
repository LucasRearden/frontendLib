// Convierte el error de axios en un mensaje para mostrar en pantalla.
// El backend responde { message } y, para errores de validación (Joi),
// { message, errors: [{ field, message }] }.
export const mensajeDeError = (error) => {
  const data = error.response?.data
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join('. ')
  }
  return data?.message ?? 'No se pudo conectar con el servidor'
}
