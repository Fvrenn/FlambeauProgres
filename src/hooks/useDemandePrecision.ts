import { useState } from "react";
import type { CreateDemandePrecisionRequest } from "@/src/types/demandePrecision";

export const useDemandePrecision = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demanderPrecision = async (data: CreateDemandePrecisionRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/referent/demande-precision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la demande");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    demanderPrecision,
    isLoading,
    error,
  };
};