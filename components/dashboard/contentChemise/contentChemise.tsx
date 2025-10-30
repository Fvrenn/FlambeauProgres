"use client";

import React from "react";
import dynamic from "next/dynamic";

// Importer dynamiquement ChemiseModel en désactivant le SSR
const ChemiseModel = dynamic(
  () => import("./chemiseModel").then((mod) => mod.ChemiseModel),
  {
    ssr: false,
    loading: () => <p>Chargement du modèle...</p>, // Optionnel: afficher un message de chargement
  }
);

export default function ContentChemise() {
  return (
    <div className="bg-content1 h-full w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="flex h-2/4 justify-center">
        <ChemiseModel />
      </div>
      <div className="bg-default w-full h-2/4 rounded-3xl border p-7 border-[#F0EFE7]">
        {" "}
        test
      </div>
    </div>
  );
}
