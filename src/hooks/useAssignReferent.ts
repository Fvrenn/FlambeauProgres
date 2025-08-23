import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignReferentToBadge } from "@/src/lib/badgeReferent";

export function useAssignReferent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ badgeId, referentId }: { badgeId: string; referentId: string }) =>
      assignReferentToBadge(badgeId, referentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
}