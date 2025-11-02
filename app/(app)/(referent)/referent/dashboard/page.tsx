import React from "react";
import prisma from "@/src/lib/prisma";
import ReferentDashboardClient from "./ReferentDashboardClient";

type ReferentDashboardPageProps = {
  searchParams: Promise<{
    etapeId?: string;
  }>;
};

export default async function ReferentDashboardPage({
  searchParams,
}: ReferentDashboardPageProps) {
  // Avec Next.js 15, searchParams est une Promise
  const params = await searchParams;
  const etapeId = params.etapeId;

  console.log("ID de l'étape active (côté serveur) :", etapeId);

  if (!etapeId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg text-default-500">
          Veuillez sélectionner une étape dans le menu de gauche pour commencer.
        </p>
      </div>
    );
  }

  const justificationsAValider = await prisma.justification.findMany({
    where: {
      etapeId: etapeId,
      statut: "SOUMISE",
    },
    include: {
      chef: true,
      objectif: true,
    },
    orderBy: {
      soumiseAt: "asc",
    },
  });

  return (
    <ReferentDashboardClient justificationsAValider={justificationsAValider} />
  );
}