import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player'

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-eyebrow">⚽ SICAR · Torneo Oficial · 2026</div>
      <h1 className="hero-title">
        Inscripción
        <em>de Jugadores</em>
      </h1>
      <p className="hero-sub">Regístrate · Compite · Sé leyenda</p>

      {/* Animación Lottie */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
        <Player
          autoplay
          loop
          src="/logo/players.json"
          style={{ width: '280px', height: '280px' }}
        />
      </div>

      <div className="hero-deco-circle hero-deco-circle--lg" />
      <div className="hero-deco-circle hero-deco-circle--sm" />
    </div>
  )
}