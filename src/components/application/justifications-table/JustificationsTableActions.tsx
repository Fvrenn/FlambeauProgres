"use client";

import type { JustificationAvecRelations } from "./JustificationsTableColumns";

import React, { useState } from "react";
import { Tooltip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import JustificationModal from "./JustificationModal";

type JustificationsTableActionsProps = {
  justification: JustificationAvecRelations;
};

export default function JustificationsTableActions({
  justification,
}: JustificationsTableActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative flex items-center gap-2">
        <Tooltip content="Consulter la justification">
          <Button isIconOnly size="sm" variant="light" onPress={handleView}>
            <Icon
              className="text-xl text-default-500"
              icon="solar:eye-linear"
            />
          </Button>
        </Tooltip>
      </div>

      <JustificationModal
        isOpen={isModalOpen}
        justification={justification}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
