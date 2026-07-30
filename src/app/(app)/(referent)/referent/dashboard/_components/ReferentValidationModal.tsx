"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  User,
} from "@heroui/react";

import DiscussionThread from "@/components/discussion/DiscussionThread";
import { markNotificationsAsReadForJustification } from "@/actions/notification/notification.actions";

export type ReferentThreadJustification = {
  id: string;
  chef: { name: string; email: string; image: string | null };
  objectif: { code: string; description: string };
};

interface ReferentValidationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  justification: ReferentThreadJustification | null;
}

export default function ReferentValidationModal({
  isOpen,
  onOpenChange,
  justification,
}: ReferentValidationModalProps) {
  useEffect(() => {
    if (isOpen && justification) {
      markNotificationsAsReadForJustification(justification.id);
    }
  }, [isOpen, justification]);

  if (!justification) return null;

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="h-[80vh]">
        <ModalHeader className="border-b border-default-100">
          <User
            avatarProps={{
              src: justification.chef.image || undefined,
              name: justification.chef.name.charAt(0).toUpperCase(),
              className: "w-10 h-10 text-sm",
            }}
            description={
              <p className="text-xs text-default-500">
                {justification.chef.email}
              </p>
            }
            name={
              <span className="text-base font-bold text-foreground">
                {justification.chef.name}
              </span>
            }
          />
        </ModalHeader>

        <ModalBody className="overflow-hidden p-0">
          <DiscussionThread
            justificationId={justification.id}
            objectif={{
              code: justification.objectif.code,
              description: justification.objectif.description,
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
