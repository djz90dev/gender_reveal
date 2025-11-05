"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import ResultsPanel from "./results-panel"
import { useMemo } from "react"

interface Prediction {
  id: string
  name: string
  prediction: "boy" | "girl"
  message: string
  timestamp: string
}

interface ResultsViewProps {
  predictions: Prediction[]
  onBack: () => void
  onReveal: (gender: "boy" | "girl") => void
  revealed: boolean
}

export default function ResultsView({ predictions, onBack, onReveal, revealed }: ResultsViewProps) {
  const stats = useMemo(() => {
    const boyCount = predictions.filter((p) => p.prediction === "boy").length
    const girlCount = predictions.filter((p) => p.prediction === "girl").length
    const total = boyCount + girlCount

    return {
      boyCount,
      girlCount,
      total,
      boyPercentage: total > 0 ? Math.round((boyCount / total) * 100) : 0,
      girlPercentage: total > 0 ? Math.round((girlCount / total) * 100) : 0,
    }
  }, [predictions])

  return (
    <div className="min-h-screen gradient-pattern-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto mb-12">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ← Atrás
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Resultados en Vivo
          </h1>
          <p className="text-2xl font-bold text-gray-500">
            <span className="text-blue-600">{stats.total}</span> predicciones registradas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-12">
          {/* Boy card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#c7e7e6] hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-[blue-700] uppercase tracking-wider mb-3">Predicciones: Niño</p>
                <div className="mb-6">
                  <div className="text-6xl font-black text-[#c7e7e6] mb-2">{stats.boyCount}</div>
                  <div className="text-3xl font-bold text-[#c7e7e6]">{stats.boyPercentage}%</div>
                </div>
                <div className="w-full h-4 bg-[#c7e7e6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c7e7e6] transition-all duration-500 rounded-full"
                    style={{ width: `${stats.boyPercentage}%` }}
                  ></div>
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
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#f9c8b9]hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-black uppercase tracking-wider mb-3">Predicciones: Niña</p>
                <div className="mb-6">
                  <div className="text-6xl font-black text-[#f9c8b9] mb-2">{stats.girlCount}</div>
                  <div className="text-3xl font-bold text-[#f9c8b9]">{stats.girlPercentage}%</div>
                </div>
                <div className="w-full h-4 bg-[#f9c8b9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f9c8b9] transition-all duration-500 rounded-full"
                    style={{ width: `${stats.girlPercentage}%` }}
                  ></div>
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

        {/* Detailed predictions panel */}
        <ResultsPanel predictions={predictions} onReveal={onReveal} revealed={revealed} />
      </div>
    </div>
  )
}
