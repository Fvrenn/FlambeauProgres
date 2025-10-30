"use client";

import React from "react";
import dynamic from "next/dynamic";
import { EtapeAvecObjectifs } from "../DashboardClient";
import Image from "next/image";
import "./CardEtapes.css";

const ChemiseModel = dynamic(
  () => import("./chemiseModel").then((mod) => mod.ChemiseModel),
  {
    ssr: false,
    loading: () => <p>Chargement du modèle...</p>,
  }
);

interface ContentChemiseProps {
  etapes: EtapeAvecObjectifs[];
  selectedEtape: EtapeAvecObjectifs | null;
  onEtapeSelect: (etape: EtapeAvecObjectifs | null) => void;
}

export default function ContentChemise({
  etapes,
  selectedEtape,
  onEtapeSelect,
}: ContentChemiseProps) {
  return (
    <div className="bg-content1 h-full w-[345px] flex flex-col justify-between p-0.5 rounded-3xl">
      <div className="flex h-2/4 justify-center">
        <ChemiseModel selectedBadge={selectedEtape?.number} />
      </div>
      <div className="bg-default w-full h-2/4 rounded-3xl border p-7 border-[#F0EFE7]">
        <div className="grid grid-cols-3 gap-4 place-items-center">
          {etapes.map((etape) => (
            <button
              key={etape.id}
              onClick={() =>
                onEtapeSelect(selectedEtape?.id === etape.id ? null : etape)
              }
              aria-label={`Sélectionner l'étape ${etape.name}`}
              className="cursor-pointer holographic-card"
            >
              <Image
                src={etape.image_src || ""}
                alt={etape.name}
                width={67}
                height={77}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}