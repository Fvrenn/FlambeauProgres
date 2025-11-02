"use client";

import React from "react";
import { Tooltip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type JustificationsTableActionsProps = {
  justificationId: string;
};

export default function JustificationsTableActions({
  justificationId,
}: JustificationsTableActionsProps) {
  const handleView = () => {
    // Logique pour ouvrir la modale de validation (Étape 13)
    console.log("Voir la justification :", justificationId);
  };

  return (
    <div className="relative flex items-center gap-2">
      <Tooltip content="Consulter la justification">
        <Button isIconOnly size="sm" variant="light" onPress={handleView}>
          <Icon icon="solar:eye-linear" className="text-xl text-default-500" />
        </Button>
      </Tooltip>
    </div>
  );
}