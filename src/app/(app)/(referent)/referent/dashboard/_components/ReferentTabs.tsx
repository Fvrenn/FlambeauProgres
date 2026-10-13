"use client";
import { Tabs, Tab, Chip } from "@heroui/react";

export type OngletReferent = "a-valider" | "attente-du-chef" | "a-reviser";

const ONGLETS: {
  cle: OngletReferent;
  libelle: string;
  libelleCourt: string;
  couleurCompteur: "danger" | "default" | "success";
}[] = [
  {
    cle: "a-valider",
    libelle: "Réalisations à valider",
    libelleCourt: "Validations",
    couleurCompteur: "danger",
  },
  {
    cle: "attente-du-chef",
    libelle: "En attente du chef",
    libelleCourt: "En attente",
    couleurCompteur: "default",
  },
  {
    cle: "a-reviser",
    libelle: "Badges complets à réviser",
    libelleCourt: "Révisions",
    couleurCompteur: "success",
  },
];

interface ReferentTabsProps {
  selectedKey: OngletReferent;
  onSelectionChange: (onglet: OngletReferent) => void;
  compteurs: Record<OngletReferent, number>;
}

export default function ReferentTabs({
  selectedKey,
  onSelectionChange,
  compteurs,
}: ReferentTabsProps) {
  return (
    <div className="w-full flex justify-center md:justify-start">
      <Tabs
        aria-label="Onglets du dashboard référent"
        classNames={{
          base: "w-full md:w-auto",
          tabList:
            "gap-2 md:gap-4 w-full md:w-fit max-w-full overflow-x-auto rounded-full p-1 bg-dashboard-card scrollbar-hide",
          cursor: "!bg-nav-active rounded-full shadow-sm",
          tab: "px-3 md:px-6 h-10 md:h-12 relative text-xs md:text-sm whitespace-nowrap",
          tabContent:
            "text-black group-data-[selected=true]:text-white font-medium transition-colors duration-300 ease-in-out",
        }}
        selectedKey={selectedKey}
        onSelectionChange={(cle) => onSelectionChange(cle as OngletReferent)}
      >
        {ONGLETS.map(({ cle, libelle, libelleCourt, couleurCompteur }) => (
          <Tab
            key={cle}
            title={
              <div className="flex items-center gap-2">
                <span className="md:inline hidden">{libelle}</span>
                <span className="md:hidden inline">{libelleCourt}</span>
                {compteurs[cle] > 0 && (
                  <Chip
                    className="h-5 min-w-5 px-1 text-[10px]"
                    color={couleurCompteur}
                    size="sm"
                    variant="solid"
                  >
                    {compteurs[cle]}
                  </Chip>
                )}
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}
