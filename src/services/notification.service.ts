import { type Objectif, type TypeNotification } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { estNiveauEtape3 } from "@/lib/roles";
import { EmailService } from "@/services/email.service";
import {
  chefThreadUrl,
  referentRevisionUrl,
  referentThreadUrl,
} from "@/lib/links";
import { LIBELLE_TYPE_OBJECTIF, TITRE_VALIDATION } from "@/lib/justification";

type DestinataireEtape = {
  id: string;
  name: string;
  email: string;
};

type JustificationANotifier = {
  id: string;
  chefId: string;
  etapeId: string;
  objectif: Pick<Objectif, "code" | "description" | "type">;
  etape: { name: string; niveau: number };
  chef: { name: string; email: string };
};

type NouveauMessage = { auteur: string; texte: string | null };

export class NotificationService {
  static async createNotification(data: {
    destinataireId: string;
    justificationId?: string;
    type: TypeNotification;
    titre: string;
    message: string;
  }) {
    return prisma.notification.create({
      data: {
        destinataireId: data.destinataireId,
        justificationId: data.justificationId,
        type: data.type,
        titre: data.titre,
        message: data.message,
        lue: false,
      },
    });
  }

  static async getForUser(userId: string) {
    return prisma.notification.findMany({
      where: { destinataireId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        justification: {
          select: {
            id: true,
            objectif: { select: { id: true, etapeId: true } },
          },
        },
      },
    });
  }

