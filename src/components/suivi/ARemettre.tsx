"use client";

import type { Selection } from "@heroui/react";
import type { RemiseExistante } from "./MarquerRemisModal";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { formatteurJour } from "./format";
import { MarquerRemisModal } from "./MarquerRemisModal";

import { telechargerCsv } from "@/lib/csv";
import { Icon } from "@/lib/icons";
import { comparerGroupes, nomGroupe, versCsvARemettre } from "@/lib/suivi";
import { CelluleUtilisateur } from "@/components/admin/CelluleUtilisateur";
import { Button, CLASSES_TABLEAU, Input } from "@/components/ui";

export type BadgeARemettreLigne = {
  id: string;
  valideeAt: Date | null;
  chef: {
    name: string;
    email: string;
    image: string | null;
    groupe: string | null;
  };
  etape: { name: string; image_src: string | null };
  valideePar: { name: string } | null;
};

const TOUS = "tous";

const COLONNES = [
  { key: "chef", label: "Chef" },
  { key: "groupe", label: "Groupe" },
  { key: "badge", label: "Badge" },
  { key: "valideeAt", label: "Validé le" },
  { key: "valideePar", label: "Validé par" },
];

type ARemettreProps = {
  badges: BadgeARemettreLigne[];
  remisesExistantes: RemiseExistante[];
  peutGerer: boolean;
};

export function ARemettre({
  badges,
  remisesExistantes,
  peutGerer,
}: ARemettreProps) {
  const router = useRouter();
  const [groupe, setGroupe] = React.useState<string>(TOUS);
  const [recherche, setRecherche] = React.useState("");
  const [selection, setSelection] = React.useState<Selection>(new Set());
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const groupes = React.useMemo(
    () =>
      [...new Set(badges.map(({ chef }) => nomGroupe(chef)))].sort(
        comparerGroupes,
      ),
    [badges],
  );

  const filtres = React.useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    return badges
      .filter(
        (badge) =>
          (groupe === TOUS || nomGroupe(badge.chef) === groupe) &&
          (!terme ||
            [badge.chef.name, badge.etape.name].some((texte) =>
              texte.toLowerCase().includes(terme),
            )),
      )
      .sort(
        (a, b) =>
          comparerGroupes(nomGroupe(a.chef), nomGroupe(b.chef)) ||
          a.chef.name.localeCompare(b.chef.name, "fr"),
      );
  }, [badges, groupe, recherche]);

  const statutIds = React.useMemo(
    () =>
      selection === "all"
        ? filtres.map(({ id }) => id)
        : filtres.map(({ id }) => id).filter((id) => selection.has(id)),
    [selection, filtres],
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-tiny text-default-500">
        Badges validés dans Flambeaux Progrès et pas encore remis. Ceux importés
        de la plateforme sont considérés comme déjà remis.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            aria-label="Groupe"
            className="sm:max-w-56"
            selectedKeys={[groupe]}
            size="sm"
            onSelectionChange={(cles) => {
              setGroupe(String([...cles][0] ?? TOUS));
              setSelection(new Set());
            }}
          >
            {[TOUS, ...groupes].map((option) => (
              <SelectItem key={option}>
                {option === TOUS ? "Tous les groupes" : option}
              </SelectItem>
            ))}
          </Select>
          <Input
            isClearable
            className="sm:max-w-72"
            placeholder="Chef, badge…"
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={recherche}
            onClear={() => setRecherche("")}
            onValueChange={setRecherche}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={filtres.length === 0}
            size="sm"
            startIcon="solar:download-minimalistic-linear"
            variant="flat"
            onClick={() =>
              telechargerCsv(
                versCsvARemettre(filtres),
                `badges-a-remettre-${new Date().toISOString().slice(0, 10)}.csv`,
              )
            }
          >
            Export CSV
          </Button>
          {peutGerer && (
            <Button
              color="primary"
              disabled={statutIds.length === 0}
              size="sm"
              startIcon="solar:medal-ribbon-linear"
              onClick={() => setIsModalOpen(true)}
            >
              {statutIds.length > 0
                ? `Marquer comme remis (${statutIds.length})`
                : "Marquer comme remis"}
            </Button>
          )}
        </div>
      </div>

      <Table
        aria-label="Badges à remettre"
        classNames={CLASSES_TABLEAU}
        selectedKeys={selection}
        selectionMode={peutGerer ? "multiple" : "none"}
        onSelectionChange={setSelection}
      >
        <TableHeader columns={COLONNES}>
          {(colonne) => (
            <TableColumn key={colonne.key}>{colonne.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="Aucun badge à remettre" items={filtres}>
          {(badge) => (
            <TableRow key={badge.id}>
              <TableCell>
                <CelluleUtilisateur utilisateur={badge.chef} />
              </TableCell>
              <TableCell>{nomGroupe(badge.chef)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {badge.etape.image_src && (
                    <Image
                      alt=""
                      className="shrink-0 object-contain"
                      height={24}
                      src={badge.etape.image_src}
                      width={24}
                    />
                  )}
                  <span className="font-medium">{badge.etape.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="tabular-nums">
                  {badge.valideeAt
                    ? formatteurJour.format(badge.valideeAt)
                    : "—"}
                </span>
              </TableCell>
              <TableCell>{badge.valideePar?.name ?? "—"}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {peutGerer && (
        <MarquerRemisModal
          isOpen={isModalOpen}
          remisesExistantes={remisesExistantes}
          statutIds={statutIds}
          onClose={() => setIsModalOpen(false)}
          onRemis={() => {
            setIsModalOpen(false);
            setSelection(new Set());
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
