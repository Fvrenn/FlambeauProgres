"use server";

import { prisma } from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { revalidatePath } from "next/cache";

/**
 * Crée ou met à jour une notification pour les référents d'une étape
 */
async function notifyReferents(etapeId: string, justificationId: string, chefName: string) {
  try {
    // Récupérer tous les référents assignés à cette étape
    const etapeReferents = await prisma.etapeReferent.findMany({
      where: { etapeId },
      include: { referent: true, etape: true },
    });

    if (etapeReferents.length === 0) {
      console.warn(`Aucun référent trouvé pour l'étape ${etapeId}`);
      return;
    }

    // Créer une notification pour chaque référent
    const notifications = etapeReferents.map((er) => ({
      destinataireId: er.referent.id,
      justificationId,
      type: "NOUVELLE_JUSTIFICATION" as const,
      titre: "Nouvelle réalisation à valider",
      message: `${chefName} a soumis une nouvelle réalisation pour l'étape "${er.etape.name}".`,
      lue: false,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    console.log(`${notifications.length} notification(s) créée(s) pour la justification ${justificationId}`);
  } catch (error) {
    console.error("Erreur lors de la création des notifications:", error);
    // On ne fait pas échouer la requête principale si les notifications échouent
  }
}

export async function submitRealisation(
  objectifId: string,
  contenu: string,
  file?: File
) {
  try {
    // Récupérer l'utilisateur connecté
    const user = await getUser();

    if (!user) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier que l'objectif existe et est bien de type REALISATION
    const objectif = await prisma.objectif.findUnique({
      where: { id: objectifId },
      include: { etape: true },
    });

    if (!objectif) {
      return { success: false, error: "Objectif non trouvé" };
    }

    if (objectif.type !== "REALISATION") {
      return {
        success: false,
        error: "Cet objectif n'est pas une réalisation",
      };
    }

    // Gestion de l'upload du fichier
    let fichierUrl: string | null = null;
    let fichierData: any = null;

    if (file) {
      const fs = require("node:fs/promises");
      const path = require("node:path");

      // Créer le dossier d'upload s'il n'existe pas
      const uploadDir = path.join(process.cwd(), "public", "uploads", "justifications");
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);

      // Écrire le fichier
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // URL publique pour l'accès au fichier
      fichierUrl = `/uploads/justifications/${fileName}`;

      fichierData = {
        nomOriginal: file.name,
        nomStockage: fileName,
        cheminFichier: fichierUrl,
        type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
        mimeType: file.type,
        taille: file.size,
      };
    }

    // Vérifier s'il existe déjà une justification pour cet objectif et cet utilisateur
    const existingJustification = await prisma.justification.findFirst({
      where: {
        objectifId,
        chefId: user.id,
      },
    });

    let justificationId: string;

    if (existingJustification) {
      // Mettre à jour la justification existante
      const updated = await prisma.justification.update({
        where: { id: existingJustification.id },
        data: {
          contenu,
          statut: "SOUMISE",
          soumiseAt: new Date(),
        },
      });
      justificationId = updated.id;

      // TODO: Si un fichier existe, le créer dans la table Fichier
      if (fichierData) {
        await prisma.fichier.create({
          data: {
            justificationId: updated.id,
            ...fichierData,
          },
        });
      }
    } else {
      // Créer une nouvelle justification avec statut SOUMISE
      const created = await prisma.justification.create({
        data: {
          objectifId,
          chefId: user.id,
          etapeId: objectif.etapeId,
          contenu,
          statut: "SOUMISE",
          soumiseAt: new Date(),
        },
      });
      justificationId = created.id;

      // TODO: Si un fichier existe, le créer dans la table Fichier
      if (fichierData) {
        await prisma.fichier.create({
          data: {
            justificationId: created.id,
            ...fichierData,
          },
        });
      }
    }

    // Créer les notifications pour les référents
    await notifyReferents(objectif.etapeId, justificationId, user.name);

    // Revalider la page dashboard pour rafraîchir les données
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la soumission de la réalisation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission",
    };
  }
}
