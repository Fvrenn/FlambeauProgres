"use client";

import type { User } from "@prisma/client";
import type { AdminEtapeWithReferents } from "@/types";

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
import { useRouter } from "next/navigation";

import {
  assignReferentToEtape,
  removeReferentFromEtape,
} from "../../_actions/admin.actions";

import { clickable } from "@/lib/a11y";
import { Button } from "@/components/ui";

type AssignationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  etape: AdminEtapeWithReferents;
  allReferents: User[];
};

export default function AssignationModal({
  isOpen,
  onClose,
  etape,
  allReferents,
}: AssignationModalProps) {
  const router = useRouter();
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

  const handleToggle = async (referentId: string, isSelected: boolean) => {
    setPendingIds((prev) => new Set(prev).add(referentId));

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
    <Modal
      classNames={{ base: "rounded-[24px]" }}
      isOpen={isOpen}
      scrollBehavior="inside"
      onClose={onClose}
    >
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
              <ScrollShadow className="h-[400px] w-full overflow-x-hidden">
                <div className="flex flex-col gap-2">
                  {allReferents.map((referent) => {
                    const assigned = isAssigned(referent.id);
                    const isPending = pendingIds.has(referent.id);

                    return (
                      <div
                        key={referent.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-default-100 transition-colors cursor-pointer"
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
