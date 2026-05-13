import React, { useState, useCallback } from 'react'
import FloatingInput from './FloatingInput'
import SoccerPitch from './SoccerPitch'
import PositionChips from './PositionChips'
import { SHEET_READY, ZONES } from '../constants'

const CornerSVG = ({ color1, color2 }) => (
  <svg viewBox="0 0 44 44">
    <path d="M2 22 L2 2 L22 2" fill="none" stroke={color1} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="2" cy="2" r="3" fill={color1} />
    <path d="M2 32 L2 44" fill="none" stroke={color2} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 2 L44 2" fill="none" stroke={color2} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function RegistrationForm({ players, loadStatus, saveStatus, isEmailTaken, savePlayer, onSuccess }) {
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [depto, setDepto] = useState('')
  const [positions,  setPositions]  = useState([])
  const [errors,     setErrors]     = useState({})
  const [posErr,     setPosErr]     = useState('')

  const isLoading = loadStatus === 'loading'
  const isSaving  = saveStatus === 'saving'

  // ── Toggle position ──────────────────────────────────────
  const togglePosition = useCallback(id => {
    setPositions(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id)
      if (prev.length >= 2) {
        setPosErr('Solo puedes elegir 2 posiciones')
        setTimeout(() => setPosErr(''), 2500)
        return prev
      }
      setPosErr('')
      return [...prev, id]
    })
  }, [])

  // ── Validate ─────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!name.trim())  errs.name  = 'El nombre es requerido'
    if (!email.trim()) {
      errs.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Formato de correo inválido'
    } else if (isEmailTaken(email)) {
      errs.email = '¡Este correo ya está registrado!'
    }
    if (!depto) errs.depto = 'Selecciona un departamento'
    if (positions.length !== 2) errs.pos = 'Selecciona exactamente 2 posiciones'
    return errs
  }

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate()
    if (errs.pos) setPosErr(errs.pos)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      const player = await savePlayer({
        name: name.trim(),
        email: email.trim(),
        depto,
        pos: positions.map(id => ZONES[id].label),
      })
      setName(''); setEmail(''); setDepto(''); setPositions([]); setErrors({}); setPosErr('')
      onSuccess(player)
    } catch (err) {
      if (err?.message === 'EMAIL_DUPLICADO') {
        setErrors(e => ({ ...e, email: '¡Este correo ya está registrado!' }))
        document.getElementById('ff-email')?.classList.add('err-state')
      }
    }
  }

  return (
    <div className="card-wrap">
      {/* Animated glow border */}
      <div className="card-glow" />

      {/* Corner ornaments */}
      <div className="corner tl"><CornerSVG color1="#00c853" color2="rgba(0,200,83,.25)" /></div>
      <div className="corner tr"><CornerSVG color1="#0057e7" color2="rgba(0,87,231,.25)" /></div>
      <div className="corner bl"><CornerSVG color1="#0057e7" color2="rgba(0,87,231,.25)" /></div>
      <div className="corner br"><CornerSVG color1="#00c853" color2="rgba(0,200,83,.25)" /></div>

      {/* Side streaks */}
      <div className="streak left" />
      <div className="streak right" />

      <div className="card">
        <div className="card-accent" />
        <div className="card-inner" style={{ position: 'relative' }}>

          {/* Form lock overlay while loading DB */}
          {isLoading && (
            <div className="form-lock">
              <div className="form-lock-spinner" />
              <div className="form-lock-txt">Verificando base de datos…</div>
            </div>
          )}

          {/* Card header */}
          <div className="card-head">
            <div className="step-ring">1</div>
            <div>
              <div className="card-head-label">Registro de Jugador</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div className="card-head-title">Completa tus datos</div>
                <DbStatusChip status={loadStatus} count={players.length} />
              </div>
            </div>
          </div>

          {/* Name */}
          <FloatingInput
            id="inp-name" label="Nombre completo"
            value={name} onChange={setName} onEnter={handleSubmit}
            error={errors.name}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            }
          />

          {/* Email */}
          <FloatingInput
            id="inp-email" label="Correo electrónico" type="email"
            value={email} onChange={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })) }}
            onEnter={handleSubmit} error={errors.email}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
          />

          {/* Departamento */}
<div className="f-group">
  <div className={`f-field${errors.depto ? ' err-state' : ''}`}>
    <div className="f-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    </div>
    <div className="f-label-wrap">
      <label className={`f-label${depto ? ' up' : ''}`}>Departamento</label>
      <select
        className="f-inp f-select"
        value={depto}
        onChange={e => { setDepto(e.target.value); setErrors(er => ({ ...er, depto: '' })) }}
      >
        <option value="" disabled hidden></option>
        <option value="Desarrollo">Desarrollo</option>
        <option value="Soporte">Soporte</option>
        <option value="Ventas">Ventas</option>
        <option value="Logística">Logística</option>
      </select>
    </div>
  </div>
  {errors.depto && (
    <div className="f-err">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {errors.depto}
    </div>
  )}
</div>

          {/* Position divider */}
          <div className="divider">
            <div className="line" />
            <div className="txt">Posición en campo — elige 2</div>
            <div className="line" />
          </div>

          {/* Pitch + Chips */}
          <div className="pos-layout">
            <SoccerPitch selected={positions} onToggle={togglePosition} />
            <PositionChips
              selected={positions}
              onToggle={togglePosition}
              error={posErr || errors.pos}
            />
          </div>

          {/* Submit button */}
          <div className="btn-wrap">
            <div className="btn-glow" />
            <button
              className={`btn-sub${isSaving ? ' loading' : ''}`}
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
            >
              <div className="btn-body">
                <div className="btn-wave" />
                <div className="btn-wave2" />
                <div className="btn-shimmer" />
                {[
                  { l: '12%', c: '#00e676', d: '0s',   dur: '2.2s' },
                  { l: '30%', c: '#fff',    d: '-.6s',  dur: '1.8s' },
                  { l: '60%', c: '#00b0ff', d: '-.3s',  dur: '2.5s' },
                  { l: '80%', c: '#00e676', d: '-1s',   dur: '2s'   },
                ].map((p, i) => (
                  <div key={i} className="btn-particle"
                    style={{ left: p.l, background: p.c, animationDelay: p.d, animationDuration: p.dur }}
                  />
                ))}
                {isSaving ? (
                  <div className="btn-spinner" />
                ) : (
                  <>
                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                    </svg>
                    <span className="btn-label">Inscribir al Torneo</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DB status chip ───────────────────────────────────────────
function DbStatusChip({ status, count }) {
  const map = {
    loading: { cls: 'loading', txt: 'Sincronizando…' },
    ok:      { cls: 'ok',      txt: `${count} inscritos` },
    error:   { cls: 'error',   txt: 'Sin conexión' },
    idle:    { cls: 'loading', txt: 'Iniciando…' },
  }
  const { cls, txt } = map[status] ?? map.idle
  return (
    <span className={`db-status ${cls}`}>
      <span className="db-dot" />{txt}
    </span>
  )
}
