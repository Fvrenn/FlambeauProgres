"use client";

import React from "react";
import dynamic from "next/dynamic";
import { etape } from "@prisma/client";
import Image from "next/image";

const ChemiseModel = dynamic(
  () => import("./chemiseModel").then((mod) => mod.ChemiseModel),
  {
    ssr: false,
    loading: () => <p>Chargement du modèle...</p>,
  }
);

interface ContentChemiseProps {
  etapes: etape[];
}

export default function ContentChemise({ etapes }: ContentChemiseProps) {
  const [selectedEtape, setSelectedEtape] = React.useState<etape | null>(null);

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
              onClick={() => setSelectedEtape(etape)}
              className={`p-1 rounded-full transition-all duration-200 ease-in-out ${
                selectedEtape?.id === etape.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:scale-110"
              }`}
              aria-label={`Sélectionner l'étape ${etape.name}`}
            >
              <Image
                src={etape.image_src || "/etapes/default.svg"}
                alt={etape.name}
                width={60}
                height={60}
                className="w-14 h-14"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}