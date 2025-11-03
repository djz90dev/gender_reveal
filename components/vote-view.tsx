"use client"

import { Button } from "@/components/ui/button"
import PredictionForm from "./prediction-form"
import { useState } from "react"
import Image from "next/image"

interface VoteViewProps {
  onBack: () => void
  onAddPrediction: (name: string, prediction: "boy" | "girl", message: string) => void
}

export default function VoteView({ onBack, onAddPrediction }: VoteViewProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (name: string, prediction: "boy" | "girl", message: string) => {
    console.log("[v0] Vote view - handleSubmit llamado con:", { name, prediction, message })
    onAddPrediction(name, prediction, message)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div className="min-h-screen gradient-pattern-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ← Atrás
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Haz tu Predicción
          </h1>
          <p className="text-gray-500 text-xl font-semibold">¿Crees que será niño o niña?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-400 rounded-2xl shadow-lg animate-pulse">
                <p className="text-center text-green-700 font-bold text-xl">✓ ¡Predicción registrada con éxito!</p>
              </div>
            )}

            <PredictionForm onSubmit={handleSubmit} />

            
          </div>

          {/* <div className="hidden lg:flex flex-col items-center justify-start gap-8 pt-8">
            <div className="text-center">
              <Image
                src="/boy-elephant.png"
                alt="Niño"
                width={140}
                height={140}
                className="w-32 h-32 mx-auto mb-2 drop-shadow-lg"
              />
              <span className="text-blue-600 font-bold text-sm">NIÑO</span>
            </div>
            <div className="text-center">
              <Image
                src="/girl-elephant.png"
                alt="Niña"
                width={140}
                height={140}
                className="w-32 h-32 mx-auto mb-2 drop-shadow-lg"
              />
              <span className="text-pink-600 font-bold text-sm">NIÑA</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
