"use client"

import { useState, useEffect } from "react"
import { usePredictions } from "@/hooks/use-predictions"
import LandingView from "@/components/landing-view"
import VoteView from "@/components/vote-view"
import ResultsView from "@/components/results-view"
import RevealScreen from "@/components/reveal-screen"

export default function Page() {
  const { predictions, loading, addPrediction } = usePredictions()
  const [revealed, setRevealed] = useState(false)
  const [babyGender, setBabyGender] = useState<"boy" | "girl" | null>(null)
  const [revealLoading, setRevealLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"landing" | "vote" | "results">("landing")

  useEffect(() => {
    const loadRevealStatus = async () => {
      try {
        const response = await fetch("/api/reveal")
        if (response.ok) {
          const data = await response.json()
          if (data.gender) {
            setRevealed(true)
            setBabyGender(data.gender)
          }
        }
      } catch (error) {
        console.error("Error loading reveal status:", error)
        const savedGender = localStorage.getItem("babyGender")
        if (savedGender) {
          setBabyGender(JSON.parse(savedGender))
          setRevealed(true)
        }
      } finally {
        setRevealLoading(false)
      }
    }

    loadRevealStatus()
    const interval = setInterval(loadRevealStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const revealGender = async (gender: "boy" | "girl") => {
    try {
      const response = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender }),
      })

      if (response.ok) {
        setBabyGender(gender)
        setRevealed(true)
        localStorage.setItem("babyGender", JSON.stringify(gender))
        localStorage.setItem("revealed", JSON.stringify(true))
      }
    } catch (error) {
      console.error("Error revealing gender:", error)
      setBabyGender(gender)
      setRevealed(true)
      localStorage.setItem("babyGender", JSON.stringify(gender))
      localStorage.setItem("revealed", JSON.stringify(true))
    }
  }

  if (loading || revealLoading) {
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
    />
  )
}
