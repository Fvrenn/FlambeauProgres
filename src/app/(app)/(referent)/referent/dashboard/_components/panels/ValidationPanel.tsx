"use client";
import React from "react";
import { Chip } from "@heroui/react";
import { Justification } from "@prisma/client";

import { Icon } from "@/lib/icons";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { Avatar, Card, CardBody, Button } from "@/components/ui";

type ChefInfo = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type ObjectifInfo = {
  id: string;
  code: string;
  description: string;
};

type JustificationAValider = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
  messages: { auteurId: string }[];
};

interface ValidationPanelProps {
  justifications: JustificationAValider[];
  onJustificationClick: (justification: JustificationAValider) => void;
}

const columns: Column[] = [
  { key: "chefName", label: "CHEF", sortable: true },
  { key: "objectif", label: "RÉALISATION" },
  { key: "soumiseAt", label: "SOUMIS", sortable: true },
  { key: "statut", label: "STATUT" },
  { key: "actions", label: "ACTIONS" },
];

function hasDiscussion(justification: JustificationAValider): boolean {
  return justification.messages.some(
    (message) => message.auteurId !== justification.chefId,
  );
}

function formatSoumiseAt(date: Date | null): string {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ValidationPanel({
  justifications,
  onJustificationClick,
}: ValidationPanelProps) {
  if (justifications.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-default-500 text-sm">Rien à valider</p>
      </div>
    );
  }

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
      case "soumiseAt":
        return (
          <span className="text-sm text-default-500">
            {formatSoumiseAt(justification.soumiseAt)}
          </span>
        );
      case "statut":
        return hasDiscussion(justification) ? (
          <Chip
            color="secondary"
            size="sm"
            startContent={
              <Icon icon="solar:question-circle-linear" width={14} />
            }
            variant="flat"
          >
            Précision demandée
          </Chip>
        ) : (
          <Chip
            color="danger"
            size="sm"
            startContent={<Icon icon="solar:bell-linear" width={14} />}
            variant="flat"
          >
            Nouveau
          </Chip>
        );
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
                  {formatSoumiseAt(justification.soumiseAt)}
                </span>
              </div>
              {hasDiscussion(justification) ? (
                <Chip color="secondary" size="sm" variant="flat">
                  Précision
                </Chip>
              ) : (
                <Chip color="danger" size="sm" variant="flat">
                  Nouveau
                </Chip>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
