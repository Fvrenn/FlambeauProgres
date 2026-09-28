import { RafraichirSiDejaAffiche } from "./RafraichirSiDejaAffiche";

export function RafraichissementArrierePlan() {
  return <RafraichirSiDejaAffiche rendu={crypto.randomUUID()} />;
}
