// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"

// type Prediction = {
//   id: string
//   name: string
//   prediction: "boy" | "girl"
//   message: string
//   timestamp: string
// }

// export function usePredictions() {
//   const [predictions, setPredictions] = useState<Prediction[]>([])
//   const [loading, setLoading] = useState(true)
//   const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

//   const fetchPredictions = useCallback(async () => {
//     try {
//       const response = await fetch("/api/predictions", { cache: "no-store" })
//       if (response.ok) {
//         const data = await response.json()
//         console.log("[v0] Predicciones obtenidas:", data.length, "items")
//         setPredictions(Array.isArray(data) ? data : [])
//       }
//     } catch (error) {
//       console.error("[v0] Error fetching predictions:", error)
//     }
//   }, [])

//   useEffect(() => {
//     fetchPredictions().finally(() => setLoading(false))

//     pollIntervalRef.current = setInterval(() => {
//       fetchPredictions()
//     }, 500)

//     return () => {
//       if (pollIntervalRef.current) {
//         clearInterval(pollIntervalRef.current)
//       }
//     }
//   }, [fetchPredictions])

//   const addPrediction = useCallback(
//     async (name: string, prediction: "boy" | "girl", message: string) => {
//       const id = Date.now().toString()
//       const timestamp = new Date().toISOString()

//       console.log("[v0] Llamando POST con:", { id, name, prediction, message, timestamp })

//       try {
//         const response = await fetch("/api/predictions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id, name, prediction, message, timestamp }),
//         })

//         console.log("[v0] Respuesta POST status:", response.status)

//         if (response.ok) {
//           setTimeout(() => {
//             fetchPredictions()
//           }, 100)
//         } else {
//           console.error("[v0] POST failed:", await response.text())
//         }
//       } catch (error) {
//         console.error("[v0] Error adding prediction:", error)
//       }
//     },
//     [fetchPredictions],
//   )

//   return {
//     predictions,
//     loading,
//     addPrediction,
//     refetch: fetchPredictions,
//   }
// }





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
  const latestFetchRef = useRef<number>(0)
  const knownIdsRef = useRef<Set<string>>(new Set())

  // Inicializa knownIds desde el estado inicial (por si hay SSR/hidratación)
  if (predictions.length > 0 && knownIdsRef.current.size === 0) {
    knownIdsRef.current = new Set(predictions.map(p => p.id))
  }

  const fetchPredictions = useCallback(async () => {
    const fetchId = Date.now()
    latestFetchRef.current = fetchId

    try {
      const response = await fetch("/api/predictions", { cache: "no-store" })
      if (!response.ok) return

      const data: Prediction[] = await response.json()
      if (!Array.isArray(data)) return

      // Solo procesa si esta es la petición más reciente
      if (fetchId !== latestFetchRef.current) return

      const newPredictions: Prediction[] = []
      for (const item of data) {
        if (!knownIdsRef.current.has(item.id)) {
          knownIdsRef.current.add(item.id)
          newPredictions.push(item)
        }
      }

      if (newPredictions.length > 0) {
        setPredictions(prev => [...prev, ...newPredictions])
      }
    } catch (error) {
      console.error("[usePredictions] Error fetching predictions:", error)
    }
  }, [])

  // Efecto de montaje: carga inicial y polling
  useEffect(() => {
    // Carga inicial
    fetchPredictions().finally(() => setLoading(false))

    // Polling cada 2 segundos (más eficiente que 500ms)
    pollIntervalRef.current = setInterval(fetchPredictions, 2000)

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

      // Optimistic update: añadir inmediatamente al estado
      const newPred: Prediction = { id, name, prediction, message, timestamp }
      knownIdsRef.current.add(id)
      setPredictions(prev => [...prev, newPred])

      try {
        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPred),
        })

        if (!response.ok) {
          // En caso de error, eliminar del estado (opcional)
          console.error("[usePredictions] POST failed:", await response.text())
          setPredictions(prev => prev.filter(p => p.id !== id))
          knownIdsRef.current.delete(id)
        }
        // Si tiene éxito, ya está en el estado (optimistic), no necesitas refetch inmediato
      } catch (error) {
        console.error("[usePredictions] Error adding prediction:", error)
        setPredictions(prev => prev.filter(p => p.id !== id))
        knownIdsRef.current.delete(id)
      }
    },
    [],
  )

  return {
    predictions,
    loading,
    addPrediction,
    refetch: fetchPredictions,
  }
}