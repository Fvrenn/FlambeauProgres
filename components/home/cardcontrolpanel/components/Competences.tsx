import React from "react";
import { Badge } from "@/lib/badges";

interface CompetencesProps {
  badge?: Badge;
}

export default function Competences({ badge }: CompetencesProps) {
  if (!badge) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          Sélectionnez un badge pour voir ses compétences
        </p>
      </div>
    );
  }

  if (badge.competences.length === 0) {
    return (
      <p className="text-gray-500 text-sm">Aucune compétence pour ce badge.</p>
    );
  }

  return (
    <div className="mt-3">
      <hr className="border-light-grey" />
      {badge.competences.map((competence, index) => (
        <div key={index} className="flex-col px-6">
          <div className="flex items-start gap-2 py-6">
            <div className="flex items-center">
              <span className="text-xl text-black border border-grey py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                {competence.code}
              </span>
              <span>{competence.description}</span>
            </div>
          </div>
          <hr className="border-light-grey" />
        </div>
      ))}
    </div>
  );
}
