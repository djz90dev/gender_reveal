import { getReveal, setReveal } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const reveal = getReveal()
    console.log("[v0] GET reveal - status:", reveal)
    return NextResponse.json(reveal || { revealed: false })
  } catch (error) {
    console.error("[v0] Error fetching reveal status:", error)
    return NextResponse.json({ error: "Failed to fetch reveal status" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gender } = body

    console.log("[v0] POST reveal - gender:", gender)

    if (!gender) {
      return NextResponse.json({ error: "Missing gender" }, { status: 400 })
    }

    const result = setReveal(gender)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("[v0] Error setting reveal:", error)
    return NextResponse.json({ error: "Failed to set reveal" }, { status: 500 })
  }
}
