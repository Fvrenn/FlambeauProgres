import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useState } from "react";
import { CustomButton } from "@/src/components/ui/Button";
import { CustomTextarea } from "@/src/components/ui/Textarea";

interface RefuserJustificationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (commentaire: string) => void;
  isLoading: boolean;
}

export default function RefuserJustificationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: RefuserJustificationModalProps) {
  const [commentaire, setCommentaire] = useState("");

  const handleConfirm = () => {
    onConfirm(commentaire);
    setCommentaire("");
  };

  const handleCancel = () => {
    setCommentaire("");
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Refuser la justification</h3>
          <p className="text-sm text-gray-600">
            Expliquez au chef pourquoi cette justification est refusée
          </p>
        </ModalHeader>
        <ModalBody>
          <CustomTextarea
            label="Commentaire de refus"
            placeholder="Expliquez les raisons du refus et donnez des conseils pour améliorer la justification..."
            value={commentaire}
            onValueChange={setCommentaire}
            minRows={4}
            maxRows={8}
            required
            theme="auth"
          />
        </ModalBody>
        <ModalFooter>
          <CustomButton
            theme="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Annuler
          </CustomButton>
          <CustomButton
            theme="danger"
            onClick={handleConfirm}
            disabled={!commentaire.trim() || isLoading}
            isLoading={isLoading}
          >
            Refuser la justification
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}