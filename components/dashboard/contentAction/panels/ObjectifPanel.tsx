import React from "react";
import { Etape, Objectif } from "@prisma/client";
import { Tabs, Tab } from "@heroui/react";

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
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "gap-8 w-full max-w-96 rounded-full p-0.5 bg-[#F3F2E9]",
            cursor: "!bg-danger-800 rounded-full before:content-['•'] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-black before:text-lg before:font-bold",
            tab: "px-6 h-12 relative",
            tabContent: "text-black group-data-[selected=true]:pl-6 group-data-[selected=true]:font-semibold font-medium transition-all duration-300 ease-in-out",
          }}
        >
          <Tab
            key="competence"
            title="Compétences"
          >
            <ul className="space-y-2 mt-4">
              {competences.map((c) => (
                <li key={c.id} className="p-2 rounded-md flex items-center">
                  <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                    {c.code}
                  </span>
                  {c.description}
                </li>
              ))}
            </ul>
          </Tab>
          <Tab
            key="realisations"
            title="Réalisations"
          >
            <ul className="space-y-2 mt-4">
              {realisations.map((r) => (
                <li key={r.id} className="p-2 rounded-md flex items-center">
                  <span className="text-xl text-foreground border border-default-800 py-3 px-2.5 rounded-full w-12 h-12 flex items-center justify-center mr-2.5">
                    {r.code}
                  </span>
                  {r.description}
                </li>
              ))}
            </ul>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}