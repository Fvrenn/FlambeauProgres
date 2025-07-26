import React from "react";
import { Badge } from "@/lib/badges";

interface RealisationsProps {
  badge?: Badge;
}

export default function Realisations({ badge }: RealisationsProps) {
  if (!badge) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          Sélectionnez un badge pour voir ses réalisations
        </p>
      </div>
    );
  }

  if (badge.realisations.length === 0) {
    return <p className="text-gray-500 text-sm">Aucune réalisation pour ce badge.</p>;
  }

  return (
    <div>
      <h5 className="font-medium mb-3">Réalisations :</h5>
      <ul className="space-y-3">
        {badge.realisations.map((realisation, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
              {index + 1}
            </div>
            <span className="text-sm leading-relaxed">
              {realisation.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}