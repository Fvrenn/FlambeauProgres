import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { CustomTextarea } from "@/src/components/ui/Textarea";
import React, { useState } from "react";
import { useDemandePrecision } from "@/src/hooks/useDemandePrecision";
import { useSession } from "@/src/lib/auth-client";

interface DemandePrecisionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  justificationId: string;
  champ: string;
  champLabel: string;
  onSuccess?: () => void;
}

export default function DemandePrecisionModal({
  isOpen,
  onOpenChange,
  justificationId,
  champ,
  champLabel,
  onSuccess,
}: DemandePrecisionModalProps) {
  const [message, setMessage] = useState("");
  const { demanderPrecision, isLoading } = useDemandePrecision();
  const { data: session } = useSession();

  const handleSubmit = async () => {
    if (!message.trim()) {
      return;
    }

    if (!session?.user?.id) {
      return;
    }

    try {
      await demanderPrecision({
        justificationId,
        referentId: session.user.id,
        champ,
        message: message.trim(),
      });

      // Reset et fermeture
      setMessage("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la demande de précision:", error);
    }
  };

  const handleClose = () => {
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-lg font-semibold">
            Demander une précision - {champLabel}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600">
              Vous allez demander au chef de compléter le champ "{champLabel}".
              Expliquez pourquoi cette information est nécessaire.
            </p>
            
            <CustomTextarea
              theme="default"
              label="Message pour le chef"
              labelPlacement="outside"
              placeholder={`Exemple: Pouvez-vous préciser ${champLabel.toLowerCase()} pour mieux évaluer l'ampleur du projet ?`}
              minRows={4}
              maxRows={8}
              value={message}
              onValueChange={setMessage}
              description="Ce message sera envoyé au chef avec une notification."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!message.trim()}
          >
            Envoyer la demande
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}