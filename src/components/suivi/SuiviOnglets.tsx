"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Chip, Tab, Tabs } from "@heroui/react";

import { StatCard } from "@/components/ui";

export type OngletSuivi = "en-attente" | "a-remettre" | "historique";

const ONGLETS: OngletSuivi[] = ["en-attente", "a-remettre", "historique"];

type SuiviOngletsProps = {
  compteurs: {
    aEvaluer: number;
    enAttenteDuChef: number;
    aValider: number;
    aRemettre: number;
  };
  enAttente: React.ReactNode;
  aRemettre: React.ReactNode;
  historique: React.ReactNode;
};

export function SuiviOnglets({
  compteurs,
  enAttente,
  aRemettre,
  historique,
}: SuiviOngletsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const demande = searchParams.get("onglet");
  const onglet = ONGLETS.find((cle) => cle === demande) ?? "en-attente";

  const choisir = (cle: OngletSuivi) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("onglet", cle);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const enAttenteTotal =
    compteurs.aEvaluer + compteurs.enAttenteDuChef + compteurs.aValider;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon="solar:clipboard-check-linear"
          label="Réalisations à évaluer"
          tone={compteurs.aEvaluer > 0 ? "warning" : "success"}
          value={compteurs.aEvaluer}
          onSelect={() => choisir("en-attente")}
        />
        <StatCard
          icon="solar:clock-circle-linear"
          label="En attente du chef"
          value={compteurs.enAttenteDuChef}
          onSelect={() => choisir("en-attente")}
        />
        <StatCard
          icon="solar:verified-check-linear"
          label="Dossiers à valider"
          tone={compteurs.aValider > 0 ? "warning" : "success"}
          value={compteurs.aValider}
          onSelect={() => choisir("en-attente")}
        />
        <StatCard
          icon="solar:medal-ribbon-linear"
          label="Badges à remettre"
          value={compteurs.aRemettre}
          onSelect={() => choisir("a-remettre")}
        />
      </div>

      <Tabs
        aria-label="Onglets du suivi"
        classNames={{
          base: "w-full md:w-auto",
          tabList:
            "gap-2 md:gap-4 w-full md:w-fit max-w-full overflow-x-auto rounded-full p-1 bg-dashboard-card scrollbar-hide",
          cursor: "!bg-nav-active rounded-full shadow-sm",
          tab: "px-3 md:px-6 h-10 md:h-12 text-xs md:text-sm whitespace-nowrap",
          tabContent:
            "text-black group-data-[selected=true]:text-white font-medium transition-colors duration-300 ease-in-out",
          panel: "px-0 pt-4",
        }}
        selectedKey={onglet}
        onSelectionChange={(cle) => choisir(cle as OngletSuivi)}
      >
        <Tab
          key="en-attente"
          title={<TitreOnglet compteur={enAttenteTotal} libelle="En attente" />}
        >
          {enAttente}
        </Tab>
        <Tab
          key="a-remettre"
          title={
            <TitreOnglet compteur={compteurs.aRemettre} libelle="À remettre" />
          }
        >
          {aRemettre}
        </Tab>
        <Tab key="historique" title="Historique">
          {historique}
        </Tab>
      </Tabs>
    </div>
  );
}

function TitreOnglet({
  libelle,
  compteur,
}: {
  libelle: string;
  compteur: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{libelle}</span>
      {compteur > 0 && (
        <Chip
          className="h-5 min-w-5 px-1 text-[10px]"
          color="danger"
          size="sm"
          variant="solid"
        >
          {compteur}
        </Chip>
      )}
    </div>
  );
}
