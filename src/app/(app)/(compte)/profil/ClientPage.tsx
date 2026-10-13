"use client";

import type { EtatAccueil } from "@/services/accueil.service";
import type { EtatProgressionPlateforme } from "@/services/wp-progression.service";

import { Spacer } from "@heroui/react";

import { ProfilForm, type ProfilUser } from "./_components/ProfilForm";
import { ProgressionPlateforme } from "./_components/ProgressionPlateforme";

export default function ClientPage({
  user,
  accueil,
  progression,
  wordpressProfileUrl,
}: {
  user: ProfilUser;
  accueil: EtatAccueil | null;
  progression: EtatProgressionPlateforme;
  wordpressProfileUrl: string;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl w-full pt-4 md:pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
        <p className="text-default-500">
          Consultez et gérez vos informations personnelles.
        </p>
      </div>

      <Spacer y={2} />

      <ProfilForm
        accueil={accueil}
        user={user}
        wordpressProfileUrl={wordpressProfileUrl}
      />

      <ProgressionPlateforme
        ecritureActive={progression.ecritureActive}
        etapes={progression.etapes}
      />
    </div>
  );
}
