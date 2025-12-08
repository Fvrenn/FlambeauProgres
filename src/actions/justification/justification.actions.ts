"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { JustificationService } from "@/services/justification.service";

/**
 * Valide une justification soumise par un Chef
 */
export async function approveJustification(justificationId: string) {
  try {
    const user = await getUser();
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    const result = await JustificationService.approveJustification(justificationId, user.id);

    if (result.success) {
      revalidatePath("/referent/dashboard");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Refuse une justification avec un motif
 */
export async function rejectJustification(
  justificationId: string,
  motif: string
) {
  try {
    const user = await getUser();
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    const result = await JustificationService.rejectJustification(justificationId, user.id, motif);

    if (result.success) {
      revalidatePath("/referent/dashboard");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Demande des précisions sur une justification
 */
export async function requestChanges(
  justificationId: string,
  motif: string
) {
  try {
    const user = await getUser();
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    const result = await JustificationService.requestChanges(justificationId, user.id, motif);

    if (result.success) {
      revalidatePath("/referent/dashboard");
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Erreur lors de la demande de précisions:", error);
    return { success: false, error: "Erreur serveur" };
  }
}