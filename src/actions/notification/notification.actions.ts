"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { NotificationService } from "@/services/notification.service";

export async function getMyNotifications() {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return NotificationService.getForUser(user.id);
}

export async function markNotificationAsRead(notificationId: string) {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    await NotificationService.markAsRead(notificationId, user.id);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification:", error);

    return { success: false, error: "Erreur serveur" };
  }
}

export async function markAllNotificationsAsRead() {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    await NotificationService.markAllAsRead(user.id);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors du marquage de toutes les notifications comme lues:",
      error,
    );

    return { success: false, error: "Erreur serveur" };
  }
}

export async function markNotificationsAsReadForJustification(
  justificationId: string,
) {
  const user = await getUser();

  if (!user) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    await NotificationService.markAsReadForJustification(
      user.id,
      justificationId,
    );
    revalidatePath("/referent/dashboard");

    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors du marquage des notifications pour la justification:",
      error,
    );

    return { success: false, error: "Erreur serveur" };
  }
}
