"use client";

import type { TypeObjectif } from "@prisma/client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  User,
} from "@heroui/react";

import { Icon } from "@/lib/icons";
import DiscussionThread, {
  type DiscussionViewer,
} from "@/components/discussion/DiscussionThread";
import { CLASSES_MODALE_DISCUSSION } from "@/components/discussion/types";
import { markNotificationsAsReadForJustification } from "@/actions/notification/notification.actions";

export type ReferentThreadJustification = {
  id: string;
  chefId: string;
  etapeId: string;
  chef: { name: string; email: string; image: string | null };
  objectif: { code: string; description: string; type: TypeObjectif };
};

interface ReferentValidationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  justification: ReferentThreadJustification | null;
  viewer: DiscussionViewer;
  peutEvaluer: boolean;
}

export default function ReferentValidationModal({
  isOpen,
  onOpenChange,
  justification,
  viewer,
  peutEvaluer,
}: ReferentValidationModalProps) {
  useEffect(() => {
    if (isOpen && justification) {
      markNotificationsAsReadForJustification(justification.id);
    }
  }, [isOpen, justification]);

  if (!justification) return null;

  const estSonPropreTravail = justification.chefId === viewer?.id;

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className={CLASSES_MODALE_DISCUSSION}>
        <ModalHeader className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-dashboard-border pr-12">
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
          <Button
            as={Link}
            className="bg-dashboard-tab data-[hover=true]:bg-dashboard-tab-hover"
            href={`/referent/revision?chefId=${justification.chefId}&etapeId=${justification.etapeId}`}
            size="sm"
            startContent={<Icon icon="solar:list-check-linear" width={16} />}
            variant="flat"
          >
            Voir son étape
          </Button>
        </ModalHeader>

        <ModalBody className="overflow-hidden p-0">
          <DiscussionThread
            justificationId={justification.id}
            objectif={{
              code: justification.objectif.code,
              description: justification.objectif.description,
              type: justification.objectif.type,
            }}
            peutEcrire={peutEvaluer}
            peutValider={peutEvaluer && !estSonPropreTravail}
            viewer={viewer}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
