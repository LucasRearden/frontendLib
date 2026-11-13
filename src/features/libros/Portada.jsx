// Tono estable según el título: cada libro sin foto tiene su propio color apagado
const tono = (texto = '') => {
  let h = 0
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}

const Portada = ({ libro }) => (
  <div className="portada">
    {libro.portadaUrl ? (
      <img
        src={libro.portadaUrl}
        alt={`Portada de ${libro.titulo}`}
        loading="lazy"
      />
    ) : (
      <div
        className="portada-vacia"
        style={{ background: `hsl(${tono(libro.titulo)} 26% 34%)` }}
      >
        <span className="portada-titulo">{libro.titulo}</span>
      </div>
    )}
  </div>
)

export default Portada
