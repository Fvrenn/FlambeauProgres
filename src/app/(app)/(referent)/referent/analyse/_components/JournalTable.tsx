"use client";

import type { SortDescriptor } from "@heroui/react";
import type { ValidationEvent } from "@/lib/analytics";

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
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { Badge, Button, Input } from "@/components/ui";

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

function versCsv(evenements: ValidationEvent[]): string {
  const entetes = [
    "Date",
    "Type",
    "Valide par",
    "Role",
    "Chef",
    "Etape",
    "Objet",
  ];
  const echapper = (valeur: string) => `"${valeur.replace(/"/g, '""')}"`;

  const lignes = evenements.map((evenement) =>
    [
      evenement.date.toISOString(),
      evenement.type,
      evenement.referentName,
      evenement.referentRole,
      evenement.chefName,
      evenement.etapeName,
      evenement.objet,
    ]
      .map(echapper)
      .join(";"),
  );

  return [entetes.map(echapper).join(";"), ...lignes].join("\r\n");
}

export function JournalTable({
  evenements,
}: {
  evenements: ValidationEvent[];
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
    const blob = new Blob([`﻿${versCsv(triees)}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = `validations-${new Date().toISOString().slice(0, 10)}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
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
            <Badge
              color={evenement.type === "BADGE" ? "secondary" : "default"}
              size="sm"
            >
              {evenement.type === "BADGE" ? "Badge" : "Réal."}
            </Badge>
            {evenement.justificationId ? (
              <Link
                className="truncate text-nav-active underline-offset-2 hover:underline"
                href={`/referent/dashboard?etapeId=${evenement.etapeId}&justification=${evenement.justificationId}`}
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
          <div className="flex rounded-full bg-dashboard-card p-1">
            {TYPES.map((option) => (
              <button
                key={option.key}
                aria-pressed={type === option.key}
                className={cn(
                  "rounded-full px-3 py-1.5 text-tiny font-medium transition-colors duration-fast",
                  type === option.key
                    ? "bg-nav-active text-white"
                    : "text-default-500 hover:text-foreground",
                )}
                type="button"
                onClick={() => setType(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
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
        classNames={{
          wrapper: [
            "rounded-[22px]",
            "bg-dashboard-panel",
            "shadow-none",
            "border-none",
            "p-0",
          ],
          th: [
            "bg-transparent",
            "text-[11px]",
            "font-semibold",
            "uppercase",
            "tracking-wider",
            "text-foreground/40",
            "py-4",
            "px-4",
            "first:rounded-tl-[22px]",
            "last:rounded-tr-[22px]",
          ],
          td: [
            "py-3",
            "px-4",
            "text-sm",
            "border-b",
            "border-dashboard-border/60",
            "group-last:border-b-0",
          ],
          tr: ["group", "transition-colors", "hover:bg-dashboard-tab"],
        }}
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
        <TableBody emptyContent="Aucune validation ne correspond" items={lignes}>
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
