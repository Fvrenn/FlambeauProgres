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
import { useEffect } from "react";
import { getBadges } from "@/src/lib/badges";

// Types
interface Referent {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface Badge {
  id: string;
  name: string;
  image: string;
  assignedReferents: Referent[];
}

// Données de test
const referents: Referent[] = [
  {
    id: "1",
    name: "Marie Dubois",
    avatar: "https://i.pravatar.cc/23?u=uniqsdfue-id-ou-email",
    email: "marie@scout.com",
  },
  {
    id: "2",
    name: "Jean Martin",
    avatar: "https://i.pravatar.cc/123?u=uniqfue-id-fou-email",
    email: "jean@scout.com",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    avatar: "https://i.pravatar.cc/344?u=udque-id-ou-email",
    email: "sophie@scout.com",
  },
  {
    id: "4",
    name: "Pierre Moreau",
    avatar: "https://i.pravatar.cc/234?u=ugniqsdfue-id-ou-email",
    email: "pierre@scout.com",
  },
  {
    id: "5",
    name: "Emma Leroy",
    avatar: "https://i.pravatar.cc/333?u=uniqsdfue-id-ou-email",
    email: "emma@scout.com",
  },
];

const initialBadges: Badge[] = [
  {
    id: "1",
    name: "Badge Camping",
    image: "/badges/camping.svg",
    assignedReferents: [referents[0]],
  },
  {
    id: "2",
    name: "Badge Cuisine",
    image: "/badges/2b-spe_PF.svg",
    assignedReferents: [],
  },
  {
    id: "3",
    name: "Badge Nature",
    image: "/badges/nature.svg",
    assignedReferents: [referents[1], referents[2]],
  },
  {
    id: "4",
    name: "Badge Sport",
    image: "/badges/sport.svg",
    assignedReferents: [],
  },
];

export default function AssignationPage() {
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedReferentId, setSelectedReferentId] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setSelectedReferentId("");
    onOpen();
  };

  const handleAssignReferent = () => {
    if (!selectedBadge || !selectedReferentId) return;

    const referent = referents.find((r) => r.id === selectedReferentId);
    if (!referent) return;

    setBadges((prevBadges) =>
      prevBadges.map((badge) =>
        badge.id === selectedBadge.id
          ? {
              ...badge,
              assignedReferents: [...badge.assignedReferents, referent],
            }
          : badge
      )
    );

    setSelectedReferentId("");
    onClose();
  };

  const handleRemoveReferent = (badgeId: string, referentId: string) => {
    setBadges((prevBadges) =>
      prevBadges.map((badge) =>
        badge.id === badgeId
          ? {
              ...badge,
              assignedReferents: badge.assignedReferents.filter(
                (r) => r.id !== referentId
              ),
            }
          : badge
      )
    );
  };

  const getAvailableReferents = () => {
    if (!selectedBadge) return [];

    const assignedIds = selectedBadge.assignedReferents.map((r) => r.id);
    return referents.map((referent) => ({
      key: referent.id,
      label: referent.name,
      value: referent.id,
      description: referent.email,
      isDisabled: assignedIds.includes(referent.id),
      startContent: (
        <Avatar src={referent.avatar} name={referent.name} size="sm" />
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
        {badges.map((badge) => (
          <CustomCard
            key={badge.id}
            theme="interactive"
            className="cursor-pointer"
            onPress={() => handleBadgeClick(badge)}
          >
            <CustomCardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Image
                  src={badge.image}
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
                  Référents assignés ({badge.assignedReferents.length})
                </p>

                {badge.assignedReferents.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {badge.assignedReferents.map((referent) => (
                      <Chip
                        key={referent.id}
                        avatar={
                          <Avatar
                            src={referent.avatar}
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
        ))}
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
              {selectedBadge && selectedBadge.assignedReferents.length > 0 && (
                <div>
                  <p className="text-small font-medium text-default-700 mb-2">
                    Référents actuels :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBadge.assignedReferents.map((referent) => (
                      <Chip
                        key={referent.id}
                        avatar={
                          <Avatar
                            src={referent.avatar}
                            name={referent.name}
                            size="sm"
                          />
                        }
                        variant="flat"
                        color="success"
                        onClose={() =>
                          handleRemoveReferent(selectedBadge.id, referent.id)
                        }
                      >
                        {referent.name}
                      </Chip>
                    ))}
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
