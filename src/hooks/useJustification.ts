import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  saveJustification,
  submitJustification,
  updateJustification,
  getJustificationDraft,
} from "@/src/lib/justification";
import type { Justification } from "@/src/types/justification";

export function useJustification() {
  const queryClient = useQueryClient();

  function useDraft(badgeId: string, objectifId: string, chefId: string) {
    return useQuery({
      queryKey: ["justification", badgeId, objectifId, chefId],
      queryFn: () => getJustificationDraft(badgeId, objectifId, chefId),
      enabled: !!badgeId && !!objectifId && !!chefId,
    });
  }

  const saveMutation = useMutation({
    mutationFn: (justification: Omit<Justification, "id" | "statut">) =>
      saveJustification(justification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: (justification: any) =>
      justification.id
        ? updateJustification({ ...justification, statut: "SOUMISE" })
        : submitJustification({ ...justification, statut: "SOUMISE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      queryClient.invalidateQueries({ queryKey: ["justification"] });
    },
  });

  return {
    saveJustification: saveMutation.mutate,
    saveJustificationAsync: saveMutation.mutateAsync,
    isSaving: saveMutation.status === "pending",
    submitJustification: submitMutation.mutateAsync,
    isSubmitting: submitMutation.status === "pending",
    saveError: saveMutation.error,
    submitError: submitMutation.error,
    useDraft,
  };
}
