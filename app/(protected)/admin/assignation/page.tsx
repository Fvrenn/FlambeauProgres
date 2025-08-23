"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { CustomSelect } from "@/src/components/ui/Select";
import { CustomButton } from "@/src/components/ui/Button";
import {
  CustomCard,
  CustomCardBody,
  CustomCardHeader,
} from "@/src/components/ui/Card";
import { useBadges } from "@/src/hooks/useBadges";
import type { Badge } from "@/src/types/badge";
import { useReferents } from "@/src/hooks/useReferents";
import { useAssignReferent } from "@/src/hooks/useAssignReferent";
import { useRemoveReferent } from "@/src/hooks/useRemoveReferent";

export default function AssignationPage() {
  const { badges, isLoading, error } = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedReferentId, setSelectedReferentId] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: removeReferent } = useRemoveReferent();
  const { mutate: assignReferent, isPending: isAssigning } =
    useAssignReferent();
  const {
    referents,
    isLoading: isLoadingReferents,
    error: errorReferents,
  } = useReferents();
  if (isLoadingReferents) return <p>Chargement des référents...</p>;
  if (errorReferents) return <p>Erreur lors du chargement des référents.</p>;
  if (isLoading) return <p>Chargement des badges...</p>;
  if (error) return <p>Erreur lors du chargement des badges.</p>;
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setSelectedReferentId("");
    onOpen();
  };

  const handleAssignReferent = () => {
    if (!selectedBadge || !selectedReferentId) return;
    assignReferent(
      { badgeId: selectedBadge.id, referentId: selectedReferentId },
      {
        onSuccess: () => {
          setSelectedReferentId("");
          onClose();
        },
        onError: (err) => {
          alert("Erreur lors de l'assignation du référent");
        },
      }
    );
  };

  const handleRemoveReferent = (badgeId: string, referentId: string) => {
    removeReferent({ badgeId, referentId });
  };
  const getAvailableReferents = () => {
    if (!selectedBadge) return [];
    return referents.map((referent) => ({
      key: referent.id,
      label: referent.name,
      value: referent.id,
      description: referent.email,
      isDisabled: false,
      startContent: (
        <Avatar src={referent.image} name={referent.name} size="sm" />
      ),
    }));
  };

  return (
    <div className="container p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Assignation des Référents
        </h1>
        <p className="text-default-500">
          Assignez des référents aux différents badges scouts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {badges.map((badge) => {
          const assignedReferents = badge.assignedReferents ?? [];
          return (
            <CustomCard
              key={badge.number}
              theme="interactive"
              className="cursor-pointer"
              onPress={() => handleBadgeClick(badge)}
            >
              <CustomCardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Image
                    src={badge.image_src}
                    alt={badge.name}
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{badge.name}</h3>
                  </div>
                </div>
              </CustomCardHeader>

              <CustomCardBody className="pt-0">
                <div className="space-y-2">
                  <p className="text-small font-medium text-default-700">
                    Référents assignés ({assignedReferents.length})
                  </p>

                  {assignedReferents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {assignedReferents.map((referent) => (
                        <Chip
                          key={referent.id}
                          avatar={
                            <Avatar
                              src={referent.image}
                              name={referent.name}
                              size="sm"
                            />
                          }
                          variant="flat"
                          color="primary"
                          onClose={() =>
                            handleRemoveReferent(badge.id, referent.id)
                          }
                        >
                          {referent.name}
                        </Chip>
                      ))}
                    </div>
                  ) : (
                    <Chip size="sm" variant="flat" color="default">
                      Aucun référent
                    </Chip>
                  )}
                </div>
              </CustomCardBody>
            </CustomCard>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              Assigner un référent - {selectedBadge?.name}
            </h2>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4 flex flex-col gap-6">
              {selectedBadge &&
                (selectedBadge.assignedReferents ?? []).length > 0 && (
                  <div>
                    <p className="text-small font-medium text-default-700 mb-2">
                      Référents actuels :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedBadge.assignedReferents ?? []).map(
                        (referent) => (
                          <Chip
                            key={referent.id}
                            avatar={
                              <Avatar
                                src={referent.image}
                                name={referent.name}
                                size="sm"
                              />
                            }
                            variant="flat"
                            color="success"
                            onClose={() =>
                              handleRemoveReferent(
                                selectedBadge.id,
                                referent.id
                              )
                            }
                          >
                            {referent.name}
                          </Chip>
                        )
                      )}
                    </div>
                  </div>
                )}

              <CustomSelect
                label="Sélectionner un nouveau référent"
                placeholder="Choisissez un référent à assigner"
                options={getAvailableReferents()}
                selectedKeys={
                  selectedReferentId ? new Set([selectedReferentId]) : new Set()
                }
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setSelectedReferentId(selectedKey || "");
                }}
                theme="elegant"
                className="w-full"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <CustomButton theme="ghost" onClick={onClose}>
              Annuler
            </CustomButton>
            <CustomButton
              theme="primary"
              onClick={handleAssignReferent}
              disabled={!selectedReferentId}
            >
              Assigner
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
