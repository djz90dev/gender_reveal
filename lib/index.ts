export type GenderPrediction = "boy" | "girl";

export interface Prediction {
  id: string;
  name: string;
  prediction: GenderPrediction;
  message: string;
  timestamp: string; // O Date si prefieres convertirlo
}