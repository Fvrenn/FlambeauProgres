import type { ServiceResult } from "@/types";

import {
  Prisma,
  type MessageType,
  type StatutJustification,
  type UserRole,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { canAccessJustification } from "@/lib/auth-guards";
import {
  estNiveauEtape3,
  messageRefusEvaluation,
  peutEvaluerEtape,
} from "@/lib/roles";
import { LIBELLE_TYPE_OBJECTIF, TITRE_VALIDATION } from "@/lib/justification";
import { EtapeService } from "@/services/etape.service";
import { NotificationService } from "@/services/notification.service";

export type FichierData = {
  nomOriginal: string;
  nomStockage: string;
  cheminFichier: string;
  type: "IMAGE" | "DOCUMENT";
  mimeType: string;
  taille: number;
};

export type ThreadMessage = Prisma.MessageGetPayload<{
  include: { auteur: true; fichier: true };
}>;

type ThreadData = {
  justificationId: string;
  statut: StatutJustification;
  objectif: { code: string; description: string };
  chef: { id: string; name: string };
  messages: ThreadMessage[];
};

export class DiscussionService {
  static addMessage(
    tx: Prisma.TransactionClient,
    input: {
      justificationId: string;
      auteurId: string;
      contenu: string | null;
      type: MessageType;
      fichierData?: FichierData | null;
    },
  ): Promise<ThreadMessage> {
    const { justificationId, auteurId, contenu, type, fichierData } = input;

    return tx.message.create({
      data: {
        justificationId,
        auteurId,
        contenu,
        type,
        fichier: fichierData
          ? { create: { justificationId, ...fichierData } }
          : undefined,
      },
      include: { auteur: true, fichier: true },
    });
  }

  static async getThread(
    viewerId: string,
    viewerRole: UserRole | undefined,
    justificationId: string,
  ): Promise<ServiceResult<ThreadData>> {
    const allowed = await canAccessJustification(
      viewerId,
      viewerRole,
      justificationId,
    );

    if (!allowed) {
      return { success: false, error: "Accès refusé" };
    }

    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        chef: { select: { id: true, name: true } },
        objectif: { select: { code: true, description: true, type: true } },
        messages: {
          include: { auteur: true, fichier: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    return {
      success: true,
      data: {
        justificationId: justification.id,
        statut: justification.statut,
        objectif: justification.objectif,
        chef: justification.chef,
        messages: justification.messages,
      },
    };
  }

  static async postMessage(input: {
    viewerId: string;
    viewerRole: UserRole | undefined;
    authorName: string;
    justificationId: string;
    contenu?: string | null;
    fichierData?: FichierData | null;
  }): Promise<ServiceResult<ThreadMessage>> {
    const {
      viewerId,
      viewerRole,
      authorName,
      justificationId,
      contenu,
      fichierData,
    } = input;

    const trimmed = contenu?.trim() || null;

    if (!trimmed && !fichierData) {
      return { success: false, error: "Le message ne peut pas être vide" };
    }

    const allowed = await canAccessJustification(
      viewerId,
      viewerRole,
      justificationId,
    );

    if (!allowed) {
      return { success: false, error: "Accès refusé" };
    }

    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { select: { code: true, description: true, type: true } },
        etape: { select: { name: true, niveau: true } },
        chef: { select: { name: true, email: true } },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    if (["VALIDEE", "AUTO_VALIDEE"].includes(justification.statut)) {
      return {
        success: false,
        error: `Cette ${LIBELLE_TYPE_OBJECTIF[justification.objectif.type]} est validée, le fil est clôturé`,
      };
    }

    const fromChef = justification.chefId === viewerId;

    if (
      !fromChef &&
      !(await estEvaluateur(viewerId, viewerRole, justification))
    ) {
      return {
        success: false,
        error: messageRefusEvaluation(justification.etape.niveau),
      };
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await this.addMessage(tx, {
        justificationId,
        auteurId: viewerId,
        contenu: trimmed,
        type: "USER",
        fichierData,
      });

      await tx.justification.update({
        where: { id: justificationId },
        data: {
          statut: fromChef ? "SOUMISE" : "DEMANDE_PRECISION",
          ...(fromChef ? { soumiseAt: new Date() } : {}),
        },
      });

      return created;
    });

    const nouveauMessage = { auteur: authorName, texte: trimmed };

    if (fromChef) {
      await NotificationService.notifierMessageDuChef(
        justification,
        nouveauMessage,
      );
    } else {
      await NotificationService.notifierMessageAuChef(
        justification,
        nouveauMessage,
      );
    }

    return { success: true, data: message };
  }

  static async validateRealisation(input: {
    referentId: string;
    referentName: string;
    referentRole: UserRole | undefined;
    justificationId: string;
  }): Promise<ServiceResult<ThreadMessage>> {
    const { referentId, referentName, referentRole, justificationId } = input;

    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { select: { code: true, description: true, type: true } },
        etape: { select: { name: true, niveau: true } },
        chef: { select: { name: true, email: true } },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    if (!(await estEvaluateur(referentId, referentRole, justification))) {
      return {
        success: false,
        error: messageRefusEvaluation(justification.etape.niveau),
      };
    }

    if (justification.chefId === referentId) {
      return {
        success: false,
        error: "Vous ne pouvez pas valider votre propre travail",
      };
    }

    if (justification.statut === "VALIDEE") {
      return {
        success: false,
        error: `Cette ${LIBELLE_TYPE_OBJECTIF[justification.objectif.type]} est déjà validée`,
      };
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await this.addMessage(tx, {
        justificationId,
        auteurId: referentId,
        contenu: `✓ ${TITRE_VALIDATION[justification.objectif.type]}`,
        type: "SYSTEM",
      });

      await tx.justification.update({
        where: { id: justificationId },
        data: {
          statut: "VALIDEE",
          valideeAt: new Date(),
          valideeParId: referentId,
        },
      });

      return created;
    });

    await NotificationService.notifierValidation(justification, referentName);

    if (
      estNiveauEtape3(justification.etape.niveau) &&
      (await EtapeService.estDossierComplet(
        justification.chefId,
        justification.etapeId,
      ))
    ) {
      await NotificationService.notifierDossierAValider({
        chefId: justification.chefId,
        chefName: justification.chef.name,
        etape: { id: justification.etapeId, name: justification.etape.name },
      });
    }

    return { success: true, data: message };
  }
}

async function estEvaluateur(
  userId: string,
  role: UserRole | undefined,
  justification: { etapeId: string; etape: { niveau: number } },
): Promise<boolean> {
  const assignation = await prisma.etapeReferent.findFirst({
    where: { referentId: userId, etapeId: justification.etapeId },
  });

  return peutEvaluerEtape(
    role,
    justification.etape.niveau,
    Boolean(assignation),
  );
}
