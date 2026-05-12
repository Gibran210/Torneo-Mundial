import React from 'react'
import { ZONES } from '../constants'

const ICONS = {
  md: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l3 3"/><path d="M7 14l5-2 5 2"/><path d="M9 20l3-4 3 4"/></svg>
  ),
  df: (
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  pt: (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
  ),
}

export default function PositionChips({ selected, onToggle, error }) {
  return (
    <div>
      <div className="chips">
        {Object.entries(ZONES).map(([id, cfg]) => (
          <div
            key={id}
            className={`chip${selected.includes(id) ? ' on' : ''}`}
            onClick={() => onToggle(id)}
          >
            <div className="chip-ico">{ICONS[id]}</div>
            <div>
              <div className="chip-name">{cfg.label}</div>
              <div className="chip-sub">{cfg.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`pos-hint ${selected.length === 2 ? 'ok' : 'warn'}`}>
        {selected.length} / 2 seleccionadas
      </div>

      {error && <div className="f-err2">{error}</div>}
    </div>
  )
}
