"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { idSchema, objectifInputSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import { ObjectifService } from "@/services/objectif.service";

const objectifIdsSchema = z.object({
  objectifId: idSchema,
  etapeId: idSchema,
});

export async function createObjectif(
  etapeId: string,
  data: z.input<typeof objectifInputSchema>,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(etapeId);
  const parsed = objectifInputSchema.safeParse(data);

  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await ObjectifService.create(parsedId.data, parsed.data);

    revalidatePath(`/admin/etapes/${parsedId.data}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating objectif:", error);

    return { success: false, error: "Échec de la création de l'objectif" };
  }
}

export async function updateObjectif(
  objectifId: string,
  etapeId: string,
  data: z.input<typeof objectifInputSchema>,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedIds = objectifIdsSchema.safeParse({ objectifId, etapeId });
  const parsed = objectifInputSchema.safeParse(data);

  if (!parsedIds.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await ObjectifService.update(parsedIds.data.objectifId, parsed.data);

    revalidatePath(`/admin/etapes/${parsedIds.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating objectif:", error);

    return { success: false, error: "Échec de la mise à jour de l'objectif" };
  }
}

export async function deleteObjectif(objectifId: string, etapeId: string) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = objectifIdsSchema.safeParse({ objectifId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await ObjectifService.remove(parsed.data.objectifId);

    revalidatePath(`/admin/etapes/${parsed.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting objectif:", error);

    return { success: false, error: "Échec de la suppression de l'objectif" };
  }
}
