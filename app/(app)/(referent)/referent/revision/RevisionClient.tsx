"use client";

import React from "react";
import {
  User as UserAvatar,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@heroui/react";
import ValidationFinaleButton from "@/components/application/referent/ValidationFinaleButton";
import type { User, Etape, Justification, Objectif } from "@prisma/client";

// On définit un type plus précis pour nos justifications avec la relation incluse
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
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <h4 className="text-3xl font-normal">Revue Finale du Badge</h4>
        <p className="text-default-500 mt-1">
          Vérification des compétences auto-validées pour le badge{" "}
          <span className="font-semibold text-default-700">{etape.name}</span>.
        </p>
        <div className="mt-4">
          <UserAvatar
            avatarProps={{
              src: chef.image || undefined,
              name: chef.name.charAt(0).toUpperCase(),
            }}
            name={chef.name}
            description={chef.email}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 pr-4 space-y-4">
        {justifications.map((justification) => (
          <Card key={justification.id}>
            <CardHeader>
              <p className="text-sm font-semibold">
                {justification.objectif.code} -{" "}
                {justification.objectif.description}
              </p>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-sm text-default-600 whitespace-pre-wrap">
                {justification.contenu}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex-shrink-0">
        <ValidationFinaleButton chefId={chef.id} etapeId={etape.id} />
      </div>
    </div>
  );
}