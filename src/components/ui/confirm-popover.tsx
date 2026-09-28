"use client";

import React, { useState, useTransition } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

type ResultatAction = { success: boolean; error?: string };

type ConfirmPopoverProps = {
  titre: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<ResultatAction>;
  children: React.ReactElement;
};

export function ConfirmPopover({
  titre,
  message,
  confirmLabel,
  onConfirm,
  children,
}: ConfirmPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (ouvert: boolean) => {
    setErreur(null);
    setIsOpen(ouvert);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await onConfirm();

      if (!result.success) {
        setErreur(result.error ?? "Une erreur est survenue");

        return;
      }

      setIsOpen(false);
    });
  };

  return (
    <Popover isOpen={isOpen} placement="top" onOpenChange={handleOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent className="w-72 p-3">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{titre}</p>
            <p className="text-xs text-default-500">{message}</p>
          </div>

          {erreur && <p className="text-xs text-danger">{erreur}</p>}

          <div className="flex justify-end gap-2">
            <Button
              isDisabled={isPending}
              size="sm"
              variant="light"
              onPress={() => handleOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              color="danger"
              isLoading={isPending}
              size="sm"
              onPress={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
