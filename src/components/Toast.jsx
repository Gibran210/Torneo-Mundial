import React, { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', visible }) {
  return (
    <div className={`toast${visible ? ' show' : ''}${type === 'error' ? ' error' : ''}`}>
      <span>{type === 'error' ? '❌' : '🏆'}</span>
      {message}
    </div>
  )
}

/** Hook to manage toast state */
export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  const show = (message, type = 'success') => {
    setToast({ visible: true, message, type })
  }

  useEffect(() => {
    if (!toast.visible) return
    const t = setTimeout(() => setToast(s => ({ ...s, visible: false })), 3500)
    return () => clearTimeout(t)
  }, [toast.visible, toast.message])

  return { toast, showToast: show }
}
