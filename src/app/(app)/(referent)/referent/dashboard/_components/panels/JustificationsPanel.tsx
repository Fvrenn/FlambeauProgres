"use client";

import type { JustificationSuivie } from "@/types";

import React from "react";
import { Chip } from "@heroui/react";

import { Icon } from "@/lib/icons";
import { formaterAnciennete } from "@/lib/dates";
import { suiviReferent, type SuiviReferent } from "@/lib/justification";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Avatar, Card, CardBody, Button } from "@/components/ui";

type ListeJustifications = "a-valider" | "attente-du-chef";

const LISTES: Record<
  ListeJustifications,
  {
    libelleDate: string;
    messageVide: string;
    formaterDate: (justification: JustificationSuivie) => string;
  }
> = {
  "a-valider": {
    libelleDate: "SOUMIS",
    messageVide: "Rien à valider",
    formaterDate: (justification) => formaterSoumiseAt(justification.soumiseAt),
  },
  "attente-du-chef": {
    libelleDate: "QUESTION POSÉE",
    messageVide: "Aucune réponse attendue d'un chef",
    formaterDate: (justification) =>
      formaterAnciennete(new Date(justification.updatedAt)),
  },
};

const CHIPS_SUIVI: Record<
  SuiviReferent,
  {
    libelle: string;
    icone: string;
    couleur: "danger" | "secondary" | "default";
  }
> = {
  nouveau: {
    libelle: "Nouveau",
    icone: "solar:bell-linear",
    couleur: "danger",
  },
  "reponse-du-chef": {
    libelle: "Réponse du chef",
    icone: "solar:chat-round-dots-linear",
    couleur: "secondary",
  },
  "attente-du-chef": {
    libelle: "En attente du chef",
    icone: "solar:clock-circle-linear",
    couleur: "default",
  },
};

interface JustificationsPanelProps {
  liste: ListeJustifications;
  justifications: JustificationSuivie[];
  onJustificationClick: (justification: JustificationSuivie) => void;
}

export default function JustificationsPanel({
  liste,
  justifications,
  onJustificationClick,
}: JustificationsPanelProps) {
  const { libelleDate, messageVide, formaterDate } = LISTES[liste];

  if (justifications.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-default-500 text-sm">{messageVide}</p>
      </div>
    );
  }

  const columns: Column[] = [
    { key: "chefName", label: "CHEF", sortable: true },
    { key: "objectif", label: "RÉALISATION" },
    { key: "date", label: libelleDate },
    { key: "statut", label: "STATUT" },
    { key: "actions", label: "ACTIONS" },
  ];

  const data = justifications.map((justification) => ({
    ...justification,
    chefName: justification.chef.name,
    chefEmail: justification.chef.email,
    objectifCode: justification.objectif.code,
  }));

  const renderCell = (
    justification: (typeof data)[number],
    columnKey: React.Key,
  ) => {
    switch (columnKey) {
      case "chefName":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={justification.chef.name}
              size="sm"
              src={justification.chef.image}
            />
            <div className="flex flex-col">
              <p className="text-bold text-small">{justification.chef.name}</p>
              <p className="text-bold text-tiny text-default-400">
                {justification.chef.email}
              </p>
            </div>
          </div>
        );
      case "objectif":
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium border border-dashboard-border rounded-full px-2 py-1 flex-shrink-0">
              {justification.objectif.code}
            </span>
            <span className="text-sm text-foreground line-clamp-1">
              {justification.objectif.description}
            </span>
          </div>
        );
      case "date":
        return (
          <span className="text-sm text-default-500">
            {formaterDate(justification)}
          </span>
        );
      case "statut":
        return <ChipSuivi justification={justification} />;
      case "actions":
        return (
          <div className="flex items-center justify-end w-full pr-4">
            <Button
              isIconOnly
              aria-label="Ouvrir"
              color="default"
              size="sm"
              startIcon="solar:arrow-right-linear"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onJustificationClick(justification);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="hidden sm:block">
        <AdminDataTable
          columns={columns}
          data={data}
          renderCell={renderCell}
          searchPlaceholder="Rechercher un chef, une réalisation..."
          onRowAction={(key) => {
            const justification = data.find((item) => item.id === key);

            if (justification) onJustificationClick(justification);
          }}
        />
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {justifications.map((justification) => (
          <Card
            key={justification.id}
            isPressable
            className="w-full"
            onClick={() => onJustificationClick(justification)}
          >
            <CardBody className="flex-row items-center gap-3">
              <Avatar
                name={justification.chef.name}
                size="md"
                src={justification.chef.image}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold truncate">
                  {justification.chef.name}
                </span>
                <span className="text-xs text-default-400 truncate">
                  {justification.objectif.code} -{" "}
                  {justification.objectif.description}
                </span>
                <span className="text-[11px] text-default-400 mt-0.5">
                  {formaterDate(justification)}
                </span>
              </div>
              <ChipSuivi justification={justification} />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ChipSuivi({ justification }: { justification: JustificationSuivie }) {
  const { libelle, icone, couleur } = CHIPS_SUIVI[suiviReferent(justification)];

  return (
    <Chip
      className="shrink-0"
      color={couleur}
      size="sm"
      startContent={<Icon icon={icone} width={14} />}
      variant="flat"
    >
      {libelle}
    </Chip>
  );
}

function formaterSoumiseAt(date: Date | null): string {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
