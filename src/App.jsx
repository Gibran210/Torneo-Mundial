import React, { useState } from 'react'
import Background        from './components/Background'
import Header            from './components/Header'
import FlagsBar          from './components/FlagsBar'
import Hero              from './components/Hero'
import RegistrationForm  from './components/RegistrationForm'
import PlayersPanel      from './components/PlayersPanel'
import Toast             from './components/Toast'
import { useToast }      from './components/Toast'
import Confetti          from './components/Confetti'
import { useSheets }     from './hooks/useSheets'
import RegistrationClosed from './components/RegistrationClosed'
import { SHEET_READY, REGISTRATION_OPEN }   from './constants'

export default function App() {
  const { players, loadStatus, saveStatus, isEmailTaken, savePlayer, refresh } = useSheets()
  const { toast, showToast } = useToast()

  const [panelOpen,   setPanelOpen]   = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  const handleSuccess = () => {
    setConfettiKey(k => k + 1)
    showToast(SHEET_READY ? '¡Jugador inscrito al torneo! ✓' : '¡Jugador inscrito al torneo!')
  }

  return (
    <div className="page">
      <Background />
      <Confetti trigger={confettiKey} />
      <Toast {...toast} />

      {/* ── BARRA FIJA — siempre visible aunque haya scroll ── */}
      <div className="sticky-top">
        <Header
          playerCount={players.length}
          onOpenPanel={() => setPanelOpen(true)}
        />
        <FlagsBar />
      </div>

      {/* ── CONTENIDO SCROLLEABLE
            .page-content tiene padding-top igual a la altura
            de .sticky-top para que nada quede tapado ──────── */}
      <div className="page-content">
        <main className="principal">
  <Hero />
  {!REGISTRATION_OPEN ? (
    <RegistrationClosed total={players.length} max={players.length} />
  ) : (
    <RegistrationForm
      players={players}
      loadStatus={loadStatus}
      saveStatus={saveStatus}
      isEmailTaken={isEmailTaken}
      savePlayer={savePlayer}
      onSuccess={handleSuccess}
    />
  )}
</main>
      </div>

      {/* ── PANEL LATERAL ── */}
      <PlayersPanel
        open={panelOpen}
        players={players}
        loadStatus={loadStatus}
        onClose={() => setPanelOpen(false)}
        onRefresh={refresh}
      />
    </div>
  )
}
