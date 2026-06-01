import React, { useState, useEffect, useCallback } from 'react'
import { SHEET_URL, SHEET_READY } from '../constants'

const ADMIN_PASSWORD = 'sicar2026'

const AVAILABLE_TEAMS = [
  { id:'mx', nombre:'México',     bandera:'mx' },
  { id:'br', nombre:'Brasil',     bandera:'br' },
  { id:'es', nombre:'España',     bandera:'es' },
  { id:'gb', nombre:'Inglaterra', bandera:'gb' },
  { id:'de', nombre:'Alemania',   bandera:'de' },
  { id:'fr', nombre:'Francia',    bandera:'fr' },
]

const MATCH_DEFS = {
  GA1: { label:'Grupo A · P1', local:'A1', visitante:'A2', group:'A' },
  GA2: { label:'Grupo A · P2', local:'A1', visitante:'A3', group:'A' },
  GA3: { label:'Grupo A · P3', local:'A2', visitante:'A3', group:'A' },
  GB1: { label:'Grupo B · P1', local:'B1', visitante:'B2', group:'B' },
  GB2: { label:'Grupo B · P2', local:'B1', visitante:'B3', group:'B' },
  GB3: { label:'Grupo B · P3', local:'B2', visitante:'B3', group:'B' },
  SF1: { label:'Semifinal 1',  local:'1°A', visitante:'2°B', group:'SF' },
  SF2: { label:'Semifinal 2',  local:'2°A', visitante:'1°B', group:'SF' },
  FIN: { label:'Gran Final',   local:'SF1W', visitante:'SF2W', group:'FIN' },
}

const DEFAULT_SLOTS = {
  A1:{ nombre:'', bandera:'' }, A2:{ nombre:'', bandera:'' }, A3:{ nombre:'', bandera:'' },
  B1:{ nombre:'', bandera:'' }, B2:{ nombre:'', bandera:'' }, B3:{ nombre:'', bandera:'' },
}

const DEFAULT_PARTIDOS = Object.fromEntries(
  Object.keys(MATCH_DEFS).map(id => [id, {
    localScore:'', visitanteScore:'', penales:false, penalesGanador:'', status:'pending'
  }])
)

