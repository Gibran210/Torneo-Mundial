import React, { useState } from 'react'

export default function FloatingInput({
  id, label, type = 'text', value, onChange, onEnter, error, icon,
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  return (
    <div className="f-group">
      <div className={`f-field${error ? ' err-state' : ''}`}>
        {/* Icon */}
        <div className="f-icon">{icon}</div>

        {/* Label + Input wrapper */}
        <div className="f-label-wrap">
          <label htmlFor={id} className={`f-label${lifted ? ' up' : ''}`}>
            {label}
          </label>
          <input
            id={id}
            type={type}
            autoComplete="off"
            className="f-inp"
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onEnter?.()}
          />
        </div>

        {/* Scan line */}
        <div className="f-scan" />
      </div>

      {/* Error message */}
      {error && (
        <div className="f-err">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8"  x2="12"    y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}
