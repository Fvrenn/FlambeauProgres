"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { idSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { FormationService } from "@/services/formation.service";

const formationInputSchema = z.object({
  titre: z.string().min(1).max(200),
  imageUrl: z.string().url().max(2048),
  lien: z.string().url().max(2048),
});

export async function createFormation(data: {
  titre: string;
  imageUrl: string;
  lien: string;
}) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = formationInputSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.create(parsed.data);

    revalidatePath("/admin/formations");
    revalidatePath("/formation");

    return { success: true };
  } catch (error) {
    console.error("Error creating formation:", error);

    return { success: false, error: "Échec de la création de la carte" };
  }
}

export async function updateFormation(
  formationId: string,
  data: { titre: string; imageUrl: string; lien: string },
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(formationId);
  const parsed = formationInputSchema.safeParse(data);

  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.update(parsedId.data, parsed.data);

    revalidatePath("/admin/formations");
    revalidatePath("/formation");

    return { success: true };
  } catch (error) {
    console.error("Error updating formation:", error);

    return { success: false, error: "Échec de la mise à jour de la carte" };
  }
}

export async function deleteFormation(formationId: string) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(formationId);

  if (!parsedId.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.remove(parsedId.data);

    revalidatePath("/admin/formations");
    revalidatePath("/formation");

    return { success: true };
  } catch (error) {
    console.error("Error deleting formation:", error);

    return { success: false, error: "Échec de la suppression de la carte" };
  }
}
