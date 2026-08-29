"use client";

import React, { useTransition } from "react";
import { type Notification, TypeNotification } from "@prisma/client";
import { Button } from "@heroui/react";

import { Icon } from "@/lib/icons";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/actions/notification/notification.actions";
import { clickable } from "@/lib/a11y";

type NotificationPanelProps = {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
};

const NOTIFICATION_CONFIG: Record<
  TypeNotification,
  { icon: string; iconWrapperClassName: string }
> = {
  ETAPE_COMPLETE: {
    icon: "solar:verified-check-bold",
    iconWrapperClassName: "bg-success/10 text-success",
  },
  JUSTIFICATION_VALIDEE: {
    icon: "solar:check-read-linear",
    iconWrapperClassName: "bg-success/10 text-success",
  },
  JUSTIFICATION_REFUSEE: {
    icon: "solar:close-circle-linear",
    iconWrapperClassName: "bg-danger/10 text-danger",
  },
  DEMANDE_PRECISION: {
    icon: "solar:question-circle-linear",
    iconWrapperClassName: "bg-warning/10 text-warning",
  },
  NOUVELLE_JUSTIFICATION: {
    icon: "solar:document-add-linear",
    iconWrapperClassName: "bg-nav-active/10 text-nav-active",
  },
  REPONSE_PRECISION: {
    icon: "solar:chat-round-dots-linear",
    iconWrapperClassName: "bg-nav-active/10 text-nav-active",
  },
  JUSTIFICATION_URGENTE: {
    icon: "solar:danger-circle-linear",
    iconWrapperClassName: "bg-danger/10 text-danger",
  },
  NOUVEAU_COMMENTAIRE: {
    icon: "solar:chat-line-linear",
    iconWrapperClassName: "bg-nav-active/10 text-nav-active",
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
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashboard-border">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Button
            className="bg-dashboard-tab data-[hover=true]:bg-dashboard-tab-hover"
            isLoading={isPending}
            size="sm"
            startContent={!isPending && <Icon icon="solar:check-read-linear" />}
            variant="flat"
            onPress={handleMarkAllAsRead}
          >
            Tout marquer comme lu ({unreadCount})
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-default-500">
          <Icon className="text-6xl mb-4" icon="solar:bell-off-linear" />
          <p className="font-semibold">Aucune notification</p>
          <p className="text-sm">Les nouvelles importantes apparaîtront ici.</p>
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
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                  notif.lue
                    ? "bg-dashboard-card hover:bg-dashboard-border"
                    : "bg-nav-active/10 border border-nav-active/30 hover:bg-nav-active/15"
                }`}
                {...clickable(() => onNotificationClick(notif))}
              >
                <div
                  className={`mt-1 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${config.iconWrapperClassName}`}
                >
                  <Icon className="text-xl" icon={config.icon} />
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
                    aria-label="Marquer comme lu"
                    isLoading={isPending}
                    size="sm"
                    variant="light"
                    onPress={() => handleMarkOneAsRead(notif.id)}
                  >
                    <Icon
                      className="text-xl"
                      icon="solar:check-circle-linear"
                    />
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
