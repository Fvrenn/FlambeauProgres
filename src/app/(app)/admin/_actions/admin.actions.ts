"use server";

import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// --- USERS ---

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function updateUserTroupe(userId: string, troupeId: string | null) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { troupeId },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user troupe:", error);
    return { success: false, error: "Failed to update user troupe" };
  }
}

// --- TROUPES ---

export async function createTroupe(name: string, chefId?: string) {
  try {
    // Transaction to create troupe and assign chef if provided
    await prisma.$transaction(async (tx) => {
      const troupe = await tx.troupe.create({
        data: { nom: name },
      });

      if (chefId) {
        await tx.user.update({
          where: { id: chefId },
          data: { troupeId: troupe.id },
        });
      }
    });
    revalidatePath("/admin/troupes");
    return { success: true };
  } catch (error) {
    console.error("Error creating troupe:", error);
    return { success: false, error: "Failed to create troupe" };
  }
}

export async function updateTroupe(troupeId: string, name: string, chefId?: string) {
  try {
     await prisma.$transaction(async (tx) => {
      await tx.troupe.update({
        where: { id: troupeId },
        data: { nom: name },
      });

      if (chefId) {
         // First, remove current chef if any (optional logic depending on requirements, 
         // but usually a troupe has one main chef, though the model allows many members.
         // For now, we just add the user to the troupe)
        await tx.user.update({
          where: { id: chefId },
          data: { troupeId: troupeId },
        });
      }
    });
    revalidatePath("/admin/troupes");
    return { success: true };
  } catch (error) {
    console.error("Error updating troupe:", error);
    return { success: false, error: "Failed to update troupe" };
  }
}

// --- ASSIGNATIONS (REFERENTS <-> ETAPES) ---

export async function assignReferentToEtape(referentId: string, etapeId: string) {
  try {
    await prisma.etapeReferent.create({
      data: {
        referentId,
        etapeId,
      },
    });
    revalidatePath("/admin/assignations");
    return { success: true };
  } catch (error) {
    console.error("Error assigning referent:", error);
    return { success: false, error: "Failed to assign referent" };
  }
}

export async function removeReferentFromEtape(referentId: string, etapeId: string) {
  try {
    await prisma.etapeReferent.delete({
      where: {
        referentId_etapeId: {
          referentId,
          etapeId,
        },
      },
    });
    revalidatePath("/admin/assignations");
    return { success: true };
  } catch (error) {
    console.error("Error removing referent:", error);
    return { success: false, error: "Failed to remove referent" };
  }
}

// --- ETAPES ---

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
  try {
    await prisma.etape.create({
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        ordre: data.ordre,
        objectifs: {
          create: data.objectifs,
        },
      },
    });
    revalidatePath("/admin/etapes");
    return { success: true };
  } catch (error) {
    console.error("Error creating etape:", error);
    return { success: false, error: "Failed to create etape" };
  }
}

export async function updateEtape(id: string, data: {
    number: string;
    name: string;
    description: string;
    ordre: number;
}) {
    try {
        await prisma.etape.update({
            where: { id },
            data: {
                number: data.number,
                name: data.name,
                description: data.description,
                ordre: data.ordre,
            }
        });
        revalidatePath("/admin/etapes");
        revalidatePath(`/admin/etapes/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating etape:", error);
        return { success: false, error: "Failed to update etape" };
    }
}

export async function updateEtapeBadge(etapeId: string, imageSrc: string) {
    try {
        await prisma.etape.update({
            where: { id: etapeId },
            data: { image_src: imageSrc }
        });
        revalidatePath("/admin/etapes");
        return { success: true };
    } catch (error) {
        console.error("Error updating etape badge:", error);
        return { success: false, error: "Failed to update etape badge" };
    }
}

// --- OBJECTIFS ---

export async function createObjectif(etapeId: string, data: { code: string; description: string; type: "COMPETENCE" | "REALISATION"; fichiersRequis: boolean }) {
  try {
    await prisma.objectif.create({
      data: {
        etapeId,
        ...data,
      },
    });
    revalidatePath(`/admin/etapes/${etapeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating objectif:", error);
    return { success: false, error: "Failed to create objectif" };
  }
}

export async function updateObjectif(objectifId: string, etapeId: string, data: { code: string; description: string; type: "COMPETENCE" | "REALISATION"; fichiersRequis: boolean }) {
  try {
    await prisma.objectif.update({
      where: { id: objectifId },
      data: {
        ...data,
      },
    });
    revalidatePath(`/admin/etapes/${etapeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating objectif:", error);
    return { success: false, error: "Failed to update objectif" };
  }
}

export async function deleteObjectif(objectifId: string, etapeId: string) {
  try {
    await prisma.objectif.delete({
      where: { id: objectifId },
    });
    revalidatePath(`/admin/etapes/${etapeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting objectif:", error);
    return { success: false, error: "Failed to delete objectif" };
  }
}
