import React, { useState } from "react";
import type { Badge } from "@/src/types/badge";
import { Tag, SquareBottomUp } from "@solar-icons/react";
import { useDisclosure } from "@heroui/modal";
import MaModal from "./Modal";
import { CustomButton } from "@/src/components/ui/Button";

interface RealisationsProps {
  badge?: Badge;
}

export default function Realisations({ badge }: RealisationsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRealisation, setSelectedRealisation] = useState<any>(null);

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
        <div key={index} className="flex-col px-6">
          <div className="flex items-start gap-2 py-6">
            <div className="flex items-center w-full">
              <span className="text-xl text-black border border-grey py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                {realisation.code}
              </span>
              <span className="w-4/5">{realisation.description}</span>

              <CustomButton
                className="ml-auto mr-3"
                theme="icon"
                onClick={() => {
                  setSelectedRealisation(realisation);
                  onOpen();
                }}
              >
                <SquareBottomUp weight="Linear" size={24} color="#171717" />
              </CustomButton>
            </div>
          </div>
          <hr className="border-light-grey" />
        </div>
      ))}
      {selectedRealisation && (
        <MaModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          competence={selectedRealisation}
          badge={badge}
        />
      )}
    </div>
  );
}