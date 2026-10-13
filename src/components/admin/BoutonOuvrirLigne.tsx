"use client";

import { Button } from "@/components/ui";

type BoutonOuvrirLigneProps = {
  label: string;
  onOuvrir: () => void;
};

export function BoutonOuvrirLigne({ label, onOuvrir }: BoutonOuvrirLigneProps) {
  return (
    <div className="flex items-center justify-end w-full pr-4">
      <Button
        isIconOnly
        aria-label={label}
        color="default"
        size="sm"
        startIcon="solar:arrow-right-linear"
        variant="ghost"
        onClick={(event) => {
          event.stopPropagation();
          onOuvrir();
        }}
      />
    </div>
  );
}