  static async getSignature(userId: string): Promise<string> {
    const [derniere, nonLues] = await Promise.all([
      prisma.notification.findFirst({
        where: { destinataireId: userId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      }),
      prisma.notification.count({
        where: { destinataireId: userId, lue: false },
      }),
    ]);

    return `${derniere?.id ?? ""}:${nonLues}`;
  }

  static async markAsRead(notificationId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { id: notificationId, destinataireId: userId },
      data: { lue: true, lueAt: new Date() },
    });
  }

  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { destinataireId: userId, lue: false },
      data: { lue: true, lueAt: new Date() },
    });
  }

  static async markAsReadForJustification(
    userId: string,
    justificationId: string,
  ) {
    await prisma.notification.updateMany({
      where: {
        justificationId,
        destinataireId: userId,
        lue: false,
        type: { in: ["NOUVEAU_COMMENTAIRE", "REPONSE_PRECISION"] },
      },
      data: { lue: true, lueAt: new Date() },
    });
  }

  static async getEvaluateursEtape(etapeId: string): Promise<{
    etape: { id: string; name: string; niveau: number } | null;
    evaluateurs: DestinataireEtape[];
  }> {
    const etape = await prisma.etape.findUnique({
      where: { id: etapeId },
      select: { id: true, name: true, niveau: true },
    });

    if (!etape) {
      return { etape: null, evaluateurs: [] };
    }

    const assignations = await prisma.etapeReferent.findMany({
      where: { etapeId },
      select: {
        referent: { select: { id: true, name: true, email: true } },
      },
    });

    const evaluateurs = assignations.map((assignation) => assignation.referent);

    if (estNiveauEtape3(etape.niveau)) {
      const commission = await prisma.user.findMany({
        where: { role: "COMMISSION_FORMATION" },
        select: { id: true, name: true, email: true },
      });

      for (const membre of commission) {
        if (!evaluateurs.some((evaluateur) => evaluateur.id === membre.id)) {
          evaluateurs.push(membre);
        }
      }
    }

    return { etape, evaluateurs };
  }

  static async notifyReferentsOfNewJustification(input: {
    etapeId: string;
    justificationId: string;
    chefName: string;
    objectif: Pick<Objectif, "code" | "description" | "type">;
  }) {
    const { etapeId, justificationId, chefName, objectif } = input;
    const libelle = LIBELLE_TYPE_OBJECTIF[objectif.type];

    try {
      const { etape, evaluateurs } = await this.getEvaluateursEtape(etapeId);

      if (!etape || evaluateurs.length === 0) {
        console.warn(`Aucun référent trouvé pour l'étape ${etapeId}`);

        return;
      }

      const notifications = evaluateurs.map((evaluateur) => ({
        destinataireId: evaluateur.id,
        justificationId,
        type: "NOUVELLE_JUSTIFICATION" as const,
        titre: `Nouvelle ${libelle} à valider`,
        message: `${chefName} a soumis une nouvelle ${libelle} pour l'étape "${etape.name}".`,
        lue: false,
      }));

      await prisma.notification.createMany({ data: notifications });

      await Promise.all(
        evaluateurs.map((evaluateur) =>
          EmailService.sendNewRealisation({
            to: evaluateur.email,
            chefName,
            etapeName: etape.name,
            objectifCode: objectif.code,
            objectifDescription: objectif.description,
            libelle,
            reviewUrl: referentThreadUrl(etapeId, justificationId),
            justificationId,
          }),
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la création des notifications:", error);
    }
  }

  static async notifierDossierAValider(input: {
    chefId: string;
    chefName: string;
    etape: { id: string; name: string };
  }) {
    const { chefId, chefName, etape } = input;

    try {
      const coordinateurs = await prisma.user.findMany({
        where: { role: "COORDINATEUR_NATIONAL" },
        select: { id: true, email: true },
      });

      if (coordinateurs.length === 0) {
        console.warn("Aucun Coordinateur National pour valider le dossier");

        return;
      }

      await prisma.notification.createMany({
        data: coordinateurs.map((coordinateur) => ({
          destinataireId: coordinateur.id,
          type: "DOSSIER_A_VALIDER" as const,
          titre: "Dossier prêt à valider",
          message: `La commission Formation a évalué tout le dossier de ${chefName} pour l'étape "${etape.name}".`,
          lue: false,
        })),
      });

      await Promise.all(
        coordinateurs.map((coordinateur) =>
          EmailService.sendDossierAValider({
            to: coordinateur.email,
            chefName,
            etapeName: etape.name,
            revisionUrl: referentRevisionUrl(chefId, etape.id),
          }),
        ),
      );
    } catch (error) {
      console.error(
        "Erreur lors de la notification du Coordinateur National:",
        error,
      );
    }
  }

  static async notifierMessageDuChef(
    justification: JustificationANotifier,
    message: NouveauMessage,
  ) {
    const { evaluateurs } = await this.getEvaluateursEtape(
      justification.etapeId,
    );

    if (evaluateurs.length === 0) {
      return;
    }

    await prisma.notification.createMany({
      data: evaluateurs.map((evaluateur) => ({
        destinataireId: evaluateur.id,
        justificationId: justification.id,
        type: "NOUVEAU_COMMENTAIRE" as const,
        titre: "Nouveau message du chef",
        message: `${message.auteur} a répondu pour "${justification.objectif.code}".`,
        lue: false,
      })),
    });

    const replyUrl = referentThreadUrl(justification.etapeId, justification.id);

    await Promise.all(
      evaluateurs.map((evaluateur) =>
        EmailService.sendNewMessage({
          to: evaluateur.email,
          authorName: message.auteur,
          etapeName: justification.etape.name,
          objectifCode: justification.objectif.code,
          messageText: message.texte,
          replyUrl,
          justificationId: justification.id,
        }),
      ),
    );
  }

  static async notifierMessageAuChef(
    justification: JustificationANotifier,
    message: NouveauMessage,
  ) {
    await this.createNotification({
      destinataireId: justification.chefId,
      justificationId: justification.id,
      type: "DEMANDE_PRECISION",
      titre: "Demande de précisions",
      message: `Nouveau message de ${evaluateurDe(justification.etape.niveau)} au sujet de "${justification.objectif.code}".`,
    });

    await EmailService.sendNewMessage({
      to: justification.chef.email,
      authorName: message.auteur,
      etapeName: justification.etape.name,
      objectifCode: justification.objectif.code,
      messageText: message.texte,
      replyUrl: chefThreadUrl(justification.id),
      justificationId: justification.id,
    });
  }

  static async notifierValidation(
    justification: JustificationANotifier,
    referentName: string,
  ) {
    const { type, code, description } = justification.objectif;
    const libelle = LIBELLE_TYPE_OBJECTIF[type];

    await this.createNotification({
      destinataireId: justification.chefId,
      justificationId: justification.id,
      type: "JUSTIFICATION_VALIDEE",
      titre: `${TITRE_VALIDATION[type]} !`,
      message: `Votre ${libelle} "${code}" a été validée par ${evaluateurDe(justification.etape.niveau)}.`,
    });

    await EmailService.sendValidation({
      to: justification.chef.email,
      chefName: justification.chef.name,
      referentName,
      etapeName: justification.etape.name,
      objectifCode: code,
      objectifDescription: description,
      libelle,
      viewUrl: chefThreadUrl(justification.id),
      justificationId: justification.id,
    });
  }
}

function evaluateurDe(niveau: number): string {
  return estNiveauEtape3(niveau) ? "la commission Formation" : "votre référent";
}
