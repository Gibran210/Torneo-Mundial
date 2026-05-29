import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Background       from './components/Background'
import Header           from './components/Header'
import FlagsBar         from './components/FlagsBar'
import Hero             from './components/Hero'
import RegistrationForm from './components/RegistrationForm'
import RegistrationClosed from './components/RegistrationClosed'
import Teams            from './components/Teams'
import PlayersPanel     from './components/PlayersPanel'
import Toast            from './components/Toast'
import { useToast }     from './components/Toast'
import Confetti         from './components/Confetti'
import { useSheets }    from './hooks/useSheets'
import { SHEET_READY, REGISTRATION_OPEN } from './constants'

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

      {/* Barra fija siempre visible */}
      <div className="sticky-top">
        <Header
          playerCount={players.length}
          onOpenPanel={() => setPanelOpen(true)}
        />
        <FlagsBar />
      </div>

      {/* Rutas */}
      <div className="page-content">
        <Routes>

  {/* / — Equipos (página principal) */}
  <Route path="/" element={<Teams />} />

  {/* /inscripcion — Formulario */}
  <Route path="/inscripcion" element={
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
  } />

</Routes>
      </div>

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