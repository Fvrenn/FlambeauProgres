"use client";

import React, { useState, useTransition } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface ValidateRealisationProps {
  disabled?: boolean;
  onValidate: (word: string) => Promise<void>;
}

export default function ValidateRealisation({
  disabled,
  onValidate,
}: ValidateRealisationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await onValidate(word);
      setWord("");
      setIsOpen(false);
    });
  };

  return (
    <Popover isOpen={isOpen} placement="top" onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          className="w-full font-medium"
          color="success"
          isDisabled={disabled}
          startContent={<Icon icon="solar:check-circle-bold" width={18} />}
          variant="flat"
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

          <Input
            label="Petit mot (optionnel)"
            placeholder="Bravo, beau travail !"
            size="sm"
            value={word}
            onValueChange={setWord}
          />

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
              color="success"
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
