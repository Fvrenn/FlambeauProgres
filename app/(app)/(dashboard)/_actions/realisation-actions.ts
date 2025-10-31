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

    // TODO: Gérer l'upload du fichier ici
    // Une fois que l'infrastructure est décidée (Vercel Blob, S3, local, etc.)
    // 1. Uploader le fichier vers le service choisi
    // 2. Récupérer l'URL/chemin du fichier uploadé
    // 3. Créer une entrée dans la table `Fichier` avec ces informations
    
    let fichierUrl: string | null = null;
    let fichierData: any = null;

    if (file) {
      // PLACEHOLDER pour l'upload de fichier
      // Exemples d'implémentation selon le service :
      
      // Option 1: Vercel Blob
      // const blob = await put(file.name, file, { access: 'public' });
      // fichierUrl = blob.url;

      // Option 2: AWS S3
      // const uploadResult = await s3.upload({ Bucket: 'bucket', Key: file.name, Body: file });
      // fichierUrl = uploadResult.Location;

      // Option 3: Local (dev uniquement)
      // const buffer = await file.arrayBuffer();
      // await writeFile(`./uploads/${file.name}`, Buffer.from(buffer));
      // fichierUrl = `/uploads/${file.name}`;

      // Pour l'instant, on stocke juste les métadonnées du fichier
      fichierData = {
        nomOriginal: file.name,
        nomStockage: `placeholder-${Date.now()}-${file.name}`, // À remplacer
        cheminFichier: "TODO: URL après upload", // À remplacer
        type: file.type.startsWith("image/") ? "IMAGE" : "DOCUMENT",
        mimeType: file.type,
        taille: file.size,
      };

      console.warn(
        "⚠️ Upload de fichier non implémenté. Fichier reçu:",
        file.name,
        `(${file.size} bytes)`
      );
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
