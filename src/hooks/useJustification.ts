import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveJustification, submitJustification } from "@/src/lib/justification";
import type { Justification } from "@/src/types/justification";

export function useJustification() {
  const queryClient = useQueryClient();

  // Mutation pour sauvegarder en brouillon
  const saveMutation = useMutation({
    mutationFn: (justification: Omit<Justification, "id" | "statut">) =>
      saveJustification(justification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });

  // Mutation pour soumettre
  const submitMutation = useMutation({
    mutationFn: (justification: Omit<Justification, "id" | "statut">) =>
      submitJustification(justification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });

  return {
    saveJustification: saveMutation.mutate,
    saveJustificationAsync: saveMutation.mutateAsync,
    isSaving: saveMutation.status === "pending",
    submitJustification: submitMutation.mutate,
    submitJustificationAsync: submitMutation.mutateAsync,
    isSubmitting: submitMutation.status === "pending",
    saveError: saveMutation.error,
    submitError: submitMutation.error,
  };
}