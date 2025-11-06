"use client";

import { useState, useEffect } from "react";
import {
  initializeAuthAndDatabase,
  listenToPredictions,
  addPredictionToDatabase,
} from "@/lib/firebase";
import type { GenderPrediction, Prediction } from "@/types";

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Efecto para inicializar Firebase y suscribirse a los cambios
  useEffect(() => {
    let unsubscribe = () => {};

    const setupListener = async () => {
      try {
        const id = await initializeAuthAndDatabase();
        setUserId(id);

        // Empezamos a escuchar los cambios en tiempo real
        unsubscribe = listenToPredictions((newPredictions: Prediction[]) => {
          setPredictions(newPredictions);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error setting up predictions listener:", err);
        setError("No se pudieron cargar las predicciones.");
        setLoading(false);
      }
    };

    setupListener();

    // Al desmontar el componente, dejamos de escuchar para evitar fugas de memoria
    return () => unsubscribe();
  }, []);

  // Función para añadir una nueva predicción
  const addPrediction = (data: { name: string; prediction: GenderPrediction; message: string }) => {
    if (!userId) throw new Error("User not authenticated");
    return addPredictionToDatabase(data, userId);
  };

  return { predictions, loading, error, addPrediction };
}