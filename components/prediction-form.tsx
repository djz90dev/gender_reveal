"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PredictionFormProps {
  onSubmit: (name: string, prediction: "boy" | "girl", message: string) => void
}

export default function PredictionForm({ onSubmit }: PredictionFormProps) {
  const [name, setName] = useState("")
  const [prediction, setPrediction] = useState<"boy" | "girl">("boy")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submit - name:", name, "prediction:", prediction)
    if (name.trim()) {
      onSubmit(name, prediction, message)
      setName("")
      setPrediction("boy")
      setMessage("")
    }
  }

  return (
    <Card className="p-6 gradient-pattern-background shadow-2xl border-0 rounded-3xl">
      {/* <h2 className="text-3xl font-black text-gray-800 mb-8">Haz tu Predicción</h2> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: María Perez"
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg font-semibold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">¿Niño o niña?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPrediction("boy")}
              className={`py-4 px-4 rounded-2xl font-bold transition-all transform ${
                prediction === "boy"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl scale-105 ring-4 ring-blue-300"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-md hover:shadow-lg"
              }`}
            >
              <div className="text-3xl mb-2">👦</div>
              <div className="text-lg">NIÑO</div>
            </button>
            <button
              type="button"
              onClick={() => setPrediction("girl")}
              className={`py-4 px-4 rounded-2xl font-bold transition-all transform ${
                prediction === "girl"
                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl scale-105 ring-4 ring-pink-300"
                  : "bg-pink-100 text-pink-700 hover:bg-pink-200 shadow-md hover:shadow-lg"
              }`}
            >
              <div className="text-3xl mb-2">👧</div>
              <div className="text-lg">NIÑA</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
            Mensaje especial
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="💬 Comparte un mensaje especial para el bebé..."
            maxLength={150}
            rows={4}
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all resize-none text-base font-medium"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Máximo 150 caracteres</p>
            <p className={`text-sm font-semibold ${message.length > 130 ? "text-orange-600" : "text-gray-600"}`}>
              {message.length}/150
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Enviar Predicción
        </Button>
      </form>
    </Card>
  )
}
