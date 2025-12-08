"use client";

import React, { useTransition } from "react";
import { type Notification, TypeNotification } from "@prisma/client";
import { Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/actions/notification/notification.actions";

type NotificationPanelProps = {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
};

// Configuration pour l'affichage des notifications
const NOTIFICATION_CONFIG: Record<
  TypeNotification,
  { icon: string; color: "success" | "danger" | "warning" | "primary" }
> = {
  ETAPE_COMPLETE: { icon: "solar:verified-check-bold", color: "success" },
  JUSTIFICATION_VALIDEE: {
    icon: "solar:check-read-linear",
    color: "success",
  },
  JUSTIFICATION_REFUSEE: {
    icon: "solar:close-circle-linear",
    color: "danger",
  },
  DEMANDE_PRECISION: {
    icon: "solar:question-circle-linear",
    color: "warning",
  },
  // Types futurs ou non utilisés par le Chef pour l'instant
  NOUVELLE_JUSTIFICATION: {
    icon: "solar:document-add-linear",
    color: "primary",
  },
  REPONSE_PRECISION: { icon: "solar:chat-round-dots-linear", color: "primary" },
  JUSTIFICATION_URGENTE: {
    icon: "solar:danger-circle-linear",
    color: "danger",
  },
  NOUVEAU_COMMENTAIRE: {
    icon: "solar:chat-line-linear",
    color: "primary",
  },
};

export default function NotificationPanel({
  notifications,
  onNotificationClick,
}: NotificationPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
    });
  };

  const handleMarkOneAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsRead(id);
    });
  };

  const unreadCount = notifications.filter((n) => !n.lue).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-default-200">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="flat"
            onPress={handleMarkAllAsRead}
            isLoading={isPending}
            startContent={
              !isPending && <Icon icon="solar:check-read-linear" />
            }
          >
            Tout marquer comme lu ({unreadCount})
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-default-500">
          <Icon icon="solar:bell-off-linear" className="text-6xl mb-4" />
          <p className="font-semibold">Aucune notification</p>
          <p className="text-sm">
            Les nouvelles importantes apparaîtront ici.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => {
            const config =
              NOTIFICATION_CONFIG[notif.type] ||
              NOTIFICATION_CONFIG.NOUVEAU_COMMENTAIRE;
            return (
              <li
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer hover:bg-default-100 ${
                  notif.lue
                    ? "bg-default-50"
                    : "bg-primary-50 border border-primary-200"
                }`}
                onClick={() => onNotificationClick(notif)}
              >
                <div
                  className={`mt-1 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-${config.color}/10 text-${config.color}`}
                >
                  <Icon icon={config.icon} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notif.titre}</p>
                  <p className="text-sm text-default-600">{notif.message}</p>
                  <p className="text-xs text-default-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notif.lue && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Marquer comme lu"
                    onPress={() => handleMarkOneAsRead(notif.id)}
                    isLoading={isPending}
                  >
                    <Icon icon="solar:check-circle-linear" className="text-xl" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}