import type { JustificationWithRelations } from "@/src/types/justificationWithRelations";

export async function getJustificationsForReferent(referentId: string): Promise<JustificationWithRelations[]> {
  const res = await fetch(`/api/referent/${referentId}/justification`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Échec du fetch justifications: ${res.status} - ${errorData}`);
  }
  return await res.json();
}