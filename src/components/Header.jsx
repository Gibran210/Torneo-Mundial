import { useNavigate, useLocation } from 'react-router-dom'

export default function Header({ playerCount, onOpenPanel }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-ball">⚽</div>
        <div className="logo-name">TORNEO <span>SICAR</span> 2026</div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>

        {/* Solo muestra el botón de la otra sección */}
        {pathname === '/fases' ? (
          <button className="panel-btn" onClick={() => navigate('/')}>
            🏳️ Equipos
          </button>
        ) : (
          <button className="panel-btn" onClick={() => navigate('/fases')}>
            🏆 Fases
          </button>
        )}

        <img src="/logo/logo.png" alt="Logo"
          style={{ height:52, width:'auto', objectFit:'contain' }} />

      </div>
    </header>
  )
}