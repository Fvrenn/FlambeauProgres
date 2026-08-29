"use client";

import type { EtapeProgressionPlateforme } from "@/services/wp-progression.service";

import React from "react";
import { Card, CardBody, Checkbox, Chip, Button } from "@heroui/react";

import { declarerProgressionPlateforme } from "@/actions/profil/progression.actions";

type ProgressionPlateformeProps = {
  etapes: EtapeProgressionPlateforme[];
  ecritureActive: boolean;
};

export function ProgressionPlateforme({
  etapes,
  ecritureActive,
}: ProgressionPlateformeProps) {
  const initiales = React.useMemo(
    () => etapes.filter((etape) => etape.declaree).map((etape) => etape.id),
    [etapes],
  );

  const [selection, setSelection] = React.useState<string[]>(initiales);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const modifiable = (etape: EtapeProgressionPlateforme) =>
    ecritureActive && etape.origine !== "APP" && etape.wpValue !== null;

  const aChange =
    selection.length !== initiales.length ||
    selection.some((id) => !initiales.includes(id));

  const basculer = (etapeId: string, coche: boolean) => {
    setMessage(null);
    setSelection((courant) =>
      coche ? [...courant, etapeId] : courant.filter((id) => id !== etapeId),
    );
  };

  const enregistrer = () => {
    startTransition(async () => {
      const result = await declarerProgressionPlateforme(selection);

      setMessage(
        result.success
          ? "Progression envoyée à la plateforme."
          : (result.error ?? "Erreur inattendue."),
      );
    });
  };

  return (
    <Card className="w-full bg-dashboard-panel shadow-none border border-dashboard-border">
      <CardBody className="p-6 gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">
            Progression sur la plateforme
          </h3>
          <p className="text-small text-default-500">
            {ecritureActive
              ? "Cochez les étapes déjà obtenues avant votre arrivée sur Flambeau Progrès : elles seront enregistrées ici et sur votre profil de la plateforme."
              : "Ces étapes sont celles cochées sur votre profil de la plateforme. Elles comptent comme validées ici, mais ne déclenchent pas de remise d'écusson. La modification depuis Flambeau Progrès arrivera prochainement."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {etapes.map((etape) => (
            <div
              key={etape.id}
              className="flex items-center justify-between gap-3 rounded-medium px-2 py-1"
            >
              <Checkbox
                isDisabled={!modifiable(etape)}
                isSelected={selection.includes(etape.id)}
                onValueChange={(coche) => basculer(etape.id, coche)}
              >
                <span className="text-small">
                  <span className="text-default-400">Étape {etape.number}</span>{" "}
                  {etape.name}
                </span>
              </Checkbox>

              {etape.origine === "APP" && (
                <Chip color="success" size="sm" variant="flat">
                  Validée dans l&apos;app
                </Chip>
              )}
              {etape.origine === "PLATEFORME" && (
                <Chip color="default" size="sm" variant="flat">
                  Plateforme
                </Chip>
              )}
            </div>
          ))}
        </div>

        {ecritureActive && (
          <div className="flex items-center gap-3">
            <Button
              color="primary"
              isDisabled={!aChange}
              isLoading={isPending}
              onPress={enregistrer}
            >
              Envoyer à la plateforme
            </Button>
            {message && (
              <span className="text-small text-default-500">{message}</span>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
