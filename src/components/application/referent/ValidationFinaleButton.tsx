"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

import { Icon } from "@/lib/icons";
import { validateEtape } from "@/actions/etape/etape.actions";

type ValidationFinaleButtonProps = {
  chefId: string;
  etapeId: string;
};

export default function ValidationFinaleButton({
  chefId,
  etapeId,
}: ValidationFinaleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleConfirmValidate = async () => {
    setIsLoading(true);
    setErreur(null);
    const result = await validateEtape(chefId, etapeId);

    if (result && !result.success) {
      setErreur(result.error ?? "Erreur lors de la validation");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        className="w-full md:w-auto bg-nav-active text-white data-[hover=true]:bg-nav-hover"
        isLoading={isLoading}
        startContent={!isLoading && <Icon icon="solar:verified-check-linear" />}
        onPress={onOpen}
      >
        Valider le badge complet
      </Button>
      {erreur && (
        <p className="mt-2 text-xs text-danger" role="alert">
          {erreur}
        </p>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-dashboard">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-dashboard-border">
                Confirmation de la validation
              </ModalHeader>
              <ModalBody className="pt-4">
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
                  className="bg-nav-active text-white data-[hover=true]:bg-nav-hover"
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
