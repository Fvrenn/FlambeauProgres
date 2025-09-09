import React from "react";
import { Stopwatch, Plain, Notebook, CloseCircle, CheckCircle, DangerSquare } from "@solar-icons/react";
import type { StatutJustification } from "@prisma/client";

interface StatutBadgeProps {
  statut?: StatutJustification;
  className?: string;
  isLoading?: boolean;
}

export default function StatutBadge({ statut, className = "", isLoading = false }: StatutBadgeProps) {
  if (isLoading) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 ${className}`}>
        <Stopwatch size={12} className="animate-spin" />
        Mise à jour...
      </span>
    );
  }

  if (!statut) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 ${className}`}>
        <Stopwatch size={12} />
        Non démarré
      </span>
    );
  }

  const statutConfig: Record<StatutJustification, { icon: React.JSX.Element; text: string; classes: string }> = {
    BROUILLON: {
      icon: <Notebook size={12} />,
      text: "Brouillon",
      classes: "bg-orange-100 text-orange-700"
    },
    SOUMISE: {
      icon: <Plain size={12} />,
      text: "Soumise",
      classes: "bg-blue-100 text-blue-700"
    },
    EN_COURS: {
      icon: <Stopwatch size={12} />,
      text: "En cours",
      classes: "bg-yellow-100 text-yellow-700"
    },
    DEMANDE_PRECISION: {
      icon: <DangerSquare size={12} />,
      text: "Précision demandée",
      classes: "bg-purple-100 text-purple-700"
    },
    VALIDEE: {
      icon: <CheckCircle size={12} />,
      text: "Validée",
      classes: "bg-green-100 text-green-700"
    },
    REFUSEE: {
      icon: <CloseCircle size={12} />,
      text: "Refusée",
      classes: "bg-red-100 text-red-700"
    }
  };

  const config = statutConfig[statut];

  // Vérification de sécurité au cas où un nouveau statut serait ajouté
  if (!config) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 ${className}`}>
        <Stopwatch size={12} />
        {statut}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.classes} ${className}`}>
      {config.icon}
      {config.text}
    </span>
  );
}