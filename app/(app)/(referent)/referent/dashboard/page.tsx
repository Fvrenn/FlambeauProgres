import React from "react";

// Types pour les searchParams (bonne pratique)
type ReferentDashboardPageProps = {
  searchParams: { // Ce n'est pas une promesse
    etapeId?: string; // Le paramètre que ta sidebar va envoyer
  };
};

// C'est un Server Component (par défaut, pas de 'use client')
export default async function ReferentDashboardPage({
  searchParams,
}: ReferentDashboardPageProps) {
  // --- CORRECTION : Accès direct, sans await ---
  const etapeId = searchParams.etapeId;

  // Pour le débogage : tu verras l'ID de l'étape active dans ton terminal serveur
  console.log("ID de l'étape active (côté serveur) :", etapeId);

  // (Plus tard, tu utiliseras etapeId pour fetch les données Prisma)

  return (
    <div className="h-full max-h-screen flex flex-col overflow-hidden">
      <h4 className="text-3xl font-normal flex-shrink-0">
        Dashboard Référent
      </h4>

      <p className="mt-4">
        Contenu du dashboard pour l'étape (ID: {etapeId || "Non sélectionnée"})
      </p>

      {/* (C'est ici que tu mettras tes deux onglets :
        1. Réalisations à valider
        2. Badges complets à réviser)
      */}
    </div>
  );
}