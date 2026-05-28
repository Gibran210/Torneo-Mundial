import React from 'react'

export default function RegistrationClosed({ total, max }) {
  return (
    <div className="closed-wrap">
      <div className="closed-card">
        <div className="closed-accent" />

        <div className="closed-icon">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 className="closed-title">Inscripciones Cerradas</h2>
        <p className="closed-sub">
          Se ha alcanzado el límite de jugadores para este torneo.
        </p>

        <div className="closed-counter">
          <div className="closed-counter-item">
            <span className="closed-counter-num">{total}</span>
            <span className="closed-counter-lbl">Inscritos</span>
          </div>
          
        </div>

        <p className="closed-footer">
          ⚽ Torneo SICAR 2026 · Gracias por tu interés
        </p>
      </div>
    </div>
  )
}