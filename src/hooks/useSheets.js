import { useState, useEffect, useCallback } from 'react'
import { SHEET_URL, SHEET_READY } from '../constants'

/**
 * Hook que gestiona toda la integración con Google Sheets:
 *  - Carga automática al montar
 *  - Caché local de jugadores
 *  - Validación de correo duplicado
 *  - Guardar nuevo jugador
 *  - Refrescar manualmente
 */
export function useSheets() {
  const [players,     setPlayers]     = useState([])
  const [loadStatus,  setLoadStatus]  = useState('idle')   // 'idle' | 'loading' | 'ok' | 'error'
  const [saveStatus,  setSaveStatus]  = useState('idle')   // 'idle' | 'saving' | 'ok' | 'error'

  // ── Fetch desde Google Sheets (JSONP → Promise) ─────────
  const fetchFromSheet = useCallback(() => {
    return new Promise(resolve => {
      if (!SHEET_READY) { resolve([]); return }

      const cb    = `__gs_${Date.now()}`
      const timer = setTimeout(() => {
        if (window[cb]) { delete window[cb]; resolve([]) }
      }, 12000)

      window[cb] = data => {
        clearTimeout(timer)
        delete window[cb]
        resolve(data?.success && Array.isArray(data.players) ? data.players : [])
      }

      const s    = document.createElement('script')
      s.src      = `${SHEET_URL}?callback=${cb}&t=${Date.now()}`
      s.onerror  = () => { clearTimeout(timer); delete window[cb]; resolve([]) }
      document.head.appendChild(s)
      setTimeout(() => s.remove?.(), 16000)
    })
  }, [])

  // ── Carga automática al montar ────────────────────────────
  const load = useCallback(async () => {
    setLoadStatus('loading')
    try {
      const list = await fetchFromSheet()
      setPlayers(list)
      setLoadStatus('ok')
    } catch {
      setLoadStatus('error')
    }
  }, [fetchFromSheet])

  useEffect(() => { load() }, [load])

  // ── Validar correo duplicado ──────────────────────────────
  const isEmailTaken = useCallback(
    email => players.some(p => p.email?.toLowerCase() === email.toLowerCase()),
    [players]
  )

  // ── Guardar nuevo jugador ─────────────────────────────────
  const savePlayer = useCallback(async ({ name, email, pos }) => {
    setSaveStatus('saving')
    try {
      if (SHEET_READY) {
        const params = new URLSearchParams({ name, email, pos1: pos[0] ?? '', pos2: pos[1] ?? '' })
        await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: params })
      }
      const player = {
        name,
        email,
        pos,
        number: players.length + 1,
        fecha:  new Date().toLocaleString('es-MX'),
      }
      setPlayers(prev => [...prev, player])
      setSaveStatus('ok')
      return player
    } catch {
      setSaveStatus('error')
      throw new Error('No se pudo guardar')
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }, [players])

  return {
    players,
    loadStatus,
    saveStatus,
    isEmailTaken,
    savePlayer,
    refresh: load,
  }
}
