import { type TypeNotification } from "@prisma/client";

import { prisma } from "@/lib/prisma";

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

  static async notifyReferentsOfNewJustification(
    etapeId: string,
    justificationId: string,
    chefName: string,
  ) {
    try {
      const etapeReferents = await prisma.etapeReferent.findMany({
        where: { etapeId },
        include: { referent: true, etape: true },
      });

      if (etapeReferents.length === 0) {
        console.warn(`Aucun référent trouvé pour l'étape ${etapeId}`);

        return;
      }

      const notifications = etapeReferents.map((er) => ({
        destinataireId: er.referent.id,
        justificationId,
        type: "NOUVELLE_JUSTIFICATION" as const,
        titre: "Nouvelle réalisation à valider",
        message: `${chefName} a soumis une nouvelle réalisation pour l'étape "${er.etape.name}".`,
        lue: false,
      }));

      await prisma.notification.createMany({ data: notifications });
    } catch (error) {
      console.error("Erreur lors de la création des notifications:", error);
    }
  }
}
