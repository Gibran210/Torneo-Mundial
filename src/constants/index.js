// ══════════════════════════════════════════════════
//  ⚙️  CONFIGURACIÓN — Pega tu URL de Apps Script
// ══════════════════════════════════════════════════
export const SHEET_URL = import.meta.env.VITE_SHEET_URL || ''

export const SHEET_READY = !!SHEET_URL && !SHEET_URL.includes('PEGA_TU')
export const REGISTRATION_OPEN = false 

// ── Datos estáticos ────────────────────────────────
export const FLAGS = [
  'br','ar','fr','de','es','pt','be','nl',
  'mx','us','jp','kr','ng','gh','sn','ma',
  'cr','uy','ch','pl','au','ec',
  'dk','ca'
]

export const CONFETTI_COLORS = [
  '#0057e7','#00c853','#f0c14b','#ffffff','#00b0ff','#003fa5',
]

export const ZONES = {
  md: { label: 'Medio / Delantero', sub: 'Ataque · Mediocampo', color: '#f0c14b', abbr: 'MD' },
  df: { label: 'Defensa',           sub: 'Zaguero · Lateral',   color: '#00b0ff', abbr: 'DF' },
  pt: { label: 'Portero',           sub: 'Guardameta',          color: '#00e676', abbr: 'PT' },
}
