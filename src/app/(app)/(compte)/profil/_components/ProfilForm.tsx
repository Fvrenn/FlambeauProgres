"use client";

import type { getUser } from "@/lib/auth-server";
import type { UserRole } from "@prisma/client";
import type { EtatAccueil } from "@/services/accueil.service";

import React from "react";
import { Card, CardBody, Avatar } from "@heroui/react";

import { roleLabelMap } from "@/lib/roles";
import { AccueilModal } from "@/components/application/accueil/AccueilModal";

export type ProfilUser = NonNullable<Awaited<ReturnType<typeof getUser>>> & {
  role?: UserRole;
};

function ProfilIdentity({
  user,
  onModifierGroupe,
}: {
  user: ProfilUser;
  onModifierGroupe?: () => void;
}) {
  return (
    <div className="flex items-center gap-6">
      <Avatar
        className="w-20 h-20 text-large"
        color="primary"
        name={user?.name || "U"}
        src={user?.image || undefined}
      />
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-xl font-semibold leading-none mb-2">
          {user?.name}
        </h3>
        <p className="text-small text-default-500">{user?.email}</p>
        <p className="text-small text-default-500 mt-1">
          Rôle :{" "}
          <span className="font-medium text-foreground">
            {roleLabelMap[user?.role ?? "CHEF"]}
          </span>
        </p>
        <p className="text-small text-default-500 mt-1">
          Groupe :{" "}
          <span className="font-medium text-foreground">
            {user?.groupe ?? "Aucun groupe renseigné"}
          </span>
          {onModifierGroupe && (
            <>
              {" · "}
              <button
                className="cursor-pointer underline"
                type="button"
                onClick={onModifierGroupe}
              >
                Modifier
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function ProfilFormWordpress({
  user,
  accueil,
  wordpressProfileUrl,
}: {
  user: ProfilUser;
  accueil: EtatAccueil | null;
  wordpressProfileUrl: string;
}) {
  const [estAccueilOuvert, setEstAccueilOuvert] = React.useState(false);

  return (
    <Card className="w-full bg-dashboard-panel shadow-none border border-dashboard-border">
      <CardBody className="p-6 gap-6">
        <ProfilIdentity
          user={user}
          onModifierGroupe={
            accueil ? () => setEstAccueilOuvert(true) : undefined
          }
        />
        {accueil && (
          <AccueilModal
            etat={accueil}
            isOpen={estAccueilOuvert}
            onClose={() => setEstAccueilOuvert(false)}
          />
        )}
        <p className="text-small text-default-500">
          Ces informations sont gérées depuis WordPress.
          <a
            className="underline"
            href={wordpressProfileUrl}
            rel="noreferrer"
            target="_blank"
          >
            Modifier sur WordPress
          </a>
        </p>
      </CardBody>
    </Card>
  );
}

export function ProfilForm({
  user,
  accueil,
  wordpressProfileUrl,
}: {
  user: ProfilUser;
  accueil: EtatAccueil | null;
  wordpressProfileUrl: string;
}) {
  return (
    <ProfilFormWordpress
      accueil={accueil}
      user={user}
      wordpressProfileUrl={wordpressProfileUrl}
    />
  );
}
