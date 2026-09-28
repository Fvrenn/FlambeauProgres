"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { idSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { AssignationService } from "@/services/assignation.service";

const assignationSchema = z.object({
  referentId: idSchema,
  etapeId: idSchema,
});

export async function assignReferentToEtape(
  referentId: string,
  etapeId: string,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = assignationSchema.safeParse({ referentId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await AssignationService.assign(
      parsed.data.referentId,
      parsed.data.etapeId,
    );

    revalidatePath("/admin/assignations");

    return { success: true };
  } catch (error) {
    console.error("Error assigning referent:", error);

    return { success: false, error: "Échec de l'assignation du référent" };
  }
}

export async function removeReferentFromEtape(
  referentId: string,
  etapeId: string,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = assignationSchema.safeParse({ referentId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await AssignationService.remove(
      parsed.data.referentId,
      parsed.data.etapeId,
    );

    revalidatePath("/admin/assignations");

    return { success: true };
  } catch (error) {
    console.error("Error removing referent:", error);

    return { success: false, error: "Échec du retrait du référent" };
  }
}
