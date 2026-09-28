"use client";

import type { AdminEtapeWithReferents, UserResume } from "@/types";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  User as UserComponent,
  Checkbox,
  ScrollShadow,
} from "@heroui/react";

import {
  assignReferentToEtape,
  removeReferentFromEtape,
} from "../../_actions/assignation.actions";

import { clickable } from "@/lib/a11y";
import { Button } from "@/components/ui";

type AssignationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  etape: AdminEtapeWithReferents;
  allReferents: UserResume[];
};

export default function AssignationModal({
  isOpen,
  onClose,
  etape,
  allReferents,
}: AssignationModalProps) {
  const [erreur, setErreur] = React.useState<string | null>(null);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());
  const [optimisticAssignments, setOptimisticAssignments] = React.useState<
    Set<string>
  >(new Set());

  React.useEffect(() => {
    if (etape) {
      const assignedIds = new Set<string>(
        etape.referents.map((r) => r.referentId),
      );

      setOptimisticAssignments(assignedIds);
    }
  }, [etape]);

  const isAssigned = (referentId: string) => {
    return optimisticAssignments.has(referentId);
  };

  const basculerAssignation = (referentId: string, estAssigne: boolean) => {
    setOptimisticAssignments((prev) => {
      const next = new Set(prev);

      if (estAssigne) {
        next.add(referentId);
      } else {
        next.delete(referentId);
      }

      return next;
    });
  };

  const handleToggle = async (referentId: string, isSelected: boolean) => {
    setErreur(null);
    setPendingIds((prev) => new Set(prev).add(referentId));
    basculerAssignation(referentId, isSelected);

    const result = isSelected
      ? await assignReferentToEtape(referentId, etape.id)
      : await removeReferentFromEtape(referentId, etape.id);

    if (!result.success) {
      basculerAssignation(referentId, !isSelected);
      setErreur(result.error ?? "Une erreur est survenue");
    }

    setPendingIds((prev) => {
      const next = new Set(prev);

      next.delete(referentId);

      return next;
    });
  };

  return (
    <Modal
      classNames={{ base: "rounded-[24px]" }}
      isOpen={isOpen}
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalContent className="bg-dashboard">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Gérer les Référents - {etape?.name}
            </ModalHeader>
            <ModalBody>
              <p className="text-small text-default-500 mb-2">
                Sélectionnez les référents qui peuvent valider cette étape.
              </p>
              {erreur && (
                <p className="text-sm text-danger" role="alert">
                  {erreur}
                </p>
              )}
              <ScrollShadow className="h-[400px] w-full overflow-x-hidden">
                <div className="flex flex-col gap-2">
                  {allReferents.map((referent) => {
                    const assigned = isAssigned(referent.id);
                    const isPending = pendingIds.has(referent.id);

                    return (
                      <div
                        key={referent.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-dashboard-tab transition-colors cursor-pointer"
                        {...clickable(() => {
                          if (!isPending) handleToggle(referent.id, !assigned);
                        })}
                      >
                        <UserComponent
                          avatarProps={{
                            src: referent.image || undefined,
                            size: "sm",
                          }}
                          description={referent.email}
                          name={referent.name}
                        />
                        <Checkbox
                          isReadOnly
                          isDisabled={isPending}
                          isSelected={assigned}
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
