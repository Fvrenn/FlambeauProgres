import { Divider } from "@heroui/divider";

import { ObjectifAvecJustification } from "../../DashboardClient";

import StatusChip from "./StatusChip";

import { Icon } from "@/lib/icons";

type ObjectifLigneProps = {
  objectif: ObjectifAvecJustification;
  onOpen: () => void;
};

export default function ObjectifLigne({
  objectif,
  onOpen,
}: ObjectifLigneProps) {
  const statut = objectif.justifications[0]?.statut ?? null;

  return (
    <li>
      <button
        aria-label={`Ouvrir l'objectif ${objectif.code}`}
        className="group w-full cursor-pointer rounded-xl px-5 py-4 text-left transition-colors hover:bg-dashboard-tab"
        type="button"
        onClick={onOpen}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashboard-border text-sm font-semibold text-foreground">
            {objectif.code}
          </span>
          <span className="hidden flex-1 text-[16px] md:block">
            {objectif.description}
          </span>
          <span className="ml-auto shrink-0 rounded-full transition group-hover:brightness-95 group-active:scale-[0.97]">
            <StatusChip
              endContent={
                <Icon icon="solar:alt-arrow-right-linear" width={14} />
              }
              statut={statut}
            />
          </span>
        </div>
        <p className="mt-2 text-[16px] md:hidden">{objectif.description}</p>
      </button>
      <div className="px-5">
        <Divider />
      </div>
    </li>
  );
}
