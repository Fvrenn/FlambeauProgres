"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { idSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { ProgressionAdminService } from "@/services/progression-admin.service";

const justificationSchema = z.object({
  chefId: idSchema,
  justificationId: idSchema,
});

const etapeSchema = z.object({ chefId: idSchema, etapeId: idSchema });

export async function supprimerJustificationAdmin(
  chefId: string,
  justificationId: string,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = justificationSchema.safeParse({ chefId, justificationId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    const result = await ProgressionAdminService.supprimerJustification(
      parsed.data.chefId,
      parsed.data.justificationId,
    );

    revalidatePath(`/admin/users/${parsed.data.chefId}/progression`);

    return result;
  } catch (error) {
    console.error("Error deleting justification:", error);

    return { success: false, error: "Échec de la suppression" };
  }
}

export async function reinitialiserEtapeAdmin(chefId: string, etapeId: string) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = etapeSchema.safeParse({ chefId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    const result = await ProgressionAdminService.reinitialiserEtape(
      parsed.data.chefId,
      parsed.data.etapeId,
    );

    revalidatePath(`/admin/users/${parsed.data.chefId}/progression`);

    return result;
  } catch (error) {
    console.error("Error resetting etape:", error);

    return { success: false, error: "Échec de la réinitialisation" };
  }
}
