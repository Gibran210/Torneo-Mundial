import React from 'react'
import { ZONES } from '../constants'

export default function SoccerPitch({ selected, onToggle }) {
  const zones = [
    { id: 'md', y: 5,   h: 91,  dotY: 30,  label: 'MEDIO / DELANTERO' },
    { id: 'df', y: 96,  h: 72,  dotY: 128, label: 'DEFENSA' },
    { id: 'pt', y: 168, h: 38,  dotY: 183, label: 'PORTERO' },
  ]

  return (
    <svg
      className="pitch-svg"
      viewBox="0 0 154 212"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Field base */}
      <rect x="4" y="4" width="146" height="204" rx="8" fill="#1a6b35" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />

      {/* Grass stripes */}
      {[5, 60, 115, 170].map(y => (
        <rect key={y} x="5" y={y} width="144" height="27" fill="rgba(255,255,255,.04)" />
      ))}

      {/* Goals */}
      <rect x="51" y="4"   width="52" height="10" rx="3" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
      <rect x="51" y="198" width="52" height="10" rx="3" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />

      {/* Penalty areas */}
      <rect x="22" y="4"   width="110" height="34" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1" />
      <rect x="22" y="174" width="110" height="34" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1" />
      <rect x="40" y="4"   width="74"  height="16" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />
      <rect x="40" y="192" width="74"  height="16" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />

      {/* Centre */}
      <line x1="5" y1="106" x2="149" y2="106" stroke="rgba(255,255,255,.38)" strokeWidth="1" />
      <circle cx="77" cy="106" r="22" fill="none" stroke="rgba(255,255,255,.33)" strokeWidth="1" />
      <circle cx="77" cy="106" r="2.5" fill="rgba(255,255,255,.6)" />
      <circle cx="77" cy="32"  r="2"   fill="rgba(255,255,255,.5)" />
      <circle cx="77" cy="176" r="2"   fill="rgba(255,255,255,.5)" />

      {/* Zone dividers */}
      <line x1="5" y1="96"  x2="149" y2="96"  stroke="rgba(255,255,255,.32)" strokeWidth="1" strokeDasharray="5,4" />
      <line x1="5" y1="168" x2="149" y2="168" stroke="rgba(255,255,255,.32)" strokeWidth="1" strokeDasharray="5,4" />

      {/* Clickable zones */}
      {zones.map(({ id, y, h, dotY, label }) => {
        const active = selected.includes(id)
        const cfg    = ZONES[id]

        return (
          <g key={id} onClick={() => onToggle(id)} style={{ cursor: 'pointer' }}>
            <rect
              x="5" y={y} width="144" height={h}
              fill={cfg.color}
              fillOpacity={active ? 0.4 : 0}
              rx={id === 'md' || id === 'pt' ? 5 : 0}
              style={{ transition: 'fill-opacity .25s' }}
            />
            <text
              x="77" y={y + h / 2 + 4}
              textAnchor="middle"
              fontFamily="'Rajdhani',sans-serif"
              fontSize="9"
              fontWeight="700"
              letterSpacing="1.5"
              fill={active ? '#fff' : 'rgba(255,255,255,.6)'}
              style={{ transition: 'fill .2s' }}
            >
              {label}
            </text>

            {active && (
              <g>
                <circle cx="77" cy={dotY} r="14" fill={cfg.color} filter="url(#glow2)" />
                <circle cx="77" cy={dotY} r="9"  fill="#fff" />
                <text
                  x="77" y={dotY + 4}
                  textAnchor="middle"
                  fontFamily="'Bebas Neue',sans-serif"
                  fontSize="9"
                  fill="#001b6e"
                >
                  {cfg.abbr}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
