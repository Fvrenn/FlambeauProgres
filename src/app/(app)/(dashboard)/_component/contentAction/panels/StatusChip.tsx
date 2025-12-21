import React from "react";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { StatutJustification } from "@prisma/client";

interface StatusChipProps {
  statut: StatutJustification | null;
}

const STATUS_CONFIG = {
  BROUILLON: {
    color: "default" as const,
    icon: "solar:pen-linear",
    label: "Brouillon",
  },
  AUTO_VALIDEE: {
    color: "success" as const,
    icon: "solar:check-circle-linear",
    label: "Validé",
  },
  SOUMISE: {
    color: "warning" as const,
    icon: "solar:clock-circle-linear",
    label: "En attente",
  },
  EN_COURS: {
    color: "primary" as const,
    icon: "solar:eye-linear",
    label: "En cours",
  },
  DEMANDE_PRECISION: {
    color: "secondary" as const,
    icon: "solar:question-circle-linear",
    label: "Précision",
  },
  VALIDEE: {
    color: "success" as const,
    icon: "solar:check-circle-bold",
    label: "Validé",
  },
  REFUSEE: {
    color: "danger" as const,
    icon: "solar:close-circle-linear",
    label: "Refusé",
  },
} as const;

export default function StatusChip({ statut }: StatusChipProps) {
  
  if (!statut) {
    return (
      <Chip color="default" variant="flat" size="sm">
        Non fait
      </Chip>
    );
  }

  const config = STATUS_CONFIG[statut];

  return (
    <Chip
      color={config.color}
      variant="flat"
      size="sm"
      startContent={<Icon icon={config.icon} width={16} />}
    >
      {config.label}
    </Chip>
  );
}