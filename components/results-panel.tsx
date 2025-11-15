"use client"

import { useState, useMemo } from "react"
import Slider from "react-slick"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Prediction {
  id: string
  name: string
  prediction: "boy" | "girl"
  message: string
  timestamp: string
}

interface ResultsPanelProps {
  predictions: Prediction[]
  onReveal: (gender: "boy" | "girl") => void
  revealed: boolean
  isAdmin: boolean
}

export default function ResultsPanel({ predictions, onReveal, revealed, isAdmin }: ResultsPanelProps) {
  const [showRevealModal, setShowRevealModal] = useState(false)

  const stats = useMemo(() => {
    const boyCount = predictions.filter((p) => p.prediction === "boy").length
    const girlCount = predictions.filter((p) => p.prediction === "girl").length
    const total = predictions.length
    const boyPercentage = total > 0 ? Math.round((boyCount / total) * 100) : 0
    const girlPercentage = total > 0 ? Math.round((girlCount / total) * 100) : 0

    return { boyCount, girlCount, total, boyPercentage, girlPercentage }
  }, [predictions])

  const sliderSettings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000, // 6 segundos
    infinite: predictions.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1, // Mover de 2 en 2
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <>
      <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Boy card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#c7e7e6] hover:shadow-xl transition-shadow">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3">Predicciones: Niño</p>
              <div className="mb-6">
                <div className="text-6xl font-black text-[#84b6f4] mb-2">{stats.boyCount}</div>
                <div className="text-3xl font-bold text-[#84b6f4]">{stats.boyPercentage}%</div>
              </div>
              <div className="w-full h-4 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#84b6f4] transition-all duration-500 rounded-full"
                  style={{ width: `${stats.boyPercentage}%` }}
                />
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <Image
                src="/c_blue.webp"
                alt="Niño"
                width={200}
                height={200}
                className="w-40 h-40 drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Girl card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#f9c8b9] hover:shadow-xl transition-shadow">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-bold text-pink-700 uppercase tracking-wider mb-3">Predicciones: Niña</p>
              <div className="mb-6">
                <div className="text-6xl font-black text-[#fdcae1] mb-2">{stats.girlCount}</div>
                <div className="text-3xl font-bold text-[#fdcae1]">{stats.girlPercentage}%</div>
              </div>
              <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#fdcae1] transition-all duration-500 rounded-full"
                  style={{ width: `${stats.girlPercentage}%` }}
                />
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <Image
                src="/c_pink.webp"
                alt="Niña"
                width={200}
                height={200}
                className="w-40 h-40 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

        {predictions.length > 0 && (
          <Card className="p-8 flex-1 bg-white shadow-lg border-0 rounded-2xl">
            <h3 className="text-2xl font-black text-gray-500 mb-8">Predicciones de Familiares</h3>
            <div className="relative">
              <Slider {...sliderSettings}>
              {predictions.map((pred) => (
                <div
                  key={pred.id}
                  className="px-2 h-[260px]" // Padding for spacing between slides
                >
                  <div
                    className={`p-5 rounded-2xl border-l-4 transition-all h-full flex flex-col justify-between ${
                      pred.prediction === "boy"
                        ? "bg-[#bbd5f9] border-l-[#84b6f4]"
                        : "bg-[#fff0f6] border-l-[#fdcae1]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-black text-gray-500 text-lg">{pred.name}</p>
                          <span className="text-2xl">{pred.prediction === "boy" ? "👦" : "👧"}</span>
                        </div>
                        <p
                          className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                            pred.prediction === "boy" ? "text-blue-700" : "text-pink-700"
                          }`}
                        >
                          Predice: {pred.prediction === "boy" ? "NIÑO" : "NIÑA"}
                        </p>
                        {pred.message && (
                          <div className="bg-white rounded-lg px-4 py-3 mb-2 border-l-2 border-yellow-400">
                            <p className="text-sm text-gray-500 italic">
                              💬 {'"'}
                              {pred.message}
                              {'"'}
                            </p>
                          </div>
                      )}
                      <p className="text-xs text-gray-600 font-medium pt-2">
                          {new Date(pred.timestamp).toLocaleString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </Slider>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-8">
        {isAdmin && !revealed && stats.total > 0 && (
        <Button
          onClick={() => setShowRevealModal(true)}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-5 text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          🎉 ¡REVELAR EL GÉNERO! 🎉
        </Button>
      )}
      </div>
 {showRevealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="p-8 bg-white max-w-md w-full shadow-2xl border-0 rounded-3xl">
            <h2 className="text-3xl font-black text-gray-500 mb-2 text-center">¿Cuál es el género?</h2>
            <p className="text-center text-gray-600 mb-8 font-semibold">¡Elige el sexo del bebé!</p>
            <div className="space-y-4">
              <Button
                onClick={() => onReveal("boy")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                👦 Es un NIÑO
              </Button>
              <Button
                onClick={() => onReveal("girl")}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                👧 Es una NIÑA
              </Button>
              <Button
                onClick={() => setShowRevealModal(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-500 font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

 {stats.total === 0 && (
        <Card className="p-16 bg-gradient-to-br from-blue-50 to-pink-50 shadow-lg border-2 border-dashed border-gray-300 text-center rounded-2xl">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-gray-500 font-bold">No hay predicciones aún</p>
          <p className="text-gray-600 mt-2">¡Ve a agregar predicciones para ver los resultados aquí!</p>
        </Card>
      )}
    </>
  )
}
