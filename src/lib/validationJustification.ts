import type { ValidateJustificationRequest, ValidateJustificationResponse } from "@/src/types/validationJustification";

export async function validateJustification(data: ValidateJustificationRequest): Promise<ValidateJustificationResponse> {
  const res = await fetch("/api/referent/validation-justification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Erreur inconnue" }));
    throw new Error(`${res.status}: ${errorData.error || "Erreur inconnue"}`);
  }

  return await res.json();
}