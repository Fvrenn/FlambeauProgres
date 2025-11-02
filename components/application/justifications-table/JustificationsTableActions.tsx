"use client";

import React, { useState } from "react";
import { Tooltip, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import JustificationModal from "./JustificationModal";
import type { JustificationAvecRelations } from "./JustificationsTableColumns";

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
            <Icon icon="solar:eye-linear" className="text-xl text-default-500" />
          </Button>
        </Tooltip>
      </div>

      <JustificationModal
        justification={justification}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}