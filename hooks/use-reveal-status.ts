"use client";

import { useState, useEffect } from "react";
import { listenToRevealStatus, setRevealStatus } from "@/lib/firebase";

type Gender = "boy" | "girl";

export function useRevealStatus() {
  const [revealed, setRevealed] = useState(false);
  const [babyGender, setBabyGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Iniciar la escucha de cambios en tiempo real
    const unsubscribe = listenToRevealStatus((status) => {
      if (status?.gender) {
        setBabyGender(status.gender);
        setRevealed(true);
      }
      setLoading(false);
    });

    // Limpiar el oyente cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const revealGender = async (gender: Gender) => {
    try {
      await setRevealStatus(gender);
      // El estado se actualizará automáticamente gracias al listener
    } catch (error) {
      console.error("Error revealing gender:", error);
    }
  };

  return { revealed, babyGender, loading, revealGender };
}