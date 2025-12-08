import { prisma } from "@/lib/prisma";
import { type TypeNotification, type Notification } from "@prisma/client";

export class NotificationService {
  /**
   * Crée une notification pour un utilisateur spécifique.
   */
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

  /**
   * Marque une notification comme lue.
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      // Sécurité : Vérifier que la notification appartient bien à l'utilisateur
      const notif = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notif || notif.destinataireId !== userId) {
        return false;
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { lue: true, lueAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error("Error marking notification as read", error);
      return false;
    }
  }

  /**
   * Marque toutes les notifications comme lues pour un utilisateur.
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        destinataireId: userId,
        lue: false,
      },
      data: {
        lue: true,
        lueAt: new Date(),
      },
    });
  }
}
