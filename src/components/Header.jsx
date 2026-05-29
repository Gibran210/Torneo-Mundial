import { useNavigate, useLocation } from 'react-router-dom'

export default function Header({ playerCount, onOpenPanel }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isTeams  = location.pathname === '/equipos'

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-ball">⚽</div>
        <div className="logo-name">TORNEO <span>SICAR</span> 2026</div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Botón para alternar entre páginas */}
        <button
          className="panel-btn"
          onClick={() => navigate(isTeams ? '/' : '/equipos')}
        >
          {isTeams ? '📋 Inscripción' : '🏟️ Equipos'}
        </button>

        <img src="/logo/logo.png" alt="Logo"
          style={{ height:36, width:'auto', objectFit:'contain' }} />
      </div>
    </header>
  )
}