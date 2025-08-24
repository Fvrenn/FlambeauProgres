import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function SubmitConfirmModal({ isOpen, onOpenChange, onConfirm }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirmation de soumission
            </ModalHeader>
            <ModalBody>
              <p>
                <strong>Attention&nbsp;!</strong>
              </p>
              <p>
                Une fois la justification soumise, il est recommandé de ne plus la modifier afin de faciliter le travail du référent.<br />
                Si tu préfères compléter ta justification plus tard, tu peux la garder en brouillon et la soumettre quand elle sera prête.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => { onConfirm(); onClose(); }}>
                Soumettre
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Garder en brouillon
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}