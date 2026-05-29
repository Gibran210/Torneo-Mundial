import { useNavigate, useLocation } from 'react-router-dom'

export default function Header({ playerCount, onOpenPanel }) {
  const navigate = useNavigate()
  const location = useLocation()
const isTeams = location.pathname === '/'

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-ball">⚽</div>
        <div className="logo-name">TORNEO <span>SICAR</span> 2026</div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <img src="/logo/logo.png" alt="Logo"
          style={{ height:50, width:'auto', objectFit:'contain' }} />
      </div>
    </header>
  )
}