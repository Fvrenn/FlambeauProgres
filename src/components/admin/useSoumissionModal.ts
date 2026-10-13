"use client";

import { useState, useTransition } from "react";

type ResultatAction = { success: boolean; error?: string };

export function useSoumissionModal(onSucces: () => void) {
  const [isPending, startTransition] = useTransition();
  const [erreur, setErreur] = useState<string | null>(null);

  const soumettre = (action: () => Promise<ResultatAction>) => {
    setErreur(null);
    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        setErreur(result.error ?? "Une erreur est survenue");

        return;
      }

      onSucces();
    });
  };

  return { isPending, erreur, setErreur, soumettre };
}
