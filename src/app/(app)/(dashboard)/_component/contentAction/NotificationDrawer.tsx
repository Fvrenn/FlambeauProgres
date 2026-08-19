"use client";

import { Notification } from "@prisma/client";
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import NotificationPanel from "./panels/NotificationPanel";

interface NotificationDrawerProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
}

export default function NotificationDrawer({
  notifications,
  unreadCount,
  onNotificationClick,
}: NotificationDrawerProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleNotificationClick = (notification: Notification) => {
    onClose();
    onNotificationClick(notification);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Badge
          color="danger"
          content={unreadCount}
          isInvisible={unreadCount === 0}
          shape="circle"
          size="md"
        >
          <Button
            isIconOnly
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} non lues`
                : "Notifications"
            }
            className="h-14 w-14 bg-nav-active text-white shadow-lg"
            radius="full"
            onPress={onOpen}
          >
            <Icon icon="solar:bell-bold" width={24} />
          </Button>
        </Badge>
      </div>

      <Drawer
        className="max-h-[85vh]"
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
      >
        <DrawerContent className="bg-dashboard">
          <DrawerHeader className="flex items-center gap-2">
            <Icon icon="solar:bell-bold" width={20} />
            Notifications
          </DrawerHeader>
          <DrawerBody className="pb-8">
            <NotificationPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
