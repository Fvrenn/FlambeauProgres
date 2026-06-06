import React from "react";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { StatutJustification } from "@prisma/client";

interface StatusChipProps {
  statut: StatutJustification | null;
}

const STATUS_CONFIG: Record<
  StatutJustification,
  {
    color: "default" | "success" | "warning" | "secondary";
    icon: string;
    label: string;
  }
> = {
  BROUILLON: {
    color: "default",
    icon: "solar:pen-linear",
    label: "Brouillon",
  },
  AUTO_VALIDEE: {
    color: "success",
    icon: "solar:check-circle-linear",
    label: "Validé",
  },
  SOUMISE: {
    color: "warning",
    icon: "solar:clock-circle-linear",
    label: "En attente référent",
  },
  DEMANDE_PRECISION: {
    color: "secondary",
    icon: "solar:question-circle-linear",
    label: "Précisions demandées",
  },
  VALIDEE: {
    color: "success",
    icon: "solar:check-circle-bold",
    label: "Validé",
  },
};

export default function StatusChip({ statut }: StatusChipProps) {
  if (!statut) {
    return (
      <Chip color="default" size="sm" variant="flat">
        Non fait
      </Chip>
    );
  }

  const config = STATUS_CONFIG[statut];

  return (
    <Chip
      color={config.color}
      size="sm"
      startContent={<Icon icon={config.icon} width={16} />}
      variant="flat"
    >
      {config.label}
    </Chip>
  );
}
