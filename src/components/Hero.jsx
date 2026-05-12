import React from 'react'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-eyebrow">⚽ SICAR · Torneo Oficial · 2026</div>
      <h1 className="hero-title">
        Inscripción
        <em>de Jugadores</em>
      </h1>
      <p className="hero-sub">Regístrate · Compite · Sé leyenda</p>

      {/* Wrapper que fuerza el centrado sin importar el padre */}
      <div style={{ width: '60%', textAlign: 'center', marginTop: '28px' }}>
        <img
          src="/logo/logo.png"
          alt="Logo del torneo"
          className="hero-logo"
        />
      </div>

      <div className="hero-deco-circle hero-deco-circle--lg" />
      <div className="hero-deco-circle hero-deco-circle--sm" />
    </div>
  )
}