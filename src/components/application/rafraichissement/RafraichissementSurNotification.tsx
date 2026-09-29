"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getSignatureNotifications } from "@/actions/notification/notification.actions";

const INTERVALLE_VERIFICATION_MS = 30_000;

type RafraichissementSurNotificationProps = {
  signature: string;
};

export function RafraichissementSurNotification({
  signature,
}: RafraichissementSurNotificationProps) {
  const router = useRouter();
  const signatureAffichee = useRef(signature);

  useEffect(() => {
    signatureAffichee.current = signature;
  }, [signature]);

  useEffect(() => {
    const verifier = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      const actuelle = await getSignatureNotifications().catch(() => null);

      if (actuelle && actuelle !== signatureAffichee.current) {
        signatureAffichee.current = actuelle;
        router.refresh();
      }
    };

    const intervalId = setInterval(verifier, INTERVALLE_VERIFICATION_MS);

    document.addEventListener("visibilitychange", verifier);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", verifier);
    };
  }, [router]);

  return null;
}
