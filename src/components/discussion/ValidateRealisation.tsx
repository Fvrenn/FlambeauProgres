"use client";

import React, { useState, useTransition } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

import { Icon } from "@/lib/icons";

interface ValidateRealisationProps {
  disabled?: boolean;
  onValidate: () => Promise<void>;
}

export default function ValidateRealisation({
  disabled,
  onValidate,
}: ValidateRealisationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await onValidate();
      setIsOpen(false);
    });
  };

  return (
    <Popover isOpen={isOpen} placement="top" onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          className="w-full font-medium bg-nav-active text-white data-[hover=true]:bg-nav-hover"
          isDisabled={disabled}
          startContent={<Icon icon="solar:check-circle-bold" width={18} />}
        >
          Valider la réalisation
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-3">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Valider la réalisation ?
            </p>
            <p className="text-xs text-default-500">
              Le fil sera clôturé : cette action est définitive.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              isDisabled={isPending}
              size="sm"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              className="bg-nav-active text-white data-[hover=true]:bg-nav-hover"
              isLoading={isPending}
              size="sm"
              onPress={handleConfirm}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
