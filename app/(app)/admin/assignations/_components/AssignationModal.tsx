"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  User as UserComponent,
  Checkbox,
  ScrollShadow,
} from "@heroui/react";
import { assignReferentToEtape, removeReferentFromEtape } from "../../_actions/admin.actions";
import { useRouter } from "next/navigation";

type AssignationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  etape: any;
  allReferents: any[];
};

export default function AssignationModal({
  isOpen,
  onClose,
  etape,
  allReferents,
}: AssignationModalProps) {
  const router = useRouter();
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());
  // Optimistic state to track assignments
  const [optimisticAssignments, setOptimisticAssignments] = React.useState<Set<string>>(new Set());

  // Initialize optimistic state when modal opens or etape changes
  React.useEffect(() => {
    if (etape) {
      const assignedIds = new Set<string>(etape.referents.map((r: any) => r.referentId));
      setOptimisticAssignments(assignedIds);
    }
  }, [etape]);

  // Helper to check if a referent is assigned (using optimistic state)
  const isAssigned = (referentId: string) => {
    return optimisticAssignments.has(referentId);
  };

  const handleToggle = async (referentId: string, isSelected: boolean) => {
    setPendingIds((prev) => new Set(prev).add(referentId));
    
    // Optimistic update
    setOptimisticAssignments((prev) => {
      const next = new Set(prev);
      if (isSelected) {
        next.add(referentId);
      } else {
        next.delete(referentId);
      }
      return next;
    });

    try {
      if (isSelected) {
        await assignReferentToEtape(referentId, etape.id);
      } else {
        await removeReferentFromEtape(referentId, etape.id);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle referent", error);
      // Revert optimistic update on error
      setOptimisticAssignments((prev) => {
        const next = new Set(prev);
        if (isSelected) {
          next.delete(referentId);
        } else {
          next.add(referentId);
        }
        return next;
      });
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(referentId);
        return next;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Gérer les Référents - {etape?.name}
            </ModalHeader>
            <ModalBody>
              <p className="text-small text-default-500 mb-2">
                Sélectionnez les référents qui peuvent valider cette étape.
              </p>
              <ScrollShadow className="h-[400px]">
                <div className="flex flex-col gap-2">
                  {allReferents.map((referent) => {
                    const assigned = isAssigned(referent.id);
                    const isPending = pendingIds.has(referent.id);

                    return (
                      <div
                        key={referent.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
                        onClick={() => !isPending && handleToggle(referent.id, !assigned)}
                      >
                        <UserComponent
                          name={referent.name}
                          description={referent.email}
                          avatarProps={{
                            src: referent.image,
                            size: "sm",
                          }}
                        />
                        <Checkbox
                          isSelected={assigned}
                          isDisabled={isPending}
                          isReadOnly
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
