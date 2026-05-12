import React from 'react'
import { FLAGS } from '../constants'

export default function FlagsBar() {
  // Duplicamos el array para el efecto de marquee continuo
  const doubled = [...FLAGS, ...FLAGS]

  return (
    <div className="flags-bar">
      <div className="flags-track">
        {doubled.map((code, i) => (
          <img
            key={i}
            src={`/flags/${code}.png`}
            alt={code.toUpperCase()}
            className="flag-img"
          />
        ))}
      </div>
    </div>
  )
}