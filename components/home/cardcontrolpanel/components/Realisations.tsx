import React from "react";
import type { Badge } from "@/types/badge";
import { Tag } from "@solar-icons/react";
interface RealisationsProps {
  badge?: Badge;
}

export default function Realisations({ badge }: RealisationsProps) {
  if (!badge) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <Tag weight={"Linear"} size={64} color="#9ca3af" />
        <p className="text-gray-500 text-sm">
          Sélectionnez un badge pour voir ses réalisations
        </p>
      </div>
    );
  }

  const realisations = badge.objectifs.filter(obj => obj.type === "REALISATION");

  return (
    <div className="mt-3">
      <hr className="border-light-grey" />
      {realisations.map((realisation, index) => (
        <div key={index} className="flex flex-col px-6">
          <div className="flex items-start gap-2 py-6">
            <div className="flex items-center">
              <span className="text-xl text-black border border-grey py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                {realisation.code}
              </span>
              <span>{realisation.description}</span>
            </div>
          </div>
          <hr className="border-light-grey" />
        </div>
      ))}
    </div>
  );
}
