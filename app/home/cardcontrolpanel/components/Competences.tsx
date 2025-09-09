import React, { useState } from "react";
import type { Badge } from "@/src/types/badge";
import { Tag } from "@solar-icons/react";
import { useDisclosure } from "@heroui/modal";
import MaModal from "./Modal";
import { SquareBottomUp } from "@solar-icons/react";
import { CustomButton } from "@/src/components/ui/Button";
import StatutBadge from "./StatutBadge";

interface CompetencesProps {
  badge?: Badge;
}

export default function Competences({ badge }: CompetencesProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCompetence, setSelectedCompetence] = useState<any>(null);

  if (!badge) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <Tag weight={"Linear"} size={64} color="#9ca3af" />
        <p className="text-gray-500 text-sm">
          Sélectionnez un badge pour voir ses compétences{" "}
        </p>
      </div>
    );
  }

  const competences = badge.objectifs.filter(obj => obj.type === "COMPETENCE");

  return (
    <div className="mt-3">
      <hr className="border-light-grey" />
      {competences.map((competence, index) => {
        const justification = competence.justifications?.[0];

        return (
          <div key={index} className="flex-col px-6">
            <div className="flex items-start gap-2 py-6">
              <div className="flex items-center w-full">
                <span className="text-xl text-black border border-grey py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                  {competence.code}
                </span>
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-sm">{competence.description}</span>
                  <StatutBadge statut={justification?.statut} />
                </div>

                <CustomButton
                  className="ml-auto mr-3"
                  theme="icon"
                  onClick={() => {
                    setSelectedCompetence(competence);
                    onOpen();
                  }}
                >
                  <SquareBottomUp weight="Linear" size={24} color="#171717" />
                </CustomButton>
              </div>
            </div>
            <hr className="border-light-grey" />
          </div>
        );
      })}
      {selectedCompetence && (
        <MaModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          competence={selectedCompetence}
          badge={badge}
        />
      )}
    </div>
  );
}
