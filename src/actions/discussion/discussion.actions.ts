"use server";

import { z } from "zod";

import { getUser } from "@/lib/auth-server";
import { estReferent } from "@/lib/roles";
import { LONGUEUR_MAX_CONTENU } from "@/lib/justification";
import { StorageService } from "@/services/storage.service";
import { DiscussionService } from "@/services/discussion.service";

const justificationIdSchema = z.string().min(1);
const contenuSchema = z.string().max(LONGUEUR_MAX_CONTENU).optional();

export async function getThread(justificationId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    if (!justificationIdSchema.safeParse(justificationId).success) {
      return { success: false as const, error: "Données invalides" };
    }

    const role = "role" in user ? user.role : undefined;

    return await DiscussionService.getThread(user.id, role, justificationId);
  } catch (error) {
    console.error("Erreur lors du chargement de la discussion:", error);

    return { success: false as const, error: "Erreur serveur" };
  }
}

export async function postMessage(
  justificationId: string,
  contenu?: string,
  file?: File,
) {
  try {
    const user = await getUser();

    if (!user) {
      return { success: false as const, error: "Non authentifié" };
    }

    const parsed = z
      .object({
        justificationId: justificationIdSchema,
        contenu: contenuSchema,
      })
      .safeParse({ justificationId, contenu });

    if (!parsed.success) {
      return { success: false as const, error: "Données invalides" };
    }

    const pieceJointe = await DiscussionService.stockerPieceJointe(file);

    if (!pieceJointe.success) {
      return pieceJointe;
    }

    const fichierData = pieceJointe.data;

    const role = "role" in user ? user.role : undefined;

    try {
      const result = await DiscussionService.postMessage({
        viewerId: user.id,
        viewerRole: role,
        authorName: user.name,
        justificationId: parsed.data.justificationId,
        contenu: parsed.data.contenu ?? null,
        fichierData,
      });

      if (!result.success && fichierData) {
        await StorageService.deleteFile(fichierData.cheminFichier);
      }

      return result;
    } catch (serviceError) {
      if (fichierData) {
        await StorageService.deleteFile(fichierData.cheminFichier);
      }

      throw serviceError;
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);

    return { success: false as const, error: "Erreur serveur" };
  }
}

export async function validateRealisation(justificationId: string) {
  try {
    const user = await getUser();

    if (!user || !("role" in user) || !estReferent(user.role)) {
      return { success: false as const, error: "Non autorisé" };
    }

    const parsed = justificationIdSchema.safeParse(justificationId);

    if (!parsed.success) {
      return { success: false as const, error: "Données invalides" };
    }

    return await DiscussionService.validateRealisation({
      referentId: user.id,
      referentName: user.name,
      referentRole: user.role,
      justificationId: parsed.data,
    });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);

    return { success: false as const, error: "Erreur serveur" };
  }
}
