import React from 'react'

export default function Header({ playerCount, onOpenPanel }) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-ball">⚽</div>
        <div className="logo-name">
          TORNEO <span>SICAR</span> 2026
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '100%'}}>
        {/* Logo imagen */}
        <img
          src="/logo/logo.png"
          alt="Logo"
          style={{ height: '120%', width: 'auto', objectFit: 'contain' }}
        />
      </div>
    </header>
  )
}