"use client";

import type { User, Etape, Justification, Objectif } from "@prisma/client";

import React from "react";
import { Divider, Button, Chip } from "@heroui/react";
import Link from "next/link";

import { Icon } from "@/lib/icons";
import ValidationFinaleButton from "@/components/application/referent/ValidationFinaleButton";
import { Avatar, Card, CardBody } from "@/components/ui";

type JustificationAvecObjectif = Justification & {
  objectif: Objectif;
};

type RevisionClientProps = {
  chef: User;
  etape: Etape;
  justifications: JustificationAvecObjectif[];
};

export default function RevisionClient({
  chef,
  etape,
  justifications,
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
          <span className="text-default-700 font-medium">Révision</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold">Revue finale</h1>
              <Chip
                className="bg-dashboard-card text-nav-active"
                size="sm"
                variant="flat"
              >
                Badge complet
              </Chip>
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

      <div className="flex-1 overflow-y-auto px-4 md:px-0 md:pr-2 pb-24 md:pb-4 scrollbar-hide">
        <h5 className="text-sm font-medium text-default-500 mb-3">
          Justifications validées ({justifications.length})
        </h5>

        <div className="space-y-3">
          {justifications.map((justification) => (
            <Card key={justification.id} className="bg-dashboard-panel">
              <CardBody>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-nav-active bg-dashboard-card w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {justification.objectif.code}
                  </span>
                  <p className="text-medium font-medium text-foreground">
                    {justification.objectif.description}
                  </p>
                </div>
                <Divider className="bg-dashboard-border" />
                <p className="text-sm text-default-600 whitespace-pre-wrap leading-relaxed">
                  {justification.contenu || "Aucun contenu textuel."}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 md:relative fixed bottom-0 left-0 right-0 p-4 bg-dashboard/80 backdrop-blur-md md:bg-transparent border-t md:border-t-0 border-dashboard-border z-50">
        <div className="flex items-center justify-between gap-4 md:bg-dashboard-panel md:p-4 md:rounded-2xl md:border md:border-dashboard-border">
          <div className="hidden md:flex flex-col">
            <span className="font-medium">Tout semble correct ?</span>
            <span className="text-xs text-default-500">
              Validez le badge pour notifier le chef.
            </span>
          </div>
          <div className="w-full md:w-auto">
            <ValidationFinaleButton chefId={chef.id} etapeId={etape.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
