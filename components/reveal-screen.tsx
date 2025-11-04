"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Prediction {
  id: string
  name: string
  prediction: "boy" | "girl"
  timestamp: number
}

interface RevealScreenProps {
  gender: "boy" | "girl"
  predictions: Prediction[]
}

export default function RevealScreen({ gender, predictions }: RevealScreenProps) {
  const [confetti, setConfetti] = useState(true)
  const [showStats, setShowStats] = useState(false)

  const stats = {
    correct: predictions.filter((p) => p.prediction === gender).length,
    total: predictions.length,
  }

  useEffect(() => {
    // Crear confetti
    const createConfetti = () => {
      const colors = gender === "boy" ? ["#3b82f6", "#60a5fa"] : ["#ec4899", "#f472b6"]
      for (let i = 0; i < 50; i++) {
        const confettiPiece = document.createElement("div")
        confettiPiece.style.position = "fixed"
        confettiPiece.style.left = Math.random() * 100 + "%"
        confettiPiece.style.top = "-10px"
        confettiPiece.style.width = "10px"
        confettiPiece.style.height = "10px"
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confettiPiece.style.borderRadius = "50%"
        confettiPiece.style.pointerEvents = "none"
        confettiPiece.style.animation = `fall ${2 + Math.random() * 1}s linear`

        document.body.appendChild(confettiPiece)

        setTimeout(() => confettiPiece.remove(), 3000)
      }
    }

    const style = document.createElement("style")
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    if (confetti) {
      const interval = setInterval(createConfetti, 300)
      return () => clearInterval(interval)
    }
  }, [confetti, gender])

  const handleReset = () => {
    localStorage.removeItem("predictions")
    localStorage.removeItem("revealed")
    localStorage.removeItem("babyGender")
    window.location.reload()
  }

  const correctGuesses = predictions.filter((p) => p.prediction === gender)

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        gender === "boy" ? "bg-[#c7e7e6]" : "bg-[#f9c8b9]"
      }`}
    >
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-lg {
          animation: bounce 1s infinite;
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s infinite;
        }
      `}</style>

      <Card className="max-w-2xl w-full p-8 sm:p-12 bg-white shadow-2xl border-0 text-center">
        {/* Emoji grande */}
        <div className="text-9xl mb-6 animate-pulse-scale">{gender === "boy" ? "👦" : "👧"}</div>

        {/* Título */}
        <h1 className={`text-2xl sm:text-6xl font-bold mb-4 ${gender === "boy" ? "text-[#c7e7e6]" : "text-[#f9c8b9]"} contorno-blanco`}>
          {gender === "boy" ? "¡Es un NIÑO!" : "¡Es una NIÑA!"}
        </h1>

        {/* Subtítulo */}
        <h2 className="text-6xl text-gray-600 mb-8 nombre">{gender === "boy" ? "Ethan Sebastian Zurita Segovía" : "Liah Charlotte Zurita Segovía"}</h2>
        <p className="text-2xl text-gray-600 mb-8">¡Felicidades! 🎉</p>

        {/* Estadísticas de aciertos */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg mb-8">
          <p className="text-lg font-semibold text-gray-800 mb-2">¿Quién acertó?</p>
          <p className={`text-3xl font-bold mb-4 ${gender === "boy" ? "text-blue-600" : "text-pink-600"}`}>
            {stats.correct} de {stats.total} acertaron
          </p>

          {correctGuesses.length > 0 && (
            <div className="space-y-2 mt-4">
              {/* <p className="text-sm font-semibold text-gray-700 mb-2">Ganadores:</p> */}
              {correctGuesses.map((guess) => (
                <div key={guess.id} className="bg-white rounded px-3 py-2 inline-block mr-2 mb-2">
                  <span className="font-semibold text-gray-800">{guess.name}</span>
                  <span className="ml-2 text-xl">⭐</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón para ver detalles */}
        {!showStats && (
          <Button
            onClick={() => setShowStats(true)}
            className="mb-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Ver Todas las Predicciones
          </Button>
        )}

        {/* Detalles expandidos */}
        {showStats && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Todas las Predicciones</h3>
            <div className="space-y-3">
              {predictions.map((pred) => {
                const correct = pred.prediction === gender
                return (
                  <div
                    key={pred.id}
                    className={`p-3 rounded ${correct ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{pred.name}</span>
                      <span className={`text-sm font-bold ${correct ? "text-green-700" : "text-red-700"}`}>
                        {correct ? "✓ Correcto" : "✗ Incorrecto"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Predijo: {pred.prediction === "boy" ? "👦 Niño" : "👧 Niña"}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setConfetti(!confetti)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg"
          >
            {confetti ? "🎉 Confetti ON" : "🎉 Confetti OFF"}
          </Button>
          <Button
            onClick={handleReset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
          >
            Reiniciar
          </Button>
        </div> */}
      </Card>
    </div>
  )
}
