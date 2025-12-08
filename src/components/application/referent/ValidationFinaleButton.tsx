"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { validateEtape } from "@/app/actions/etape-actions";

type ValidationFinaleButtonProps = {
  chefId: string;
  etapeId: string;
};

export default function ValidationFinaleButton({
  chefId,
  etapeId,
}: ValidationFinaleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleConfirmValidate = async () => {
    setIsLoading(true);
    await validateEtape(chefId, etapeId);
    // La redirection est gérée par la server action, pas besoin de gérer le succès ici.
    // En cas d'erreur, on arrête simplement le chargement.
    setIsLoading(false);
  };

  return (
    <>
      <Button
        color="success"
        onPress={onOpen}
        isLoading={isLoading}
        startContent={!isLoading && <Icon icon="solar:verified-check-linear" />}
      >
        Valider le Badge Complet
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmation de la validation
              </ModalHeader>
              <ModalBody>
                <p>
                  Êtes-vous sûr de vouloir valider ce badge ? Cette action est
                  définitive et enverra une notification au chef.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  color="success"
                  onPress={() => {
                    onClose();
                    handleConfirmValidate();
                  }}
                >
                  Confirmer la validation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}