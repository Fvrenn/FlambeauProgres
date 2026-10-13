"use client";

import type {
  Etape,
  Justification,
  Objectif,
  TypeObjectif,
} from "@prisma/client";
import type { UserResume } from "@/types";

import { Divider, Button, Chip } from "@heroui/react";
import Link from "next/link";

import { Icon } from "@/lib/icons";
import ValidationFinaleButton from "@/components/application/referent/ValidationFinaleButton";
import { Avatar, Card, CardBody, StatusChip } from "@/components/ui";

type ObjectifAvecJustification = Objectif & {
  justifications: Justification[];
};

const SECTIONS: { type: TypeObjectif; titre: string }[] = [
  { type: "COMPETENCE", titre: "Compétences" },
  { type: "REALISATION", titre: "Réalisations" },
];

type RevisionClientProps = {
  chef: UserResume;
  etape: Etape;
  objectifs: ObjectifAvecJustification[];
  estComplet: boolean;
  peutValider: boolean;
  refusValidation: string;
};

export default function RevisionClient({
  chef,
  etape,
  objectifs,
  estComplet,
  peutValider,
  refusValidation,
}: RevisionClientProps) {
  return (
    <div className="h-full max-h-screen flex flex-col md:overflow-hidden bg-dashboard">
      <div className="flex-shrink-0 px-4 pt-4 md:px-0 md:pt-0">
        <div className="flex items-center gap-2 text-default-500 mb-4 md:mb-6">
          <Button
            as={Link}
            className="pl-0 min-w-0"
            href={`/referent/dashboard?etapeId=${etape.id}&tab=a-reviser`}
            size="sm"
            startContent={<Icon icon="solar:arrow-left-linear" />}
            variant="light"
          >
            Retour
          </Button>
          <span>/</span>
          <span className="text-default-700 font-medium">
            {estComplet ? "Révision" : "Étape du chef"}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold">
                {estComplet ? "Revue finale" : "Progression du chef"}
              </h1>
              {estComplet && (
                <Chip
                  className="bg-dashboard-card text-nav-active"
                  size="sm"
                  variant="flat"
                >
                  Badge complet
                </Chip>
              )}
            </div>
            <p className="text-default-500">
              Badge concerné :{" "}
              <span className="font-medium text-foreground">{etape.name}</span>
            </p>
          </div>

          <Card className="bg-dashboard-panel self-start" size="sm">
            <CardBody className="flex-row items-center gap-3">
              <Avatar name={chef.name} size="sm" src={chef.image} />
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">
                  {chef.name}
                </span>
                <span className="text-default-500 text-xs">{chef.email}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider className="my-5 bg-dashboard-border" />

      <div className="flex-1 overflow-y-auto px-4 md:px-0 md:pr-2 pb-24 md:pb-4 scrollbar-hide space-y-6">
        {SECTIONS.map(({ type, titre }) => {
          const objectifsDuType = objectifs.filter(
            (objectif) => objectif.type === type,
          );

          if (objectifsDuType.length === 0) {
            return null;
          }

          return (
            <section key={type}>
              <h5 className="text-sm font-medium text-default-500 mb-3">
                {titre} ({objectifsDuType.length})
              </h5>

              <div className="space-y-3">
                {objectifsDuType.map((objectif) => {
                  const justification = objectif.justifications[0] ?? null;
                  const aUnFil =
                    justification && justification.statut !== "AUTO_VALIDEE";

                  return (
                    <Card key={objectif.id} className="bg-dashboard-panel">
                      <CardBody>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-semibold text-nav-active bg-dashboard-card w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                            {objectif.code}
                          </span>
                          <p className="flex-1 text-medium font-medium text-foreground">
                            {objectif.description}
                          </p>
                          <StatusChip statut={justification?.statut ?? null} />
                        </div>
                        <Divider className="bg-dashboard-border" />
                        <p className="text-sm text-default-600 whitespace-pre-wrap leading-relaxed">
                          {justification?.contenu || "Aucun contenu textuel."}
                        </p>
                        {aUnFil && (
                          <Button
                            as={Link}
                            className="self-start bg-dashboard-tab data-[hover=true]:bg-dashboard-tab-hover"
                            href={`/referent/dashboard?etapeId=${etape.id}&justification=${justification.id}`}
                            size="sm"
                            startContent={
                              <Icon icon="solar:chat-round-line-linear" />
                            }
                            variant="flat"
                          >
                            Ouvrir la discussion
                          </Button>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex-shrink-0 md:relative fixed bottom-0 left-0 right-0 p-4 bg-dashboard/80 backdrop-blur-md md:bg-transparent border-t md:border-t-0 border-dashboard-border z-50">
        <div className="flex items-center justify-between gap-4 md:bg-dashboard-panel md:p-4 md:rounded-2xl md:border md:border-dashboard-border">
          <div className="hidden md:flex flex-col">
            <span className="font-medium">Tout semble correct ?</span>
            <span className="text-xs text-default-500">
              {peutValider
                ? "Validez le badge pour notifier le chef."
                : refusValidation}
            </span>
          </div>
          <div className="w-full md:w-auto">
            {peutValider ? (
              <ValidationFinaleButton chefId={chef.id} etapeId={etape.id} />
            ) : (
              <span className="text-xs text-default-500 md:hidden">
                {refusValidation}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
