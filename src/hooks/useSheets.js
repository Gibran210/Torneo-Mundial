const sendToSheet = useCallback((name, email, pos) => {
  return new Promise((resolve, reject) => {
    if (!SHEET_READY) { resolve(); return }

    const cb    = `__gs_post_${Date.now()}`
    const timer = setTimeout(() => {
      delete window[cb]
      reject(new Error('Timeout'))
    }, 12000)

    window[cb] = data => {
      clearTimeout(timer)
      delete window[cb]
      if (data?.success)                       resolve(data)
      else if (data?.error === 'EMAIL_DUPLICADO') reject(new Error('EMAIL_DUPLICADO'))
      else                                      reject(new Error(data?.error || 'Error'))
    }

    const params = new URLSearchParams({
      name,
      email,
      pos1:     pos[0] || '',
      pos2:     pos[1] || '',
      method:   'POST',
      callback: cb,
    })

    const s   = document.createElement('script')
    s.src     = `${SHEET_URL}?${params.toString()}`
    s.onerror = () => { clearTimeout(timer); delete window[cb]; reject(new Error('Script error')) }
    document.head.appendChild(s)
    setTimeout(() => s.remove?.(), 15000)
  })
}, [])