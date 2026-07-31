import {
  Prisma,
  type MessageType,
  type StatutJustification,
  type UserRole,
} from "@prisma/client";

import prisma from "@/lib/prisma";
import { canAccessJustification } from "@/lib/auth-guards";
import { NotificationService } from "@/services/notification.service";
import { EmailService } from "@/services/email.service";
import { chefThreadUrl, referentThreadUrl } from "@/lib/links";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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

export type ThreadData = {
  justificationId: string;
  statut: StatutJustification;
  objectif: { code: string; description: string };
  chef: { id: string; name: string };
  messages: ThreadMessage[];
};

type JustificationForNotify = Prisma.JustificationGetPayload<{
  include: {
    objectif: { select: { code: true; description: true } };
    etape: { select: { name: true } };
    chef: { select: { name: true; email: true } };
  };
}>;

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
        objectif: { select: { code: true, description: true } },
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
        objectif: { select: { code: true, description: true } },
        etape: { select: { name: true } },
        chef: { select: { name: true, email: true } },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    if (["VALIDEE", "AUTO_VALIDEE"].includes(justification.statut)) {
      return {
        success: false,
        error: "Cette réalisation est validée, le fil est clôturé",
      };
    }

    const fromChef = justification.chefId === viewerId;

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

    await this.notifyNewMessage(justification, fromChef, {
      authorName,
      messageText: trimmed,
    });

    return { success: true, data: message };
  }

  static async validateRealisation(input: {
    referentId: string;
    referentName: string;
    justificationId: string;
  }): Promise<ServiceResult<ThreadMessage>> {
    const { referentId, referentName, justificationId } = input;

    const justification = await prisma.justification.findUnique({
      where: { id: justificationId },
      include: {
        objectif: { select: { code: true, description: true } },
        etape: { select: { name: true } },
        chef: { select: { name: true, email: true } },
      },
    });

    if (!justification) {
      return { success: false, error: "Justification introuvable" };
    }

    const assignation = await prisma.etapeReferent.findFirst({
      where: { referentId, etapeId: justification.etapeId },
    });

    if (!assignation) {
      return {
        success: false,
        error: "Vous n'êtes pas référent de cette étape",
      };
    }

    if (justification.statut === "VALIDEE") {
      return { success: false, error: "Cette réalisation est déjà validée" };
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await this.addMessage(tx, {
        justificationId,
        auteurId: referentId,
        contenu: "✓ Réalisation validée",
        type: "SYSTEM",
      });

      await tx.justification.update({
        where: { id: justificationId },
        data: { statut: "VALIDEE", valideeAt: new Date() },
      });

      return created;
    });

    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId,
      type: "JUSTIFICATION_VALIDEE",
      titre: "Réalisation validée !",
      message: `Votre réalisation "${justification.objectif.code}" a été validée par votre référent.`,
    });

    await EmailService.sendValidation({
      to: justification.chef.email,
      chefName: justification.chef.name,
      referentName,
      etapeName: justification.etape.name,
      objectifCode: justification.objectif.code,
      objectifDescription: justification.objectif.description,
      viewUrl: chefThreadUrl(justificationId),
      justificationId,
    });

    return { success: true, data: message };
  }

  private static async notifyNewMessage(
    justification: JustificationForNotify,
    fromChef: boolean,
    ctx: { authorName: string; messageText: string | null },
  ) {
    if (fromChef) {
      const referents = await prisma.etapeReferent.findMany({
        where: { etapeId: justification.etapeId },
        select: {
          referent: { select: { id: true, name: true, email: true } },
        },
      });

      if (referents.length === 0) {
        return;
      }

      await prisma.notification.createMany({
        data: referents.map((er) => ({
          destinataireId: er.referent.id,
          justificationId: justification.id,
          type: "NOUVEAU_COMMENTAIRE" as const,
          titre: "Nouveau message du chef",
          message: `${ctx.authorName} a répondu pour "${justification.objectif.code}".`,
          lue: false,
        })),
      });

      const replyUrl = referentThreadUrl(
        justification.etapeId,
        justification.id,
      );

      await Promise.all(
        referents.map((er) =>
          EmailService.sendNewMessage({
            to: er.referent.email,
            authorName: ctx.authorName,
            etapeName: justification.etape.name,
            objectifCode: justification.objectif.code,
            messageText: ctx.messageText,
            replyUrl,
            justificationId: justification.id,
          }),
        ),
      );

      return;
    }

    await NotificationService.createNotification({
      destinataireId: justification.chefId,
      justificationId: justification.id,
      type: "DEMANDE_PRECISION",
      titre: "Demande de précisions",
      message: `Votre référent a écrit au sujet de "${justification.objectif.code}".`,
    });

    await EmailService.sendNewMessage({
      to: justification.chef.email,
      authorName: ctx.authorName,
      etapeName: justification.etape.name,
      objectifCode: justification.objectif.code,
      messageText: ctx.messageText,
      replyUrl: chefThreadUrl(justification.id),
      justificationId: justification.id,
    });
  }
}
