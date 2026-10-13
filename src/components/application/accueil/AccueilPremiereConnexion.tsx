"use client";

import type { EtatAccueil } from "@/services/accueil.service";

import React from "react";

import { AccueilModal } from "./AccueilModal";

export function AccueilPremiereConnexion({ etat }: { etat: EtatAccueil }) {
  const [estOuvert, setEstOuvert] = React.useState(true);

  return (
    <AccueilModal
      premiereConnexion
      etat={etat}
      isOpen={estOuvert}
      onClose={() => setEstOuvert(false)}
    />
  );
}
