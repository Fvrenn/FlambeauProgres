"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

/**
 * Valide un badge complet pour un Chef après revue finale par un Référent.
 */
export async function validateEtape(chefId: string, etapeId: string) {
  try {
    // 1. Vérifier que l'utilisateur est bien un Référent
    const user = await getUser();
    if (!user || !("role" in user) || user.role !== "REFERENT") {
      return { success: false, error: "Non autorisé" };
    }

    // 2. Récupérer l'étape et le chef pour les informations
    const [etape, chef] = await Promise.all([
      prisma.etape.findUnique({ where: { id: etapeId } }),
      prisma.user.findUnique({ where: { id: chefId } }),
    ]);

    if (!etape || !chef) {
      return { success: false, error: "Étape ou Chef introuvable" };
    }

    // 3. Vérifier que le Référent est bien assigné à cette étape
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

    // 4. Mettre à jour le statut du badge pour le chef
    // On utilise upsert pour créer l'entrée si elle n'existe pas, ou la mettre à jour sinon.
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

    // 5. Créer une notification pour le Chef
    await prisma.notification.create({
      data: {
        destinataireId: chefId,
        type: "ETAPE_COMPLETE",
        titre: "Badge validé !",
        message: `Félicitations ! Votre badge "${etape.name}" a été officiellement validé par votre référent. Vous pouvez le coudre sur votre chemise !`,
      },
    });

    // 6. Revalider le dashboard du référent
    revalidatePath(`/referent/dashboard?etapeId=${etapeId}`);
  } catch (error) {
    console.error("Erreur lors de la validation finale de l'étape:", error);
    return { success: false, error: "Erreur serveur" };
  }

  // 7. Rediriger le référent vers son dashboard
  redirect(`/referent/dashboard?etapeId=${etapeId}`);
}