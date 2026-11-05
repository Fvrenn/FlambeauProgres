"use client";

import React from "react";
import { Radio, RadioGroup, Select, SelectItem } from "@heroui/react";

import { formatteurJour } from "./format";

import { marquerBadgesRemis } from "@/actions/suivi/remise.actions";
import { FormModal } from "@/components/admin/FormModal";
import { useSoumissionModal } from "@/components/admin/useSoumissionModal";
import { Input } from "@/components/ui";

export type RemiseExistante = { id: string; nom: string; date: Date };

type MarquerRemisModalProps = {
  isOpen: boolean;
  statutIds: string[];
  remisesExistantes: RemiseExistante[];
  onClose: () => void;
  onRemis: () => void;
};

const aujourdhui = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(
    new Date(),
  );

export function MarquerRemisModal({
  isOpen,
  statutIds,
  remisesExistantes,
  onClose,
  onRemis,
}: MarquerRemisModalProps) {
  const [mode, setMode] = React.useState<"nouvelle" | "existante">("nouvelle");
  const [nom, setNom] = React.useState("");
  const [date, setDate] = React.useState(aujourdhui);
  const [remiseId, setRemiseId] = React.useState(
    remisesExistantes[0]?.id ?? "",
  );
  const { isPending, erreur, setErreur, soumettre } =
    useSoumissionModal(onRemis);

  const fermer = () => {
    setErreur(null);
    onClose();
  };

  return (
    <FormModal
      erreur={erreur}
      isOpen={isOpen}
      isPending={isPending}
      submitLabel={`Marquer ${statutIds.length} badge${statutIds.length > 1 ? "s" : ""} comme remis`}
      title="Remise de badges"
      onClose={fermer}
      onSubmit={(event) => {
        event.preventDefault();
        soumettre(() =>
          marquerBadgesRemis({
            statutIds,
            remise: mode === "nouvelle" ? { nom, date } : { remiseId },
          }),
        );
      }}
    >
      <RadioGroup
        aria-label="Remise"
        value={mode}
        onValueChange={(valeur) => setMode(valeur as typeof mode)}
      >
        <Radio value="nouvelle">Nouvelle remise</Radio>
        <Radio isDisabled={remisesExistantes.length === 0} value="existante">
          Ajouter à une remise existante
        </Radio>
      </RadioGroup>

      {mode === "nouvelle" ? (
        <div className="flex flex-col gap-3">
          <Input
            isRequired
            label="Nom de la remise"
            maxLength={120}
            minLength={2}
            placeholder="AG 2026, Rencontres nationales 2026…"
            value={nom}
            onValueChange={setNom}
          />
          <Input
            isRequired
            label="Date"
            type="date"
            value={date}
            onValueChange={setDate}
          />
        </div>
      ) : (
        <Select
          isRequired
          label="Remise"
          selectedKeys={remiseId ? [remiseId] : []}
          onSelectionChange={(cles) => setRemiseId(String([...cles][0] ?? ""))}
        >
          {remisesExistantes.map((remise) => (
            <SelectItem key={remise.id}>
              {`${remise.nom} — ${formatteurJour.format(remise.date)}`}
            </SelectItem>
          ))}
        </Select>
      )}
    </FormModal>
  );
}
