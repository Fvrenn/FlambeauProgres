"use client";

import type { SortDescriptor } from "@heroui/react";
import type { ValidationEvent } from "@/lib/analytics";
import type { EspaceSuivi } from "@/lib/espaces-suivi";

import React from "react";
import Link from "next/link";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { versCsv } from "@/lib/analytics";
import { telechargerCsv } from "@/lib/csv";
import { lienDiscussion } from "@/lib/espaces-suivi";
import { estNiveauEtape3 } from "@/lib/roles";
import { Icon } from "@/lib/icons";
import {
  Badge,
  Button,
  CLASSES_TABLEAU,
  FiltreSegmente,
  Input,
} from "@/components/ui";

const LIGNES_PAR_PAGE = 20;

const COLONNES = [
  { key: "date", label: "Date", sortable: true },
  { key: "referentName", label: "Validé par", sortable: true },
  { key: "chefName", label: "Chef", sortable: true },
  { key: "etapeName", label: "Étape", sortable: true },
  { key: "objet", label: "Objet", sortable: false },
];

const TYPES = [
  { key: "TOUT", label: "Tout" },
  { key: "REALISATION", label: "Réalisations" },
  { key: "BADGE", label: "Badges" },
] as const;

const formatteurDate = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function JournalTable({
  evenements,
  espace,
}: {
  evenements: ValidationEvent[];
  espace: Exclude<EspaceSuivi, "referent">;
}) {
  const [recherche, setRecherche] = React.useState("");
  const [type, setType] = React.useState<(typeof TYPES)[number]["key"]>("TOUT");
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  const filtres = React.useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    return evenements.filter((evenement) => {
      if (type !== "TOUT" && evenement.type !== type) {
        return false;
      }

      if (!terme) {
        return true;
      }

      return [
        evenement.referentName,
        evenement.chefName,
        evenement.etapeName,
        evenement.objet,
      ]
        .join(" ")
        .toLowerCase()
        .includes(terme);
    });
  }, [evenements, recherche, type]);

  const triees = React.useMemo(() => {
    const colonne = sortDescriptor.column as string;

    return [...filtres].sort((a, b) => {
      const comparaison =
        colonne === "date"
          ? a.date.getTime() - b.date.getTime()
          : String(a[colonne as keyof ValidationEvent] ?? "").localeCompare(
              String(b[colonne as keyof ValidationEvent] ?? ""),
            );

      return sortDescriptor.direction === "descending"
        ? -comparaison
        : comparaison;
    });
  }, [filtres, sortDescriptor]);

  const pages = Math.max(1, Math.ceil(triees.length / LIGNES_PAR_PAGE));
  const pageCourante = Math.min(page, pages);
  const lignes = React.useMemo(
    () =>
      triees.slice(
        (pageCourante - 1) * LIGNES_PAR_PAGE,
        pageCourante * LIGNES_PAR_PAGE,
      ),
    [triees, pageCourante],
  );

  React.useEffect(() => {
    setPage(1);
  }, [recherche, type]);

  const exporter = React.useCallback(() => {
    telechargerCsv(
      versCsv(triees),
      `validations-${new Date().toISOString().slice(0, 10)}.csv`,
    );
  }, [triees]);

  const renderCell = (evenement: ValidationEvent, cle: React.Key) => {
    switch (cle) {
      case "date":
        return (
          <span className="tabular-nums whitespace-nowrap">
            {formatteurDate.format(evenement.date)}
          </span>
        );
      case "referentName":
        return <span className="font-medium">{evenement.referentName}</span>;
      case "chefName":
        return evenement.chefName;
      case "etapeName":
        return evenement.etapeName;
      case "objet":
        return (
          <div className="flex items-center gap-2 max-w-96">
            <Badge color={evenement.type === "BADGE" ? "secondary" : "default"}>
              {evenement.type === "BADGE" ? "Badge" : "Réal."}
            </Badge>
            {evenement.justificationId ? (
              <Link
                className="truncate text-nav-active underline-offset-2 hover:underline"
                href={lienDiscussion(
                  estNiveauEtape3(evenement.etapeNiveau) ? espace : "referent",
                  evenement.etapeId,
                  evenement.justificationId,
                )}
              >
                {evenement.objet}
              </Link>
            ) : (
              <span className="truncate">{evenement.objet}</span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            isClearable
            className="sm:max-w-72"
            placeholder="Chef, référent, étape, objectif…"
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={recherche}
            onClear={() => setRecherche("")}
            onValueChange={setRecherche}
          />
          <FiltreSegmente options={TYPES} valeur={type} onChange={setType} />
        </div>
        <Button
          size="sm"
          startIcon="solar:download-minimalistic-linear"
          variant="flat"
          onClick={exporter}
        >
          Export CSV
        </Button>
      </div>

      <Table
        aria-label="Historique des validations"
        classNames={CLASSES_TABLEAU}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={COLONNES}>
          {(colonne) => (
            <TableColumn key={colonne.key} allowsSorting={colonne.sortable}>
              {colonne.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="Aucune validation ne correspond"
          items={lignes}
        >
          {(evenement) => (
            <TableRow key={evenement.id}>
              {(cle) => <TableCell>{renderCell(evenement, cle)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-2">
        <Pagination
          isCompact
          showControls
          classNames={{
            wrapper: "gap-1",
            item: "bg-dashboard-panel text-foreground/60 shadow-none border-none text-sm font-medium rounded-[10px] hover:bg-dashboard-tab",
            cursor:
              "bg-nav-active text-white font-semibold rounded-[10px] shadow-none",
            prev: "bg-dashboard-panel text-foreground/60 shadow-none rounded-[10px] hover:bg-dashboard-tab",
            next: "bg-dashboard-panel text-foreground/60 shadow-none rounded-[10px] hover:bg-dashboard-tab",
          }}
          page={pageCourante}
          total={pages}
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {triees.length} validation{triees.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
