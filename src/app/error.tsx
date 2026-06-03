"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">Une erreur est survenue</h2>
      <p className="max-w-md text-default-500">
        Quelque chose s&apos;est mal passé. Vous pouvez réessayer.
      </p>
      <button
        className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        onClick={() => reset()}
      >
        Réessayer
      </button>
    </div>
  );
}
