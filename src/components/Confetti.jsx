import React, { useEffect, useState } from 'react'
import { CONFETTI_COLORS } from '../constants'

export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id:       Date.now() + i,
      left:     Math.random() * 100,
      color:    CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: 1.7 + Math.random() * 1.5,
      delay:    Math.random() * 0.7,
      size:     5 + Math.random() * 8,
      round:    Math.random() > 0.5,
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 4000)
    return () => clearTimeout(t)
  }, [trigger])

  return pieces.map(p => (
    <div
      key={p.id}
      className="cf"
      style={{
        left:              `${p.left}%`,
        background:         p.color,
        width:              p.size,
        height:             p.size,
        borderRadius:       p.round ? '50%' : '3px',
        animationDuration: `${p.duration}s`,
        animationDelay:    `${p.delay}s`,
      }}
    />
  ))
}
