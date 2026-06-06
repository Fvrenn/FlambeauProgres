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

export async function updateUserTroupe(
  userId: string,
  troupeId: string | null,
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ userId: idSchema, troupeId: idSchema.nullable() })
    .safeParse({ userId, troupeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.user.update({
      where: { id: parsed.data.userId },
      data: { troupeId: parsed.data.troupeId },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/troupes");

    return { success: true };
  } catch (error) {
    console.error("Error updating user troupe:", error);

    return { success: false, error: "Échec de la mise à jour de la troupe" };
  }
}

export async function createTroupe(name: string, chefId?: string) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ name: z.string().min(1).max(120), chefId: idSchema.optional() })
    .safeParse({ name, chefId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const troupe = await tx.troupe.create({
        data: { nom: parsed.data.name },
      });

      if (parsed.data.chefId) {
        await tx.user.update({
          where: { id: parsed.data.chefId },
          data: { troupeId: troupe.id },
        });
      }
    });

    revalidatePath("/admin/troupes");

    return { success: true };
  } catch (error) {
    console.error("Error creating troupe:", error);

    return { success: false, error: "Échec de la création de la troupe" };
  }
}

export async function updateTroupe(
  troupeId: string,
  name: string,
  chefId?: string,
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({
      troupeId: idSchema,
      name: z.string().min(1).max(120),
      chefId: idSchema.optional(),
    })
    .safeParse({ troupeId, name, chefId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.troupe.update({
        where: { id: parsed.data.troupeId },
        data: { nom: parsed.data.name },
      });

      if (parsed.data.chefId) {
        await tx.user.update({
          where: { id: parsed.data.chefId },
          data: { troupeId: parsed.data.troupeId },
        });
      }
    });

    revalidatePath("/admin/troupes");

    return { success: true };
  } catch (error) {
    console.error("Error updating troupe:", error);

    return { success: false, error: "Échec de la mise à jour de la troupe" };
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

export async function updateEtapeBadge(etapeId: string, imageSrc: string) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ etapeId: idSchema, imageSrc: z.string().min(1).max(2048) })
    .safeParse({ etapeId, imageSrc });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await prisma.etape.update({
      where: { id: parsed.data.etapeId },
      data: { image_src: parsed.data.imageSrc },
    });

    revalidatePath("/admin/etapes");

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

export async function createFormation(
  etapeId: string,
  data: { titre: string; imageUrl: string; lien: string },
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedId = idSchema.safeParse(etapeId);
  const parsed = formationInputSchema.safeParse(data);

  if (!parsedId.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.create(parsedId.data, parsed.data);

    revalidatePath(`/admin/etapes/${parsedId.data}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating formation:", error);

    return { success: false, error: "Échec de la création de la carte" };
  }
}

export async function updateFormation(
  formationId: string,
  etapeId: string,
  data: { titre: string; imageUrl: string; lien: string },
) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsedIds = z
    .object({ formationId: idSchema, etapeId: idSchema })
    .safeParse({ formationId, etapeId });
  const parsed = formationInputSchema.safeParse(data);

  if (!parsedIds.success || !parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.update(parsedIds.data.formationId, parsed.data);

    revalidatePath(`/admin/etapes/${parsedIds.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating formation:", error);

    return { success: false, error: "Échec de la mise à jour de la carte" };
  }
}

export async function deleteFormation(formationId: string, etapeId: string) {
  if (!(await authorizeRole("ADMIN"))) {
    return { success: false, error: "Non autorisé" };
  }

  const parsed = z
    .object({ formationId: idSchema, etapeId: idSchema })
    .safeParse({ formationId, etapeId });

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await FormationService.remove(parsed.data.formationId);

    revalidatePath(`/admin/etapes/${parsed.data.etapeId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting formation:", error);

    return { success: false, error: "Échec de la suppression de la carte" };
  }
}
