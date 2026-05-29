import React, { useState } from 'react'
import { createPortal } from 'react-dom'


// ── Datos de equipos ────────────────────────────────────────
const TEAMS = [
  { id:'mx-160', name:'México',     flag:'🇲🇽', color:'#006847', light:'#e8f5ee', text:'#004a30', bar:'linear-gradient(90deg,#006847,#00c853,#006847)', heroBg:'#006847' },
  { id:'br-160', name:'Brasil',     flag:'🇧🇷', color:'#FFDF00', light:'#fffde7', text:'#5c4400', bar:'linear-gradient(90deg,#FFDF00,#009C3B,#FFDF00)', heroBg:'#FFDF00' },
  { id:'es-160', name:'España',     flag:'🇪🇸', color:'#AA151B', light:'#fdeaea', text:'#7a0f13', bar:'linear-gradient(90deg,#AA151B,#F1BF00,#AA151B)', heroBg:'#AA151B' },
  { id:'gb-160', name:'Inglaterra', flag:'🇬🇧', color:'#012169', light:'#e8ebf6', text:'#010e40', bar:'linear-gradient(90deg,#C8102E,#fff,#C8102E)',    heroBg:'#ffffff' },
  { id:'de-160', name:'Alemania',   flag:'🇩🇪', color:'#333',    light:'#f2f2f2', text:'#111',    bar:'linear-gradient(90deg,#111,#FFCE00,#111)',        heroBg:'#222'    },
  { id:'fr-160', name:'Francia',    flag:'🇫🇷', color:'#0055A4', light:'#e8eef9', text:'#003570', bar:'linear-gradient(90deg,#0055A4,#EF4135,#0055A4)', heroBg:'#0055A4' },
]

// ── Jugadores por equipo — reemplaza con datos reales ───────
const PLAYERS = {
  'mx-160': [],
  'br-160': [],
  'es-160': [],
  'gb-160': [],
  'de-160': [],
  'fr-160': [],
}

const CONF_COLORS = ['#0057e7','#00c853','#f0c14b','#ffffff','#e53935']

function initials(n) {
  return n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// ── Camiseta SVG animada ─────────────────────────────────────
function Jersey({ teamId }) {
 const designs = {
  mx: { body:'#006847', stripe:'rgba(255,255,255,.25)', number:'#fff'    },
  br: { body:'#FFDF00', stripe:'rgba(0,156,59,.3)',     number:'#003087' },
  es: { body:'#AA151B', stripe:'rgba(241,191,0,.3)',    number:'#F1BF00' },
  gb: { body:'#ffffff', stripe:'rgba(200,16,46,.2)',    number:'#012169' },
  de: { body:'#111111', stripe:'rgba(255,206,0,.3)',    number:'#FFCE00' },
  fr: { body:'#0055A4', stripe:'rgba(255,255,255,.2)',  number:'#fff'    },
}

 const baseId = teamId.replace('-160', '')
  const d = designs[baseId]
  if (!d) return null

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '16px 0 8px',
      background: '#f4f7ff',
      borderBottom: '0.5px solid #eef2ff',
    }}>
      <svg
        viewBox="0 0 120 130"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 90, height: 'auto',
          animation: 'jerseyFloat 2.5s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.2))',
        }}
      >
        {/* Sombra */}
        <ellipse cx="60" cy="125" rx="34" ry="5" fill="rgba(0,0,0,.12)" />
{/* Manga izquierda — mismo color que el cuerpo */}
<path d="M15 30 L5 55 L28 58 L32 38 Z"
  fill={d.body} stroke="rgba(0,0,0,.08)" strokeWidth=".8" />

{/* Manga derecha — mismo color */}
<path d="M105 30 L115 55 L92 58 L88 38 Z"
  fill={d.body} stroke="rgba(0,0,0,.08)" strokeWidth=".8" />

{/* Cuerpo */}
<path d="M32 28 L88 28 L95 120 L25 120 Z"
  fill={d.body} stroke="rgba(0,0,0,.08)" strokeWidth=".8" />

{/* Franja sutil */}
<path d="M52 28 L68 28 L71 120 L49 120 Z" fill={d.stripe} />

{/* Cuello V — mismo color que el cuerpo */}
<path d="M44 28 L60 48 L76 28"
  fill="none" stroke={d.body} strokeWidth="5" strokeLinecap="round" />

{/* Número */}
<text x="60" y="90" textAnchor="middle"
  fontFamily="'Bebas Neue', sans-serif" fontSize="30"
  fill={d.number} opacity=".9">
  10
