"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LandingViewProps {
  onNavigate: (view: "vote" | "results") => void
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  return (
    <div className="min-h-screen gradient-pattern-background p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 left-5 opacity-30 pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-blue-300 blur-2xl"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-30 pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-pink-300 blur-3xl"></div>
      </div>
      <div className="absolute top-1/2 left-10 opacity-20 pointer-events-none">
        <div className="w-24 h-24 rounded-full bg-yellow-200 blur-2xl"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-6xl sm:text-7xl font-black mb-6 leading-tight">
            <span className="text-[#c7e7e6] contorno-blanco">¿Niño</span> <span className="text-gray-500">o</span> <span className="text-[#f9c8b9] contorno-blanco">Niña?</span>
          </h1>
          <p className="text-2xl text-gray-500 font-semibold mb-2">Revelación de Género del Bebé</p>
          {/* <p className="text-lg text-gray-600">¡Ayuda a descubrir el sexo del bebé con tus predicciones!</p> */}
        </div>

        {/* Split design with footprints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-12 overflow-hidden">
          {/* Boy side */}
          <div
            className="flex flex-col items-center justify-center min-h-60 cursor-pointer transition-all group"
            // className="bg-[#c7e7e6] p-8 sm:p-12 flex flex-col items-center justify-center min-h-96 cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => onNavigate("vote")}
          >
            <div className="mb-0 transform transition-transform">
              <Image
                src="/c_blue.webp"
                alt="Niño"
                width={500}
                height={500}
                className="drop-shadow-xl"
              />
            </div>
            {/* <h2 className="text-4xl font-black text-blue-700 mb-4">AGREGAR PREDICCIÓN</h2> */}
            {/* <p className="text-blue-600 text-lg mb-8 text-center">Comparte tu predicción y déjanos tu mensaje</p> */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
              AGREGAR PREDICCIÓN
            </Button>
          </div>

          {/* Girl side */}
          <div
            className=" flex flex-col items-center justify-center min-h-60 cursor-pointer transition-all group"
            // className="bg-[#f9c8b9] p-8 sm:p-12 flex flex-col items-center justify-center min-h-96 cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => onNavigate("results")}
          >
            <div className="mb-0 transform transition-transform">
              <Image
                src="/c_pink.webp"
                alt="Niña"
                width={640}
                height={640}
                className="drop-shadow-xl"
              />
            </div>
            {/* <h2 className="text-4xl font-black text-pink-700 mb-4">VER RESULTADOS</h2> */}
            {/* <p className="text-pink-600 text-lg mb-8 text-center">Observa votos, porcentajes y mensajes en vivo</p> */}
            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-10 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
              VER RESULTADOS
            </Button>
          </div>
        </div>

        {/* Footer decoration */}
        {/* <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 shadow-md">
            <span className="text-3xl">💙</span>
            <span className="text-gray-500 font-semibold">Espera la gran revelación</span>
            <span className="text-3xl">💗</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}
