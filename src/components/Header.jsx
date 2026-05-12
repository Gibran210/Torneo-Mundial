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
    </header>
  )
}
