const predictions: Record<string, any> = {}
let revealStatus: { gender: string; revealed_at: string } | null = null

export const storage = {
  getPredictions: () => {
    return Object.values(predictions).sort((a, b) => b.timestamp - a.timestamp)
  },

  addPrediction: (id: string, data: any) => {
    predictions[id] = { ...data, id }
    console.log("[v0] Added prediction. Total:", Object.keys(predictions).length)
    return Object.values(predictions).sort((a, b) => b.timestamp - a.timestamp)
  },

  getReveal: () => {
    return revealStatus
  },

  setReveal: (gender: string) => {
    revealStatus = { gender, revealed_at: new Date().toISOString() }
    console.log("[v0] Reveal set to:", gender)
    return revealStatus
  },

  clear: () => {
    Object.keys(predictions).forEach((key) => delete predictions[key])
    revealStatus = null
    console.log("[v0] Storage cleared")
  },
}
