import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/src/lib/user";
import { addToast } from "@heroui/toast";
import type { UpdateUserRole } from "@/src/types/user";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: UpdateUserRole) => updateUserRole(payload),
    onSuccess: (data, variables) => {
      // Invalider et refetch la liste des users
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Toast de succès
      addToast({
        title: "Rôle modifié avec succès",
        description: `Le rôle a été changé vers ${variables.role}`,
        variant: "solid",
      });
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      
      // Extraire le message d'erreur
      let errorMessage = "Une erreur est survenue";
      try {
        if (error.message.includes("403")) {
          errorMessage = "Vous ne pouvez pas modifier votre propre rôle";
        } else if (error.message.includes("401")) {
          errorMessage = "Vous devez être connecté pour effectuer cette action";
        } else if (error.message.includes("404")) {
          errorMessage = "Utilisateur non trouvé";
        } else if (error.message.includes("400")) {
          errorMessage = "Données invalides";
        }
      } catch {
        errorMessage = "Une erreur est survenue lors de la modification";
      }
      
      // Toast d'erreur
      addToast({
        title: "Erreur lors de la modification",
        description: errorMessage,
        variant: "solid",
      });
    },
  });
}