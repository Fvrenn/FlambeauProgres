"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth-server";
import { NotificationService } from "@/services/notification.service";

const idSchema = z.string().min(1);

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

  const parsed = idSchema.safeParse(notificationId);

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await NotificationService.markAsRead(parsed.data, user.id);
    revalidatePath("/");

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
    revalidatePath("/");

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

  const parsed = idSchema.safeParse(justificationId);

  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }

  try {
    await NotificationService.markAsReadForJustification(user.id, parsed.data);
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
