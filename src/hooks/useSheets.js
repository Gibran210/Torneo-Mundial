import { useState, useEffect, useCallback, useRef } from 'react'
import { SHEET_URL, SHEET_READY } from '../constants'

// ── JSONP helper genérico ────────────────────────────────────
function jsonp(url, timeout = 12000) {
  return new Promise((resolve, reject) => {
    const cb    = `__gs_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const timer = setTimeout(() => {
      delete window[cb]
      reject(new Error('Timeout'))
    }, timeout)

    window[cb] = data => {
      clearTimeout(timer)
      delete window[cb]
      resolve(data)
    }

    const s   = document.createElement('script')
    s.src     = `${url}&callback=${cb}`
    s.onerror = () => {
      clearTimeout(timer)
      delete window[cb]
      reject(new Error('Script load error'))
    }
    document.head.appendChild(s)
    setTimeout(() => { try { s.remove() } catch (_) {} }, timeout + 3000)
  })
}

export function useSheets() {
  const [players,    setPlayers]    = useState([])
  const [loadStatus, setLoadStatus] = useState('idle')
  const [saveStatus, setSaveStatus] = useState('idle')

  const playersRef = useRef(players)
  useEffect(() => { playersRef.current = players }, [players])

  // ── Cargar jugadores ─────────────────────────────────────
  const load = useCallback(async () => {
    if (!SHEET_READY) {
      setLoadStatus('ok')
      return
    }
    setLoadStatus('loading')
    try {
      const data = await jsonp(`${SHEET_URL}?t=${Date.now()}`)
      if (data?.success && Array.isArray(data.players)) {
        setPlayers(data.players)
      }
      setLoadStatus('ok')
    } catch {
      setLoadStatus('error')
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Validar email duplicado ──────────────────────────────
  const isEmailTaken = useCallback((email) => {
    return playersRef.current.some(
      p => (p.email || '').toLowerCase() === email.toLowerCase()
    )
  }, [])

  // ── Guardar jugador vía JSONP ────────────────────────────
  const savePlayer = useCallback(async ({ name, email, depto, pos }) => {
    setSaveStatus('saving')
    try {
      if (SHEET_READY) {
        const params = new URLSearchParams({
          method: 'POST',
          name,
          email,
          depto: depto || '',
          pos1: pos[0] || '',
          pos2: pos[1] || '',
        })
        const data = await jsonp(`${SHEET_URL}?${params.toString()}`)
        if (!data?.success) {
          if (data?.error === 'EMAIL_DUPLICADO') {
            throw new Error('EMAIL_DUPLICADO')
          }
          throw new Error(data?.error || 'Error al guardar')
        }
      }

      const player = {
        name,
        email,
        depto,
        pos,
        number: playersRef.current.length + 1,
        fecha:  new Date().toLocaleString('es-MX'),
      }
      setPlayers(prev => [...prev, player])
      setSaveStatus('ok')
      setTimeout(() => setSaveStatus('idle'), 2000)
      return player

    } catch (err) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
      throw err
    }
  }, [])

  return {
    players,
    loadStatus,
    saveStatus,
    isEmailTaken,
    savePlayer,
    refresh: load,
  }
}
