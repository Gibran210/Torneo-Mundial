import React from 'react'

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function PlayersPanel({ open, players, loadStatus, onClose, onRefresh }) {
  return (
    <div
      className={`overlay${open ? ' open' : ''}`}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="ov-bg" onClick={onClose} />

      <div className="panel">
        {/* Panel header */}
        <div className="panel-top">
          <div className="panel-accent" />
          <button className="panel-close" onClick={onClose}>✕</button>
          <div className="panel-title">Inscritos</div>

          <button
            className={`panel-refresh${loadStatus === 'loading' ? ' spinning' : ''}`}
            onClick={onRefresh}
            disabled={loadStatus === 'loading'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Actualizar
          </button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {loadStatus === 'loading' && (
            <div className="panel-loading">
              <div className="panel-spinner" />
              <p>Cargando desde Google Sheets…</p>
            </div>
          )}

          {loadStatus !== 'loading' && players.length === 0 && (
            <div className="empty">
              <span className="empty-ico">⚽</span>
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.7 }}>
                Sin jugadores aún.<br />¡Sé el primero!
              </p>
            </div>
          )}

          {/* Player list — newest first */}
          {[...players].reverse().map((p, i) => (
            <PlayerCard key={p.email + i} player={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PlayerCard({ player }) {
  return (
    <div className="p-item">
      <div className="p-av">{initials(player.name)}</div>
      <div className="p-info">
        <div className="p-name">{player.name}</div>
        <div className="p-email">{player.email}</div>
        <div className="p-tags">
          {(player.pos || []).map((tag, i) => (
            <span key={i} className="p-tag">{tag}</span>
          ))}
        </div>
        {player.fecha && (
          <div className="p-date">📅 {player.fecha}</div>
        )}
      </div>
      <div className="p-num">#{String(player.number || '').padStart(2, '0')}</div>
    </div>
  )
}