function FlagImg({ code, size = 24 }) {
  if (!code) return <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>🏳️</span>
  const id = code.replace('-160', '').toLowerCase()
  return (
    <img
      src={`/flags/${id}.png`}
      alt={id}
      style={{ width: size, height: 'auto', borderRadius: 3, objectFit: 'cover', verticalAlign: 'middle', flexShrink: 0 }}
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb    = `__t_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const timer = setTimeout(() => { delete window[cb]; reject(new Error('Timeout')) }, 12000)
    window[cb]  = data => { clearTimeout(timer); delete window[cb]; resolve(data) }
    const s     = document.createElement('script')
    s.src       = `${url}&callback=${cb}`
    s.onerror   = () => { clearTimeout(timer); delete window[cb]; reject(new Error('Error')) }
    document.head.appendChild(s)
    setTimeout(() => s.remove?.(), 15000)
  })
}

function calcPoints(slots, partidos) {
  const pts = { A1:0, A2:0, A3:0, B1:0, B2:0, B3:0 }
  const gf  = { A1:0, A2:0, A3:0, B1:0, B2:0, B3:0 }
  const gc  = { A1:0, A2:0, A3:0, B1:0, B2:0, B3:0 }
  ;['GA1','GA2','GA3','GB1','GB2','GB3'].forEach(id => {
    const m = partidos[id], d = MATCH_DEFS[id]
    if (!m || m.status === 'pending') return
    const ls = parseInt(m.localScore)||0, vs = parseInt(m.visitanteScore)||0
    const L = d.local, V = d.visitante
    gf[L]=(gf[L]||0)+ls; gc[L]=(gc[L]||0)+vs
    gf[V]=(gf[V]||0)+vs; gc[V]=(gc[V]||0)+ls
    if (m.penales) {
      if      (m.penalesGanador===L) { pts[L]+=2; pts[V]+=1 }
      else if (m.penalesGanador===V) { pts[V]+=2; pts[L]+=1 }
    } else {
      if      (ls>vs) pts[L]+=3
      else if (vs>ls) pts[V]+=3
      else            { pts[L]+=1; pts[V]+=1 }
    }
  })
  const sortGroup = keys => [...keys].sort((a,b) => {
    if (pts[b]!==pts[a]) return pts[b]-pts[a]
    return (gf[b]-gc[b])-(gf[a]-gc[a])
  })
  return { pts, gf, gc, groupA:sortGroup(['A1','A2','A3']), groupB:sortGroup(['B1','B2','B3']) }
}

function semiWinner(semiId, partidos) {
  const m = partidos[semiId]
  if (!m || m.status!=='done') return null
  const d=MATCH_DEFS[semiId], ls=parseInt(m.localScore)||0, vs=parseInt(m.visitanteScore)||0
  if (m.penales) return m.penalesGanador===d.local ? d.local : d.visitante
  return ls>=vs ? d.local : d.visitante
}

function PhaseLabel({ children }) {
  return (
    <div className="trn-phase-label">
      {children}<div className="trn-phase-line" />
    </div>
  )
}

function GroupCard({ group, slots, teamSlots, standings, editMode, onChangeSlot }) {
  const sorted   = group==='A' ? standings.groupA : standings.groupB
  const assigned = Object.values(teamSlots).map(s=>s.nombre).filter(Boolean)
  return (
    <div className="trn-group-card">
      <div className="trn-group-head">
        <div className="trn-group-badge" style={{ background: group==='A'?'#0057e7':'#00a550' }}>{group}</div>
        <div className="trn-group-name">Grupo {group}</div>
        <div className="trn-group-headers"><span>PTS</span></div>
      </div>
      <div className="trn-group-body">
        {slots.map((slot,i) => {
          const current=teamSlots[slot], pts=standings.pts[slot]||0, pos=sorted.indexOf(slot)
          return (
            <div key={slot} className={`trn-slot${pos===0?' first':pos===1?' second':''}`}>
              <span className="trn-slot-pos">{i+1}</span>
              {editMode ? (
                <div className="trn-slot-selector">
                  {current?.nombre && (
                    <button className="trn-clear-btn" onClick={()=>onChangeSlot(slot,'','')} title="Quitar">✕</button>
                  )}
                  <div className="trn-team-options">
                    {AVAILABLE_TEAMS.map(t => {
                      const isSelected=current?.nombre===t.nombre
                      const isTaken=assigned.includes(t.nombre)&&!isSelected
                      return (
                        <button key={t.id}
                          className={`trn-team-opt${isSelected?' selected':''}${isTaken?' taken':''}`}
                          onClick={()=>!isTaken&&onChangeSlot(slot,t.nombre,t.bandera)}
                          disabled={isTaken} title={isTaken?'Ya asignado':t.nombre}>
                          <FlagImg code={t.bandera} size={20} />
                        </button>
                      )
                    })}
                  </div>
                  <span className="trn-slot-selected-name">
                    {current?.nombre||<span style={{color:'rgba(255,255,255,.25)'}}>Sin asignar</span>}
                  </span>
                </div>
              ) : (
                <>
                  <span className="trn-slot-flag"><FlagImg code={current?.bandera} size={22}/></span>
                  <span className="trn-slot-name">{current?.nombre||slot}</span>
                </>
              )}
              <div className="trn-slot-stats"><span>{pts}</span></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MatchCard({ id, match, def, localName, visitanteName, localFlag, visitanteFlag, editMode, onChange }) {
  const m=match||{}
  const handleScore=(field,val)=>{
    const updated={...m,[field]:val}
    const status=(updated.localScore!==''&&updated.visitanteScore!=='')?'done':'pending'
    onChange(id,{...updated,status})
  }
  const statusMap={
    pending:{txt:'Por jugar',cls:'trn-status-pending'},
    live:{txt:'⬤ EN VIVO',cls:'trn-status-live'},
    done:{txt:'✓ Finalizado',cls:'trn-status-done'},
  }
  const sl=statusMap[m.status||'pending']
  return (
    <div className="trn-match-card">
      <div className="trn-match-label">{def.label}</div>
      <div className="trn-match-row">
        <div className="trn-match-team">
          <FlagImg code={localFlag} size={22}/>
          <span className="trn-match-name">{localName}</span>
        </div>
        <div className="trn-match-score">
          {editMode
            ? <input className="trn-score-input" value={m.localScore||''} onChange={e=>handleScore('localScore',e.target.value)} maxLength={2} placeholder="-"/>
            : <div className="trn-score-box">{m.localScore||'-'}</div>}
          <span className="trn-score-dash">:</span>
          {editMode
            ? <input className="trn-score-input" value={m.visitanteScore||''} onChange={e=>handleScore('visitanteScore',e.target.value)} maxLength={2} placeholder="-"/>
            : <div className="trn-score-box">{m.visitanteScore||'-'}</div>}
        </div>
        <div className="trn-match-team right">
          <span className="trn-match-name">{visitanteName}</span>
          <FlagImg code={visitanteFlag} size={22}/>
        </div>
      </div>
      {editMode && (
        <div className="trn-penales-row">
          <label className="trn-penales-label">
            <input type="checkbox" checked={!!m.penales}
              onChange={e=>onChange(id,{...m,penales:e.target.checked,penalesGanador:''})}/>
            Penales
          </label>
          {m.penales && (
            <div className="trn-penales-winner">
              <span>Ganador:</span>
              <button className={`trn-pw-team-btn${m.penalesGanador===def.local?' active':''}`}
                onClick={()=>onChange(id,{...m,penalesGanador:def.local})}>{localName}</button>
              <button className={`trn-pw-team-btn${m.penalesGanador===def.visitante?' active':''}`}
                onClick={()=>onChange(id,{...m,penalesGanador:def.visitante})}>{visitanteName}</button>
            </div>
          )}
        </div>
      )}
      {!editMode&&m.penales&&m.penalesGanador&&(
        <div className="trn-penales-badge">🥅 Penales — gana {m.penalesGanador===def.local?localName:visitanteName}</div>
      )}
      {editMode && (
        <div className="trn-status-row">
          {['pending','live','done'].map(s=>(
            <button key={s} className={`trn-status-btn${m.status===s?' active':''}`}
              onClick={()=>onChange(id,{...m,status:s})}>
              {s==='pending'?'Por jugar':s==='live'?'En vivo':'Finalizado'}
            </button>
          ))}
        </div>
      )}
      <div className={`trn-match-status ${sl.cls}`}>{sl.txt}</div>
    </div>
  )
}

function ElimCard({ id, match, def, localName, visitanteName, localFlag, visitanteFlag, editMode, onChange, isFinal }) {
  const m=match||{}
  const ls=parseInt(m.localScore||0), vs=parseInt(m.visitanteScore||0)
  const localWins    =m.status==='done'&&(m.penales?m.penalesGanador===def.local    :ls>vs)
  const visitanteWins=m.status==='done'&&(m.penales?m.penalesGanador===def.visitante:vs>ls)
  const handleScore=(field,val)=>{
    const updated={...m,[field]:val}
    const status=(updated.localScore!==''&&updated.visitanteScore!=='')?'done':'pending'
    onChange(id,{...updated,status})
  }
  return (
    <div className={`trn-elim-card${isFinal?' is-final':''}`}>
      {isFinal&&<div className="trn-final-accent"/>}
      <div className="trn-elim-tag">{isFinal?'🏆 ':''}{def.label}</div>
      <div className={`trn-elim-team${localWins?' winner':''}`}>
        <FlagImg code={localFlag} size={20}/>
        <span className="trn-elim-name">{localName}</span>
        <div className="trn-elim-score">
          {editMode
            ?<input className="trn-score-input sm" value={m.localScore||''} onChange={e=>handleScore('localScore',e.target.value)} maxLength={2} placeholder="-"/>
            :<div className="trn-score-box sm">{m.localScore||'-'}</div>}
        </div>
      </div>
      <div className="trn-elim-vs">VS</div>
      <div className={`trn-elim-team${visitanteWins?' winner':''}`}>
        <FlagImg code={visitanteFlag} size={20}/>
        <span className="trn-elim-name">{visitanteName}</span>
        <div className="trn-elim-score">
          {editMode
            ?<input className="trn-score-input sm" value={m.visitanteScore||''} onChange={e=>handleScore('visitanteScore',e.target.value)} maxLength={2} placeholder="-"/>
            :<div className="trn-score-box sm">{m.visitanteScore||'-'}</div>}
        </div>
      </div>
      {editMode&&(
        <div className="trn-penales-row">
          <label className="trn-penales-label">
            <input type="checkbox" checked={!!m.penales}
              onChange={e=>onChange(id,{...m,penales:e.target.checked,penalesGanador:''})}/>
            Penales
          </label>
          {m.penales&&(
            <div className="trn-penales-winner">
              <span>Ganador:</span>
              <button className={`trn-pw-team-btn${m.penalesGanador===def.local?' active':''}`}
                onClick={()=>onChange(id,{...m,penalesGanador:def.local})}>{localName}</button>
              <button className={`trn-pw-team-btn${m.penalesGanador===def.visitante?' active':''}`}
                onClick={()=>onChange(id,{...m,penalesGanador:def.visitante})}>{visitanteName}</button>
            </div>
          )}
        </div>
      )}
      {!editMode&&m.penales&&m.penalesGanador&&(
        <div className="trn-penales-badge">🥅 Penales — gana {m.penalesGanador===def.local?localName:visitanteName}</div>
      )}
      {editMode&&(
        <div className="trn-status-row">
          {['pending','live','done'].map(s=>(
            <button key={s} className={`trn-status-btn${m.status===s?' active':''}`}
              onClick={()=>onChange(id,{...m,status:s})}>
              {s==='pending'?'Por jugar':s==='live'?'En vivo':'Finalizado'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────
export default function Tournament() {
  const [slots,      setSlots]      = useState(DEFAULT_SLOTS)
  const [partidos,   setPartidos]   = useState(DEFAULT_PARTIDOS)
  const [editMode,   setEditMode]   = useState(false)
  const [pwModal,    setPwModal]    = useState(false)
  const [pwInput,    setPwInput]    = useState('')
  const [pwError,    setPwError]    = useState('')
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // 'ok' | 'error' | ''
  const [hasChanges, setHasChanges] = useState(false)

  const standings = calcPoints(slots, partidos)

  const n = useCallback((slotId) => {
    if (!slotId) return '?'
    if (slots[slotId]?.nombre) return slots[slotId].nombre
    const map = { '1°A':standings.groupA[0],'2°A':standings.groupA[1],'1°B':standings.groupB[0],'2°B':standings.groupB[1] }
    if (map[slotId]) return slots[map[slotId]]?.nombre||map[slotId]
    if (slotId==='SF1W') { const w=semiWinner('SF1',partidos); return w?(slots[w]?.nombre||w):'Gan. SF1' }
    if (slotId==='SF2W') { const w=semiWinner('SF2',partidos); return w?(slots[w]?.nombre||w):'Gan. SF2' }
    return slotId
  }, [slots, partidos, standings])

  const f = useCallback((slotId) => {
    if (!slotId) return ''
    if (slots[slotId]?.bandera) return slots[slotId].bandera
    const map = { '1°A':standings.groupA[0],'2°A':standings.groupA[1],'1°B':standings.groupB[0],'2°B':standings.groupB[1] }
    if (map[slotId]) return slots[map[slotId]]?.bandera||''
    if (slotId==='SF1W') { const w=semiWinner('SF1',partidos); return w?(slots[w]?.bandera||''):'' }
    if (slotId==='SF2W') { const w=semiWinner('SF2',partidos); return w?(slots[w]?.bandera||''):'' }
    return ''
  }, [slots, partidos, standings])

  // ── Cargar desde Sheets ──────────────────────────────────
  const load = useCallback(async () => {
    if (!SHEET_READY) { setLoading(false); return }
    setLoading(true)
    try {
      const data = await jsonp(`${SHEET_URL}?section=torneo&t=${Date.now()}`)
      if (data?.success) {
        if (data.slots)    setSlots(prev    => ({ ...prev, ...data.slots }))
        if (data.partidos) setPartidos(prev => ({ ...prev, ...data.partidos }))
      }
    } catch {}
    setLoading(false)
    setHasChanges(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── Cambios locales (sin guardar aún) ────────────────────
  const handleChangeSlot = (slot, nombre, bandera) => {
    setSlots(prev => ({ ...prev, [slot]: { nombre, bandera } }))
    setHasChanges(true)
    setSaveStatus('')
  }

  const handleChangePartido = (id, data) => {
    setPartidos(prev => ({ ...prev, [id]: { ...prev[id], ...data } }))
    setHasChanges(true)
    setSaveStatus('')
  }

const saveAll = async () => {
  if (!SHEET_READY) { setSaveStatus('ok'); setHasChanges(false); return }
  setSaving(true)
  setSaveStatus('')
  try {
    // Guardar slots uno por uno
    for (const [slot, val] of Object.entries(slots)) {
      const params = new URLSearchParams({
        method:'torneo', action:'updateSlot',
        slot, nombre: val.nombre||'', bandera: val.bandera||''
      })
      await jsonp(`${SHEET_URL}?${params}`)
    }

    // Guardar partidos uno por uno
    for (const [id, m] of Object.entries(partidos)) {
      const params = new URLSearchParams({
        method:'torneo', action:'updatePartido', id,
        localScore:     m.localScore     || '',
        visitanteScore: m.visitanteScore || '',
        penales:        m.penales        ? 'true' : 'false',
        penalesGanador: m.penalesGanador || '',
        status:         m.status         || 'pending',
      })
      await jsonp(`${SHEET_URL}?${params}`)
    }

    setSaveStatus('ok')
    setHasChanges(false)
  } catch (err) {
    console.error('Error al guardar:', err)
    setSaveStatus('error')
  }
  setSaving(false)
  setTimeout(() => setSaveStatus(''), 3000)
}

  // ── Password ─────────────────────────────────────────────
  const handlePwSubmit = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setEditMode(true); setPwModal(false); setPwInput(''); setPwError('')
    } else {
      setPwError('Contraseña incorrecta')
    }
  }

  // ── Loader ────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="trn-wrap">
        <div className="trn-eye">⚽ Torneo SICAR 2026</div>
        <h2 className="trn-title">Fases del Torneo</h2>
        <div className="trn-loader-wrap">
          <div className="trn-loader-ball">⚽</div>
          <div className="trn-loader-text">Cargando datos del torneo…</div>
          <div className="trn-loader-dots"><span /><span /><span /></div>
        </div>
      </section>
    )
  }

  return (
    <section className="trn-wrap">
      <div className="trn-eye">⚽ Torneo SICAR 2026</div>
      <h2 className="trn-title">Fases del Torneo</h2>
      <p className="trn-sub">Grupos · Partidos · Eliminatoria</p>

      {/* Botones de edición */}
      <div style={{ textAlign:'center', marginBottom:20, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
        {editMode ? (
          <>
            {/* Guardar */}
            <button
              className={`trn-save-btn${saving?' saving':''}`}
              onClick={saveAll}
              disabled={saving || !hasChanges}
            >
              {saving ? (
                <><span className="trn-save-spinner"/>Guardando…</>
              ) : saveStatus==='ok' ? (
                <>✅ Guardado</>
              ) : saveStatus==='error' ? (
                <>❌ Error al guardar</>
              ) : (
                <>{hasChanges ? '💾 Guardar cambios' : '💾 Sin cambios'}</>
              )}
            </button>

            {/* Salir */}
            <button className="trn-edit-btn active" onClick={() => {
              if (hasChanges && !window.confirm('¿Salir sin guardar los cambios?')) return
              setEditMode(false)
              setHasChanges(false)
              setSaveStatus('')
            }}>
              ✏️ Salir de edición
            </button>
          </>
        ) : (
          <button className="trn-edit-btn" onClick={() => setPwModal(true)}>
            🔒 Modo edición
          </button>
        )}
      </div>

      {/* Indicador de cambios pendientes */}
      {editMode && hasChanges && (
        <div className="trn-unsaved-banner">
          ⚠️ Tienes cambios sin guardar
        </div>
      )}

      {/* Modal contraseña */}
      {pwModal && (
        <div className="trn-overlay" onClick={e=>e.target===e.currentTarget&&setPwModal(false)}>
          <div className="trn-pw-modal">
            <div className="trn-pw-title">🔐 Acceso de Edición</div>
            <p className="trn-pw-sub">Ingresa la contraseña de administrador</p>
            <input
              className="trn-pw-input"
              type="password"
              placeholder="Contraseña"
              value={pwInput}
              autoFocus
              onChange={e=>{ setPwInput(e.target.value); setPwError('') }}
              onKeyDown={e=>e.key==='Enter'&&handlePwSubmit()}
            />
            {pwError && <div className="trn-pw-error">{pwError}</div>}
            <div className="trn-pw-btns">
              <button className="trn-pw-cancel"
                onClick={()=>{ setPwModal(false); setPwInput(''); setPwError('') }}>
                Cancelar
              </button>
              <button className="trn-pw-ok" onClick={handlePwSubmit}>Entrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Grupos */}
      <PhaseLabel>Fase de Grupos</PhaseLabel>
      <div className="trn-groups">
        {['A','B'].map(g => (
          <GroupCard
            key={g} group={g}
            slots={g==='A'?['A1','A2','A3']:['B1','B2','B3']}
            teamSlots={slots}
            standings={standings}
            editMode={editMode}
            onChangeSlot={handleChangeSlot}
          />
        ))}
      </div>

      {/* Partidos de grupo */}
      <PhaseLabel>Partidos de Grupo</PhaseLabel>
      <div className="trn-matches">
        {['GA1','GA2','GA3','GB1','GB2','GB3'].map(id => (
          <MatchCard
            key={id} id={id}
            match={partidos[id]}
            def={MATCH_DEFS[id]}
            localName={n(MATCH_DEFS[id].local)}
            visitanteName={n(MATCH_DEFS[id].visitante)}
            localFlag={f(MATCH_DEFS[id].local)}
            visitanteFlag={f(MATCH_DEFS[id].visitante)}
            editMode={editMode}
            onChange={handleChangePartido}
          />
        ))}
      </div>

      {/* Semifinales */}
      <PhaseLabel>Semifinales</PhaseLabel>
      <div className="trn-elim">
        {['SF1','SF2'].map(id => (
          <ElimCard
            key={id} id={id}
            match={partidos[id]}
            def={MATCH_DEFS[id]}
            localName={n(MATCH_DEFS[id].local)}
            visitanteName={n(MATCH_DEFS[id].visitante)}
            localFlag={f(MATCH_DEFS[id].local)}
            visitanteFlag={f(MATCH_DEFS[id].visitante)}
            editMode={editMode}
            onChange={handleChangePartido}
          />
        ))}
      </div>

      {/* Final */}
      <PhaseLabel>Gran Final</PhaseLabel>
      <div className="trn-final">
        <ElimCard
          id="FIN"
          match={partidos.FIN}
          def={MATCH_DEFS.FIN}
          localName={n('SF1W')}
          visitanteName={n('SF2W')}
          localFlag={f('SF1W')}
          visitanteFlag={f('SF2W')}
          editMode={editMode}
          onChange={handleChangePartido}
          isFinal
        />
      </div>
    </section>
  )
}
