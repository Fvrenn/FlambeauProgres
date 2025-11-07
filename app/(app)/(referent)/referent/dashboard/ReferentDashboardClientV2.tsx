"use client";

import React, { useState } from "react";
import { Tabs, Tab, Card, CardBody, Chip, Avatar, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { type User, type Justification, type Objectif, type Commentaire } from "@prisma/client";
import ChefsAReviserTable from "@/components/application/referent/ChefsAReviserTable";
import ReferentValidationModal from "./_components/ReferentValidationModal";

// Types pour les justifications avec relations enrichies
type ChefInfo = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type ObjectifInfo = {
  id: string;
  code: string;
  description: string;
};

type JustificationAValider = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
};

type JustificationEnDiscussion = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
  _count: {
    notifications: number;
  };
};

// Type complet pour le modal (incluant commentaires)
type JustificationAvecCommentaires = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
  commentaires: (Commentaire & {
    auteur: ChefInfo;
  })[];
};

interface ReferentDashboardClientV2Props {
  justificationsAValider: JustificationAValider[];
  justificationsEnDiscussion: JustificationEnDiscussion[];
  chefsAReviser: User[];
}

export default function ReferentDashboardClientV2({
  justificationsAValider,
  justificationsEnDiscussion,
  chefsAReviser,
}: ReferentDashboardClientV2Props) {
  // État local pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState<
    (JustificationAValider | JustificationEnDiscussion) & { commentaires?: any[] }
  | null
  >(null);
  const [defaultTab, setDefaultTab] = useState<"justification" | "discussion">("justification");

  const handleJustificationClick = (
    justification: JustificationAValider | JustificationEnDiscussion,
    tab: "justification" | "discussion"
  ) => {
    setSelectedJustification(justification);
    setDefaultTab(tab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJustification(null);
  };

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0">
        Dashboard Référent
      </h4>

      <Tabs aria-label="Onglets du dashboard référent" className="mt-4">
        {/* Onglet 1 : À Valider */}
        <Tab key="a-valider" title="À Valider">
          <div className="h-full flex flex-col overflow-hidden">
            {justificationsAValider.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-default-500">
                  Aucune réalisation à valider pour le moment.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-4">
                {justificationsAValider.map((justification) => (
                  <Card
                    key={justification.id}
                    isPressable
                    onPress={() => handleJustificationClick(justification, "justification")}
                    className="cursor-pointer hover:bg-default-100 transition-colors"
                  >
                    <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                      {/* Avatar + Chef */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar
                          src={justification.chef.image || undefined}
                          name={justification.chef.name.charAt(0).toUpperCase()}
                          size="sm"
                        />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-semibold">
                            {justification.chef.name}
                          </p>
                          <p className="text-xs text-default-500">
                            {justification.chef.email}
                          </p>
                        </div>
                      </div>

                      {/* Objectif + Code */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          [{justification.objectif.code}]
                        </p>
                        <p className="text-xs text-default-500 truncate">
                          {justification.objectif.description}
                        </p>
                      </div>

                      {/* Statut */}
                      <Chip
                        size="sm"
                        variant="flat"
                        color="warning"
                        startContent={
                          <Icon icon="solar:clock-circle-linear" width={14} />
                        }
                      >
                        En attente
                      </Chip>

                      {/* Chevron */}
                      <Icon
                        icon="solar:arrow-right-linear"
                        width={20}
                        className="text-default-400"
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tab>

        {/* Onglet 2 : Discussions en Cours */}
        <Tab key="discussions" title="Discussions en Cours">
          <div className="h-full flex flex-col overflow-hidden">
            {justificationsEnDiscussion.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-default-500">
                  Aucune discussion en cours.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-4">
                {justificationsEnDiscussion.map((justification) => (
                  <Card
                    key={justification.id}
                    isPressable
                    onPress={() => handleJustificationClick(justification, "discussion")}
                    className="cursor-pointer hover:bg-default-100 transition-colors"
                  >
                    <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                      {/* Avatar + Chef */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar
                          src={justification.chef.image || undefined}
                          name={justification.chef.name.charAt(0).toUpperCase()}
                          size="sm"
                        />
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-semibold">
                            {justification.chef.name}
                          </p>
                          <p className="text-xs text-default-500">
                            {justification.chef.email}
                          </p>
                        </div>
                      </div>

                      {/* Objectif + Code */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          [{justification.objectif.code}]
                        </p>
                        <p className="text-xs text-default-500 truncate">
                          {justification.objectif.description}
                        </p>
                      </div>

                      {/* Statut + Pastille */}
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          color="secondary"
                          startContent={
                            <Icon
                              icon="solar:question-circle-linear"
                              width={14}
                            />
                          }
                        >
                          Précision
                        </Chip>

                        {justification._count.notifications > 0 && (
                          <Badge
                            content={justification._count.notifications}
                            color="danger"
                            size="sm"
                            shape="circle"
                          >
                            <Chip
                              size="sm"
                              variant="flat"
                              color="primary"
                              startContent={
                                <Icon
                                  icon="solar:chat-round-dots-linear"
                                  width={14}
                                />
                              }
                            >
                              Nouveau
                            </Chip>
                          </Badge>
                        )}
                      </div>

                      {/* Chevron */}
                      <Icon
                        icon="solar:arrow-right-linear"
                        width={20}
                        className="text-default-400"
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tab>

        {/* Onglet 3 : Badges à réviser */}
        <Tab key="a-reviser" title="Badges complets à réviser">
          <ChefsAReviserTable chefs={chefsAReviser} />
        </Tab>
      </Tabs>

      {/* Modale ReferentValidationModal */}
      <ReferentValidationModal
        isOpen={isModalOpen}
        onOpenChange={handleCloseModal}
        justification={selectedJustification as any}
        defaultTab={defaultTab}
      />
    </div>
  );
}
