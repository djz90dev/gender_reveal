import { getPredictions, addPrediction, clearAll } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const predictions = getPredictions()
    console.log("[v0] GET predictions - returning:", predictions.length, "items")
    return NextResponse.json(predictions)
  } catch (error) {
    console.error("[v0] Error fetching predictions:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, prediction, message, timestamp } = body

    console.log("[v0] POST prediction recibido - name:", name, "prediction:", prediction)

    if (!name || !prediction) {
      console.error("[v0] Missing required fields - name:", name, "prediction:", prediction)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const finalTimestamp = timestamp || new Date().toISOString()
    const finalId = id || Date.now().toString()

    const updatedPredictions = addPrediction(finalId, {
      name,
      prediction,
      message: message || "",
      timestamp: finalTimestamp,
    })

    console.log("[v0] POST exitoso - total predicciones:", updatedPredictions.length)
    return NextResponse.json({ success: true, predictions: updatedPredictions })
  } catch (error) {
    console.error("[v0] Error en POST:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    clearAll()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting predictions:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
