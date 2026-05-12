import React from 'react'

const BALLS = [6, 18, 30, 44, 56, 68, 80, 92]

export default function Background() {
  return (
    <>
      <div className="bg-gradient" />
      <div className="bg-grid" />

      <div className="orb" style={{
        width: 420, height: 420,
        background: 'radial-gradient(circle,rgba(0,200,83,.1),transparent 70%)',
        top: -100, left: -120, animationDuration: '7s',
      }} />
      <div className="orb" style={{
        width: 320, height: 320,
        background: 'radial-gradient(circle,rgba(0,150,255,.1),transparent 70%)',
        bottom: 40, right: -80, animationDuration: '9s', animationDelay: '-3s',
      }} />

      {BALLS.map((l, i) => (
        <div
          key={l}
          className="fball"
          style={{
            left:              `${l}%`,
            fontSize:           20 + (i % 3) * 8,
            animationDuration: `${12 + i * 2.5}s`,
            animationDelay:    `${i * -2.2}s`,
          }}
        >
          ⚽
        </div>
      ))}
    </>
  )
}
