"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const rendusDejaAffiches = new Set<string>();

type RafraichirSiDejaAfficheProps = {
  rendu: string;
};

export function RafraichirSiDejaAffiche({
  rendu,
}: RafraichirSiDejaAfficheProps) {
  const router = useRouter();
  const estTraite = useRef(false);

  useEffect(() => {
    if (estTraite.current) {
      return;
    }

    estTraite.current = true;

    if (rendusDejaAffiches.has(rendu)) {
      router.refresh();

      return;
    }

    rendusDejaAffiches.add(rendu);
  }, [rendu, router]);

  return null;
}
