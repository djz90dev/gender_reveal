"use client"

import { useState } from "react"
import { usePredictions } from "@/lib/use-predictions" // <-- Cambio clave aquí
import { useRevealStatus } from "@/hooks/use-reveal-status"
import LandingView from "@/components/landing-view"
import VoteView from "@/components/vote-view"
import ResultsView from "@/components/results-view"
import RevealScreen from "@/components/reveal-screen"

export default function Page() {
  const { predictions, loading: predictionsLoading, addPrediction } = usePredictions()
  const { revealed, babyGender, loading: revealLoading, revealGender } = useRevealStatus()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentView, setCurrentView] = useState<"landing" | "vote" | "results">("landing")

  // Contraseña para activar el modo administrador. ¡Cámbiala por algo seguro!
  const ADMIN_PASSWORD = "bebedr";

  const handleAdminLogin = () => {
    const password = prompt("Introduce la contraseña de administrador:");
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      alert("Modo administrador activado.");
    } else if (password) {
      alert("Contraseña incorrecta.");
    }
  };

  if (predictionsLoading || revealLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (revealed && babyGender) {
    return <RevealScreen gender={babyGender} predictions={predictions} />
  }

  if (currentView === "landing") {
    return <LandingView onNavigate={setCurrentView} />
  }

  if (currentView === "vote") {
    return <VoteView onBack={() => setCurrentView("landing")} onAddPrediction={addPrediction} />
  }

  return (
    <ResultsView
      predictions={predictions}
      onBack={() => setCurrentView("landing")}
      onReveal={revealGender}
      revealed={revealed}
      isAdmin={isAdmin}
      onAdminLogin={handleAdminLogin}
    />
  )
}
