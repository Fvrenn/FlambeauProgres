import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validateJustification } from "@/src/lib/validationJustification";
import { addToast } from "@heroui/toast";
import type { ValidateJustificationRequest } from "@/src/types/validationJustification";

export function useValidateJustification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ValidateJustificationRequest) => validateJustification(payload),
    onSuccess: (data, variables) => {
      // Invalider les queries liées aux justifications
      queryClient.invalidateQueries({ queryKey: ["justifications"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      
      // Toast de succès
      const actionText = variables.action === "VALIDER" ? "validée" : "refusée";
      addToast({
        title: `Justification ${actionText}`,
        description: `La justification a été ${actionText} avec succès`,
        variant: "solid",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la validation:", error);
      
      // Extraire le message d'erreur
      let errorMessage = "Une erreur est survenue";
      try {
        if (error.message.includes("403")) {
          errorMessage = "Vous n'avez pas les permissions pour cette action";
        } else if (error.message.includes("401")) {
          errorMessage = "Vous devez être connecté pour effectuer cette action";
        } else if (error.message.includes("404")) {
          errorMessage = "Justification non trouvée";
        } else if (error.message.includes("400")) {
          errorMessage = "Données invalides";
        }
      } catch {
        errorMessage = "Une erreur est survenue lors de la validation";
      }
      
      // Toast d'erreur
      addToast({
        title: "Erreur lors de la validation",
        description: errorMessage,
        variant: "solid",
      });
    },
  });
}