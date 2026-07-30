"use client";

import type { User, Etape, Justification, Objectif } from "@prisma/client";

import React from "react";
import {
  User as UserAvatar,
  Card,
  CardBody,
  Divider,
  Button,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import ValidationFinaleButton from "@/components/application/referent/ValidationFinaleButton";

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
    <div className="h-full max-h-screen flex flex-col md:overflow-hidden bg-background">
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
              <h4 className="text-2xl md:text-3xl font-normal">Revue finale</h4>
              <Chip
                className="bg-default-100 text-default-600 border border-default-200"
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

          <div className="flex items-center bg-content1 border border-default-200 rounded-xl px-3 py-2 self-start">
            <UserAvatar
              avatarProps={{
                src: chef.image || undefined,
                name: chef.name.charAt(0).toUpperCase(),
                size: "md",
              }}
              classNames={{
                name: "font-medium text-foreground",
                description: "text-default-500 text-xs",
              }}
              description={chef.email}
              name={chef.name}
            />
          </div>
        </div>
      </div>

      <Divider className="my-5 bg-default-100" />

      <div className="flex-1 overflow-y-auto px-4 md:px-0 md:pr-2 pb-24 md:pb-4 scrollbar-hide">
        <h5 className="text-sm font-medium text-default-500 mb-3">
          Justifications validées ({justifications.length})
        </h5>

        <div className="space-y-3">
          {justifications.map((justification) => (
            <Card
              key={justification.id}
              className="border border-default-200 bg-content1"
              shadow="none"
            >
              <CardBody className="gap-3 p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground border border-default-300 bg-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    {justification.objectif.code}
                  </span>
                  <p className="text-medium font-medium text-foreground">
                    {justification.objectif.description}
                  </p>
                </div>
                <Divider className="bg-default-100" />
                <p className="text-sm text-default-600 whitespace-pre-wrap leading-relaxed">
                  {justification.contenu || "Aucun contenu textuel."}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 md:relative fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md md:bg-transparent border-t md:border-t-0 border-default-200 z-50">
        <div className="flex items-center justify-between gap-4 md:bg-content1 md:p-4 md:rounded-2xl md:border md:border-default-200">
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
