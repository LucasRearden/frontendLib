import { Link } from 'react-router-dom'
import { ProgressBar } from 'react-bootstrap'

const LIMITE_PLUS = 4

const UsoPlan = ({ cantidad, plan }) => {
  if (plan === 'premium') {
    return (
      <div className="card uso-card">
        <h2 className="h5 mb-3">Uso del plan</h2>
        <p className="uso-numero">{cantidad}</p>
        <p className="mb-1">
          {cantidad === 1 ? 'libro cargado' : 'libros cargados'}
        </p>
        <p className="text-muted small mb-0">
          Con el plan premium no tenés límite de libros.
        </p>
      </div>
    )
  }

  const porcentaje = Math.min(100, Math.round((cantidad / LIMITE_PLUS) * 100))
  const restantes = Math.max(0, LIMITE_PLUS - cantidad)

  return (
    <div className="card uso-card">
      <h2 className="h5 mb-3">Uso del plan</h2>
      <p className="uso-numero">{porcentaje}%</p>
      <p className="mb-2">
        {cantidad} de {LIMITE_PLUS} libros usados
      </p>
      <ProgressBar
        now={porcentaje}
        aria-label={`${porcentaje}% del límite usado`}
      />
      <p className="text-muted small mt-3 mb-0">
        {restantes === 0 ? (
          <>
            Llegaste al límite del plan plus.{' '}
            <Link to="/dashboard/plan">Pasá a premium</Link> para seguir
            cargando.
          </>
        ) : (
          <>
            Te{' '}
            {restantes === 1
              ? 'queda 1 libro disponible'
              : `quedan ${restantes} libros disponibles`}
            .
          </>
        )}
      </p>
    </div>
  )
}

export default UsoPlan
