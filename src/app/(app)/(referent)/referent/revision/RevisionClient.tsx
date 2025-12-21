"use client";

import React from "react";
import {
  User as UserAvatar,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Chip,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import ValidationFinaleButton from "@/components/application/referent/ValidationFinaleButton";
import type { User, Etape, Justification, Objectif } from "@prisma/client";
import { Icon } from "@iconify/react";
import Link from "next/link";


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
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 md:px-0 md:pt-0">
        <div className="flex items-center gap-2 text-default-500 mb-4 md:mb-6">
          <Button
            as={Link}
            href={`/referent/dashboard?etapeId=${etape.id}&tab=a-reviser`}
            variant="light"
            size="sm"
            startContent={<Icon icon="solar:arrow-left-linear" />}
            className="pl-0 min-w-0"
          >
            Retour
          </Button>
          <span>/</span>
          <span className="text-default-700 font-medium">Révision</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
              Revue Finale
              <Chip color="success" variant="flat" size="sm">
                Badge Complet
              </Chip>
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-default-500">Badge concerné :</span>
              <span className="font-bold text-default-900 bg-content2 px-2 py-0.5 rounded-medium">
                {etape.name}
              </span>
            </div>
          </div>

          <div className="bg-content1 rounded-xl p-3 border border-default-200">
            <UserAvatar
              name={chef.name}
              description={chef.email}
              avatarProps={{
                src: chef.image || undefined,
                name: chef.name.charAt(0).toUpperCase(),
                size: "lg",
                isBordered: true,
              }}
              classNames={{
                name: "font-semibold text-lg",
              }}
            />
          </div>
        </div>
      </div>

      <Divider className="my-6" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0 md:pr-2 pb-24 md:pb-4 space-y-4 scrollbar-hide">
        <div className="flex items-center gap-2 mb-2">
          <Icon icon="solar:document-text-bold" className="text-xl text-primary" />
          <h5 className="text-lg font-semibold">Justifications validées</h5>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {justifications.map((justification) => (
            <Card key={justification.id} shadow="sm" className="border border-default-100">
              <CardHeader className="flex gap-3 bg-default-50/50 pb-2">
                <div className="flex flex-col">
                  <p className="text-small text-default-500">Objectif {justification.objectif.code}</p>
                  <p className="text-medium font-semibold">{justification.objectif.description}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-default-600 whitespace-pre-wrap leading-relaxed">
                  {justification.contenu || "Aucun contenu textuel."}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer / Sticky Action */}
      <div className="flex-shrink-0 md:relative fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md md:bg-transparent border-t md:border-t-0 border-default-200 z-50">
        <div className="flex items-center justify-between gap-4 md:bg-content1 md:p-4 md:rounded-2xl md:border md:border-default-200">
          <div className="hidden md:flex flex-col">
            <span className="font-semibold">Tout semble correct ?</span>
            <span className="text-xs text-default-500">Validez le badge pour notifier le chef.</span>
          </div>
          <div className="w-full md:w-auto">
            <ValidationFinaleButton chefId={chef.id} etapeId={etape.id} />
          </div>
        </div>
      </div>
    </div >
  );
}