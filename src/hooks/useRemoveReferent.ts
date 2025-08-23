import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeReferentFromBadge } from "@/src/lib/badgeReferent";

export function useRemoveReferent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ badgeId, referentId }: { badgeId: string; referentId: string }) =>
      removeReferentFromBadge(badgeId, referentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
}