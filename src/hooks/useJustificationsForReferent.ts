import { useQuery } from "@tanstack/react-query";
import { getJustificationsForReferent } from "@/src/lib/justificationsForReferent";
import type { JustificationWithRelations } from "@/src/types/justificationWithRelations";

export function useJustificationsForReferent(referentId: string | undefined) {
  return useQuery<JustificationWithRelations[]>({
    queryKey: ["justifications", "referent", referentId],
    queryFn: () => getJustificationsForReferent(referentId!), // Non-null assertion car enabled vérifie
    staleTime: 5 * 60 * 1000,
    enabled: !!referentId, // Le hook ne s'exécute que si referentId existe
  });
}