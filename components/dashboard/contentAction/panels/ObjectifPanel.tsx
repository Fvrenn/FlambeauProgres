import React from "react";
import { Etape, Objectif } from "@prisma/client";

type EtapeAvecObjectifs = Etape & {
  objectifs: Objectif[];
};

interface ObjectifPanelProps {
  selectedEtape: EtapeAvecObjectifs | null;
}

export default function ObjectifPanel({ selectedEtape }: ObjectifPanelProps) {
  if (!selectedEtape) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Sélectionnez un badge sur la chemise pour voir ses objectifs.</p>
      </div>
    );
  }

  const competences = selectedEtape.objectifs.filter(
    (o) => o.type === "COMPETENCE"
  );
  const realisations = selectedEtape.objectifs.filter(
    (o) => o.type === "REALISATION"
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Objectifs de l'étape : {selectedEtape.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-2">
            Compétences
          </h3>
          <ul className="space-y-2">
            {competences.map((c) => (
              <li key={c.id} className="p-2 rounded-md bg-gray-50">
                <span className="font-mono text-sm bg-gray-200 px-1.5 py-0.5 rounded mr-2">
                  {c.code}
                </span>
                {c.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-2">
            Réalisations
          </h3>
          <ul className="space-y-2">
            {realisations.map((r) => (
              <li key={r.id} className="p-2 rounded-md bg-gray-50">
                <span className="font-mono text-sm bg-gray-200 px-1.5 py-0.5 rounded mr-2">
                  {r.code}
                </span>
                {r.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}