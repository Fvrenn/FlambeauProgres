import React from "react";
import { BadgeComplete } from "@/lib/badges";

interface CompetencesProps {
  badge?: BadgeComplete;
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
    return <p className="text-gray-500 text-sm">Aucune compétence pour ce badge.</p>;
  }

  return (
    <div>
      <h5 className="font-medium mb-3">Compétences :</h5>
      <ul className="space-y-2">
        {badge.competences.map((competence, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
            <span className="text-sm text-gray-700">
              {competence.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}