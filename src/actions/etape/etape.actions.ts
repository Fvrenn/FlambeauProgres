"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export async function validateEtape(chefId: string, etapeId: string) {
  try {
    const user = await getUser();
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    const [etape, chef] = await Promise.all([
      prisma.etape.findUnique({ where: { id: etapeId } }),
      prisma.user.findUnique({ where: { id: chefId } }),
    ]);

    if (!etape || !chef) {
      return { success: false, error: "Étape ou Chef introuvable" };
    }

    const assignation = await prisma.etapeReferent.findFirst({
      where: {
        referentId: user.id,
        etapeId: etapeId,
      },
    });

    if (!assignation) {
      return {
        success: false,
        error: "Vous n'êtes pas référent de cette étape",
      };
    }

    await prisma.chefEtapeStatut.upsert({
      where: {
        chefId_etapeId: {
          chefId: chefId,
          etapeId: etapeId,
        },
      },
      update: {
        statut: "VALIDE",
        valideeAt: new Date(),
        valideeParId: user.id,
      },
      create: {
        chefId: chefId,
        etapeId: etapeId,
        statut: "VALIDE",
        valideeAt: new Date(),
        valideeParId: user.id,
      },
    });

    await prisma.notification.create({
      data: {
        destinataireId: chefId,
        type: "ETAPE_COMPLETE",
        titre: "Badge validé !",
        message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par votre référent. Vous pouvez le coudre sur votre chemise !`,
      },
    });

    revalidatePath(`/referent/dashboard?etapeId=${etapeId}`);
  } catch (error) {
    console.error("Erreur lors de la validation finale de l'étape:", error);
    return { success: false, error: "Erreur serveur" };
  }

  redirect(`/referent/dashboard?etapeId=${etapeId}`);
}