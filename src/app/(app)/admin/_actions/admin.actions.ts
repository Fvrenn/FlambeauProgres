"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import prisma from "@/lib/prisma";
import { authorizeRole } from "@/lib/auth-guards";
import { FormationService } from "@/services/formation.service";

const idSchema = z.string().min(1);

const objectifInputSchema = z.object({
  code: z.string().min(1).max(50),
  description: z.string().max(2000),
  type: z.enum(["COMPETENCE", "REALISATION"]),
  fichiersRequis: z.boolean(),
  texteRequis: z.boolean(),
});

const etapeInfoSchema = z.object({
  number: z.string().min(1).max(50),
  name: z.string().min(1).max(120),
  description: z.string().max(2000),
  ordre: z.number().int(),
});

const createEtapeSchema = etapeInfoSchema.extend({
  objectifs: z.array(objectifInputSchema).max(100),
});

export async function updateUserRole(userId: string, role: UserRole) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ userId: idSchema, role: z.nativeEnum(UserRole) })
    .safeParse({ userId, role });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { role: parsed.data.role },
    });

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);

    return { success: false, error: "Échec de la mise à jour du rôle" };
  }
}

export async function assignReferentToEtape(
  referentId: string,
  etapeId: string,
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ referentId: idSchema, etapeId: idSchema })
    .safeParse({ referentId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etapeReferent.create({
      data: {
        referentId: parsed.data.referentId,
        etapeId: parsed.data.etapeId,
      },
    });

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
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ referentId: idSchema, etapeId: idSchema })
    .safeParse({ referentId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etapeReferent.delete({
      where: {
        referentId_etapeId: {
          referentId: parsed.data.referentId,
          etapeId: parsed.data.etapeId,
        },
      },
    });

    revalidatePath("/admin/assignations");

    return { success: true };
  } catch (error) {
    console.error("Error removing referent:", error);

    return { success: false, error: "Échec du retrait du référent" };
  }
}

export async function createEtape(data: {
  number: string;
  name: string;
  description: string;
  ordre: number;
  objectifs: {
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis: boolean;
    texteRequis: boolean;
  }[];
}) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = createEtapeSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etape.create({
      data: {
        number: parsed.data.number,
        name: parsed.data.name,
        description: parsed.data.description,
        ordre: parsed.data.ordre,
        objectifs: {
          create: parsed.data.objectifs,
        },
      },
    });

    revalidatePath("/admin/etapes");

    return { success: true };
  } catch (error) {
    console.error("Error creating etape:", error);

    return { success: false, error: "Échec de la création de l'étape" };
  }
}

export async function updateEtape(
  id: string,
  data: {
    number: string;
    name: string;
    description: string;
    ordre: number;
  },
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(id);
  const parsed = etapeInfoSchema.safeParse(data);

  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etape.update({
      where: { id: parsedId.data },
      data: {
        number: parsed.data.number,
        name: parsed.data.name,
        description: parsed.data.description,
        ordre: parsed.data.ordre,
      },
    });

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
  imageSrc: string,
  couleur?: string | null,
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({
      etapeId: idSchema,
      imageSrc: z.string().min(1).max(2048),
      couleur: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "Couleur hexadécimale invalide")
        .nullable()
        .optional(),
    })
    .safeParse({ etapeId, imageSrc, couleur });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etape.update({
      where: { id: parsed.data.etapeId },
      data: {
        image_src: parsed.data.imageSrc,
        couleur: parsed.data.couleur ?? null,
      },
    });

    revalidatePath("/admin/etapes");
    revalidatePath(`/admin/etapes/${parsed.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating etape badge:", error);

    return { success: false, error: "Échec de la mise à jour du badge" };
  }
}

export async function createObjectif(
  etapeId: string,
  data: {
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis: boolean;
    texteRequis: boolean;
  },
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(etapeId);
  const parsed = objectifInputSchema.safeParse(data);

  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.objectif.create({
      data: {
        etapeId: parsedId.data,
        ...parsed.data,
      },
    });

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
  data: {
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis: boolean;
    texteRequis: boolean;
  },
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedIds = z
    .object({ objectifId: idSchema, etapeId: idSchema })
    .safeParse({ objectifId, etapeId });
  const parsed = objectifInputSchema.safeParse(data);

  if (!parsedIds.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.objectif.update({
      where: { id: parsedIds.data.objectifId },
      data: {
        ...parsed.data,
      },
    });

    revalidatePath(`/admin/etapes/${parsedIds.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating objectif:", error);

    return { success: false, error: "Échec de la mise à jour de l'objectif" };
  }
}

export async function deleteObjectif(objectifId: string, etapeId: string) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ objectifId: idSchema, etapeId: idSchema })
    .safeParse({ objectifId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.objectif.delete({
      where: { id: parsed.data.objectifId },
    });

    revalidatePath(`/admin/etapes/${parsed.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting objectif:", error);

    return { success: false, error: "Échec de la suppression de l'objectif" };
  }
}

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
  if (!(await authorizeRole("ADMIN"))) {
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
  if (!(await authorizeRole("ADMIN"))) {
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
  if (!(await authorizeRole("ADMIN"))) {
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