</text>
      </svg>
    </div>
  )
}

// ── Confetti ─────────────────────────────────────────────────
function Confetti() {
  return Array.from({ length: 18 }, (_, i) => (
    <div
      key={i}
      className="teams-confetti"
      style={{
        left:              `${Math.random() * 100}%`,
        width:              5 + Math.random() * 7,
        height:             5 + Math.random() * 7,
        background:         CONF_COLORS[i % CONF_COLORS.length],
        animationDuration: `${1 + Math.random()}s`,
        animationDelay:    `${Math.random() * 0.4}s`,
        borderRadius:       Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  ))
}

// ── Componente principal ─────────────────────────────────────
export default function Teams() {
  const [active,   setActive]   = useState(null)
  const [showConf, setShowConf] = useState(false)

  const team    = TEAMS.find(t => t.id === active)
  const players = active ? (PLAYERS[active] || []) : []

  const openModal = (id) => {
    setActive(id)
    const p = PLAYERS[id] || []
    if (p.length > 0) {
      setShowConf(true)
      setTimeout(() => setShowConf(false), 1800)
    }
  }

  const closeModal = () => setActive(null)

  const heroTextColor  = active === 'gb-160' ? '#012169' : '#fff'
  const heroSubColor   = active === 'gb-160' ? 'rgba(1,33,105,.6)' : 'rgba(255,255,255,.7)'
  const closeBtnColor  = active === 'gb-160' ? '#012169' : '#fff'
  const closeBtnBg     = active === 'gb-160' ? 'rgba(1,33,105,.1)' : 'rgba(255,255,255,.15)'

  return (
    <section className="teams-section">
      <div className="teams-eyebrow">⚽ Equipos Participantes</div>
      <p className="teams-sub">Haz clic en una bandera para ver los integrantes</p>

      {/* Grid de banderas */}
      <div className="teams-grid">
        {TEAMS.map((t, i) => {
          const count = (PLAYERS[t.id] || []).length
          return (
            <div
              key={t.id}
              className="teams-flag-btn"
              onClick={() => openModal(t.id)}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {count > 0 && <div className="teams-pulse" />}
              <img
                src={`/flags/${t.id}.png`}
                alt={t.name}
                className="teams-flag-emoji"
                onError={e => { e.target.style.display='none' }}
              />
              <span className="teams-flag-name">{t.name}</span>
              <span className="teams-flag-count">{count} jug.</span>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {active && team && createPortal(
  <div className="teams-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
    <div className="teams-modal">
      {showConf && <Confetti />}

      <div className="teams-modal-hero" style={{ background: team.heroBg }}>
        <div className="teams-modal-hero-pattern" />
        <img
          src={`/flags/${team.id.replace('-160','')}.png`}
          alt={team.name}
          style={{ width:48, height:'auto', borderRadius:4, position:'relative', zIndex:1, flexShrink:0 }}
          onError={e => { e.target.style.display='none' }}
        />
        <div style={{ flex:1, position:'relative', zIndex:1 }}>
          <div className="teams-modal-title" style={{ color: heroTextColor }}>{team.name}</div>
          <div className="teams-modal-sub" style={{ color: heroSubColor }}>
            {players.length} jugador{players.length !== 1 ? 'es' : ''} · Torneo SICAR 2026
          </div>
        </div>
        <button className="teams-modal-close" onClick={closeModal}
          style={{ color: closeBtnColor, background: closeBtnBg }}>
          ✕ cerrar
        </button>
      </div>

      <div className="teams-modal-bar" style={{ background: team.bar }} />
      <Jersey teamId={active} />

      <div className="teams-modal-body">
        {players.length === 0 ? (
          <div className="teams-empty">Sin jugadores asignados aún</div>
        ) : (
          players.map((p, i) => (
            <div key={i} className="teams-player-row" style={{ animationDelay:`${i*0.07}s` }}>
              <span className="teams-p-num">{i + 1}</span>
              <div className="teams-p-av" style={{ background:team.light, color:team.text }}>
                {initials(p.name)}
              </div>
              <div className="teams-p-info">
                <div className="teams-p-name">{p.name}</div>
                <div className="teams-p-meta">{p.depto}</div>
              </div>
              <span className="teams-p-pos" style={{ background:team.light, color:team.text }}>
                {(p.pos||[]).join(' · ')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>,
  document.body   // ← se renderiza directo en el body, fuera de cualquier contenedor
)}
    </section>
  )
}
