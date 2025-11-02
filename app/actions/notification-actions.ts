"use server";

import { getUser } from "@/src/lib/auth-server";
import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Récupère les notifications pour l'utilisateur actuellement connecté.
 */
export async function getMyNotifications() {
  const user = await getUser();

  if (!user) {
    // Devrait être géré par le layout parent, mais sécurité d'abord.
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      destinataireId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    // On inclut la justification et son objectif pour pouvoir créer des liens pertinents plus tard
    include: {
      justification: {
        select: {
          id: true,
          objectif: {
            select: {
              id: true,
              etapeId: true,
            },
          },
        },
      },
    },
  });

  return notifications;
}

/**
 * Marque une notification spécifique comme lue.
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        lue: true,
        lueAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Marque toutes les notifications non lues de l'utilisateur comme lues.
 */
export async function markAllNotificationsAsRead() {
  const user = await getUser();
  if (!user) return { success: false, error: "Non autorisé" };

  try {
    await prisma.notification.updateMany({
      where: {
        destinataireId: user.id,
        lue: false,
      },
      data: {
        lue: true,
        lueAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors du marquage de toutes les notifications comme lues:",
      error
    );
    return { success: false, error: "Erreur serveur" };
  }
}