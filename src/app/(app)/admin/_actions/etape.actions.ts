"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { iconeEtapeSchema, idSchema, objectifInputSchema } from "./schemas";

import { authorizeRole } from "@/lib/auth-guards";
import { ROLES_ADMIN } from "@/lib/roles";
import {
  EtapeAdminService,
  type EtapeInfoInput,
} from "@/services/etape-admin.service";
import { EtapeIconeService } from "@/services/etape-icone.service";

const etapeInfoSchema = z.object({
  number: z.string().min(1).max(50),
  name: z.string().min(1).max(120),
  description: z.string().max(2000),
  ordre: z.number().int(),
  wpValue: z
    .string()
    .max(50)
    .transform((value) => value.trim() || null)
    .nullable()
    .optional(),
});

const createEtapeSchema = etapeInfoSchema.extend({
  objectifs: z.array(objectifInputSchema).max(100),
});

const couleurSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale invalide")
  .nullable();

export async function createEtape(
  data: z.input<typeof createEtapeSchema>,
  icone?: File,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = createEtapeSchema.safeParse(data);
  const parsedIcone = iconeEtapeSchema.safeParse(icone);

  if (!parsed.success || !parsedIcone.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    const etape = await EtapeAdminService.create(
      toEtapeInfo(parsed.data),
      parsed.data.objectifs,
    );

    if (parsedIcone.data) {
      await EtapeIconeService.replace(etape.id, parsedIcone.data);
    }

    revalidatePath("/admin/etapes");

    return { success: true };
  } catch (error) {
    console.error("Error creating etape:", error);

    return { success: false, error: "Échec de la création de l'étape" };
  }
}

export async function updateEtape(
  id: string,
  data: z.input<typeof etapeInfoSchema>,
  icone?: File,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(id);
  const parsed = etapeInfoSchema.safeParse(data);
  const parsedIcone = iconeEtapeSchema.safeParse(icone);

  if (!parsedId.success || !parsed.success || !parsedIcone.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await EtapeAdminService.update(parsedId.data, toEtapeInfo(parsed.data));

    if (parsedIcone.data) {
      await EtapeIconeService.replace(parsedId.data, parsedIcone.data);
    }

    revalidatePath("/admin/etapes");
    revalidatePath(`/admin/etapes/${parsedId.data}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating etape:", error);

    return { success: false, error: "Échec de la mise à jour de l'étape" };
  }
}

export async function updateEtapeBadge(
  etapeId: string,
  couleur: string | null,
  icone?: File,
) {
  if (!(await authorizeRole(...ROLES_ADMIN))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({
      etapeId: idSchema,
      icone: iconeEtapeSchema,
      couleur: couleurSchema,
    })
    .safeParse({ etapeId, icone, couleur });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await EtapeAdminService.updateCouleur(
      parsed.data.etapeId,
      parsed.data.couleur,
    );

    if (parsed.data.icone) {
      await EtapeIconeService.replace(parsed.data.etapeId, parsed.data.icone);
    }

    revalidatePath("/admin/etapes");
    revalidatePath(`/admin/etapes/${parsed.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating etape badge:", error);

    return { success: false, error: "Échec de la mise à jour du badge" };
  }
}

function toEtapeInfo(data: z.output<typeof etapeInfoSchema>): EtapeInfoInput {
  return {
    number: data.number,
    name: data.name,
    description: data.description,
    ordre: data.ordre,
    wpValue: data.wpValue ?? null,
  };
}
