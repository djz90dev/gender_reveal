"use client"

import { Button } from "@/components/ui/button"
import ResultsPanel from "./results-panel"
import { Settings } from "lucide-react" // Necesitarás instalar lucide-react

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
  isAdmin: boolean
  onAdminLogin: () => void
}

export default function ResultsView({
  predictions,
  onBack,
  onReveal,
  revealed,
  isAdmin,
  onAdminLogin,
}: ResultsViewProps) {
  return (
    <div className="min-h-screen gradient-pattern-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto relative">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-500 font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all mb-6"
        >
          ← Atrás
        </Button>

        {/* --- ESTE ES EL BOTÓN QUE BUSCAS --- */}
        {!isAdmin && (
          <Button
            onClick={onAdminLogin}
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
          >
            <Settings className="h-6 w-6" />
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-500 mb-4">Resultados de las Predicciones</h1>
        </div>

        <ResultsPanel
          predictions={predictions}
          onReveal={onReveal}
          revealed={revealed}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}