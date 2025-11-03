let predictionsStore: Array<{
  id: string
  name: string
  prediction: "boy" | "girl"
  message: string
  timestamp: string
}> = []

let revealStore: { gender: "boy" | "girl"; revealed_at: string } | null = null

export function getPredictions() {
  console.log("[v0] GET predictions - returning:", predictionsStore.length, "items")
  return predictionsStore
}

export function addPrediction(
  id: string,
  data: {
    name: string
    prediction: "boy" | "girl"
    message: string
    timestamp: string
  },
) {
  try {
    console.log("[v0] Agregando predicción:", data.name, "para", data.prediction)

    const existingIndex = predictionsStore.findIndex((p) => p.id === id)
    if (existingIndex >= 0) {
      predictionsStore[existingIndex] = { ...data, id }
    } else {
      predictionsStore.push({ ...data, id })
    }

    console.log("[v0] Predicción guardada. Total:", predictionsStore.length)
    return predictionsStore
  } catch (error) {
    console.error("[v0] Error saving prediction:", error)
    return predictionsStore
  }
}

export function getReveal() {
  console.log("[v0] GET reveal status:", revealStore)
  return revealStore
}

export function setReveal(gender: "boy" | "girl") {
  try {
    revealStore = {
      gender,
      revealed_at: new Date().toISOString(),
    }
    console.log("[v0] Reveal status guardado:", gender)
    return revealStore
  } catch (error) {
    console.error("[v0] Error saving reveal status:", error)
    return null
  }
}

export function clearAll() {
  try {
    predictionsStore = []
    revealStore = null
    console.log("[v0] Todos los datos eliminados")
    return true
  } catch (error) {
    console.error("[v0] Error clearing data:", error)
    return false
  }
}
