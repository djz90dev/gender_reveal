"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type Prediction = {
  id: string
  name: string
  prediction: "boy" | "girl"
  message: string
  timestamp: string
}

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchPredictions = useCallback(async () => {
    try {
      const response = await fetch("/api/predictions", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Predicciones obtenidas:", data.length, "items")
        setPredictions(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("[v0] Error fetching predictions:", error)
    }
  }, [])

  useEffect(() => {
    fetchPredictions().finally(() => setLoading(false))

    pollIntervalRef.current = setInterval(() => {
      fetchPredictions()
    }, 500)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [fetchPredictions])

  const addPrediction = useCallback(
    async (name: string, prediction: "boy" | "girl", message: string) => {
      const id = Date.now().toString()
      const timestamp = new Date().toISOString()

      console.log("[v0] Llamando POST con:", { id, name, prediction, message, timestamp })

      try {
        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name, prediction, message, timestamp }),
        })

        console.log("[v0] Respuesta POST status:", response.status)

        if (response.ok) {
          setTimeout(() => {
            fetchPredictions()
          }, 100)
        } else {
          console.error("[v0] POST failed:", await response.text())
        }
      } catch (error) {
        console.error("[v0] Error adding prediction:", error)
      }
    },
    [fetchPredictions],
  )

  return {
    predictions,
    loading,
    addPrediction,
    refetch: fetchPredictions,
  }
}
