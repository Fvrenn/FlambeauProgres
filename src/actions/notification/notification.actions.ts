"use server";

import { getUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMyNotifications() {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      destinataireId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
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

export async function markNotificationsAsReadForJustification(
  justificationId: string
) {
  const user = await getUser();
  if (!user) return { success: false, error: "Non autorisé" };

  try {
    await prisma.notification.updateMany({
      where: {
        justificationId: justificationId,
        destinataireId: user.id,
        lue: false,
        type: { in: ["NOUVEAU_COMMENTAIRE", "REPONSE_PRECISION"] },
      },
      data: {
        lue: true,
        lueAt: new Date(),
      },
    });

    revalidatePath("/referent/dashboard");
    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors du marquage des notifications pour la justification:",
      error
    );
    return { success: false, error: "Erreur serveur" };
  }
}