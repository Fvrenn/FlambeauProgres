"use client";

import type { LigneAttente, LigneSynthese, TypeAttente } from "@/lib/suivi";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Chip,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { SEUIL_ATTENTE_LONGUE_JOURS, libelleAnciennete } from "./format";

import { Icon } from "@/lib/icons";
import { comparerGroupes, nomGroupe } from "@/lib/suivi";
import { BoutonOuvrirLigne } from "@/components/admin/BoutonOuvrirLigne";
import { CelluleUtilisateur } from "@/components/admin/CelluleUtilisateur";
import {
  Button,
  CLASSES_TABLEAU,
  FiltreSegmente,
  Input,
} from "@/components/ui";

export type LigneAttenteDatee = LigneAttente & { jours: number | null };

const LIGNES_PAR_PAGE = 15;
const TOUS = "tous";

const STATUTS: Record<
  TypeAttente,
  { label: string; couleur: "warning" | "default" | "success" }
> = {
  "a-evaluer": { label: "À évaluer", couleur: "warning" },
  "attente-chef": { label: "En attente du chef", couleur: "default" },
  "a-valider": { label: "Dossier à valider", couleur: "success" },
};

const FILTRES_STATUT = [
  { key: TOUS, label: "Tout" },
  { key: "a-evaluer", label: "À évaluer" },
  { key: "attente-chef", label: "En attente du chef" },
  { key: "a-valider", label: "Dossiers à valider" },
] as const;

const COLONNES_SYNTHESE = [
  { key: "etape", label: "Étape" },
  { key: "aEvaluer", label: "À évaluer" },
  { key: "enAttenteDuChef", label: "En attente du chef" },
  { key: "aValider", label: "Dossiers à valider" },
];

const COLONNES_DETAIL = [
  { key: "chef", label: "Chef" },
  { key: "groupe", label: "Groupe" },
  { key: "etape", label: "Étape" },
  { key: "objet", label: "Objet" },
  { key: "statut", label: "Statut" },
  { key: "depuis", label: "Depuis" },
  { key: "actions", label: "" },
];

type EnAttenteProps = {
  lignes: LigneAttenteDatee[];
  synthese: LigneSynthese[];
};

export function EnAttente({ lignes, synthese }: EnAttenteProps) {
  const router = useRouter();
  const [statut, setStatut] = React.useState<TypeAttente | typeof TOUS>(TOUS);
  const [etapeId, setEtapeId] = React.useState<string>(TOUS);
  const [groupe, setGroupe] = React.useState<string>(TOUS);
  const [recherche, setRecherche] = React.useState("");
  const [page, setPage] = React.useState(1);

  const groupes = React.useMemo(
    () =>
      [...new Set(lignes.map(({ chef }) => nomGroupe(chef)))].sort(
        comparerGroupes,
      ),
    [lignes],
  );

  const filtrees = React.useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    return lignes
      .filter(
        (ligne) =>
          (statut === TOUS || ligne.type === statut) &&
          (etapeId === TOUS || ligne.etape.id === etapeId) &&
          (groupe === TOUS || nomGroupe(ligne.chef) === groupe) &&
          (!terme ||
            [ligne.chef.name, ligne.etape.name, ligne.objet].some((texte) =>
              texte.toLowerCase().includes(terme),
            )),
      )
      .sort((a, b) => (b.jours ?? -1) - (a.jours ?? -1));
  }, [lignes, statut, etapeId, groupe, recherche]);

  React.useEffect(() => {
    setPage(1);
  }, [statut, etapeId, groupe, recherche]);

  const pages = Math.max(1, Math.ceil(filtrees.length / LIGNES_PAR_PAGE));
  const pageCourante = Math.min(page, pages);
  const lignesPage = filtrees.slice(
    (pageCourante - 1) * LIGNES_PAR_PAGE,
    pageCourante * LIGNES_PAR_PAGE,
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Par étape</h2>
          <p className="text-tiny text-default-500">
            Cliquez sur une étape pour n&apos;afficher qu&apos;elle dans le
            détail.
          </p>
        </div>
        <Table
          aria-label="Ce qui reste à traiter, par étape"
          classNames={CLASSES_TABLEAU}
          selectedKeys={etapeId === TOUS ? [] : [etapeId]}
          selectionMode="single"
          onSelectionChange={(cles) => {
            const [cle] = cles === "all" ? [] : [...cles];

            setEtapeId(cle ? String(cle) : TOUS);
          }}
        >
          <TableHeader columns={COLONNES_SYNTHESE}>
            {(colonne) => (
              <TableColumn key={colonne.key}>{colonne.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="Rien en attente" items={synthese}>
            {(ligne) => (
              <TableRow key={ligne.id} className="cursor-pointer">
                <TableCell className="font-medium">{ligne.name}</TableCell>
                <TableCell>
                  <Compteur couleur="warning" valeur={ligne.aEvaluer} />
                </TableCell>
                <TableCell>
                  <Compteur couleur="default" valeur={ligne.enAttenteDuChef} />
                </TableCell>
                <TableCell>
                  <Compteur couleur="success" valeur={ligne.aValider} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Détail</h2>
          <p className="text-tiny text-default-500">
            Les éléments les plus anciens en premier. Au-delà de{" "}
            {SEUIL_ATTENTE_LONGUE_JOURS} jours, l&apos;ancienneté est signalée
            en orange.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <FiltreSegmente
            options={FILTRES_STATUT}
            valeur={statut}
            onChange={setStatut}
          />
          <Select
            aria-label="Groupe"
            className="lg:max-w-56"
            selectedKeys={[groupe]}
            size="sm"
            onSelectionChange={(cles) =>
              setGroupe(String([...cles][0] ?? TOUS))
            }
          >
            {[TOUS, ...groupes].map((option) => (
              <SelectItem key={option}>
                {option === TOUS ? "Tous les groupes" : option}
              </SelectItem>
            ))}
          </Select>
          <Input
            isClearable
            className="lg:max-w-72"
            placeholder="Chef, étape, objectif…"
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={recherche}
            onClear={() => setRecherche("")}
            onValueChange={setRecherche}
          />
          {etapeId !== TOUS && (
            <Button
              size="sm"
              startIcon="solar:close-circle-linear"
              variant="flat"
              onClick={() => setEtapeId(TOUS)}
            >
              Toutes les étapes
            </Button>
          )}
        </div>

        <Table
          aria-label="Détail de ce qui reste à traiter"
          bottomContent={
            pages > 1 && (
              <div className="flex justify-center py-2">
                <Pagination
                  isCompact
                  showControls
                  page={pageCourante}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            )
          }
          classNames={CLASSES_TABLEAU}
        >
          <TableHeader columns={COLONNES_DETAIL}>
            {(colonne) => (
              <TableColumn key={colonne.key}>{colonne.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent="Rien ne correspond" items={lignesPage}>
            {(ligne) => (
              <TableRow key={ligne.id}>
                <TableCell>
                  <CelluleUtilisateur utilisateur={ligne.chef} />
                </TableCell>
                <TableCell>{nomGroupe(ligne.chef)}</TableCell>
                <TableCell>{ligne.etape.name}</TableCell>
                <TableCell>
                  <span className="line-clamp-2 max-w-96">{ligne.objet}</span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={STATUTS[ligne.type].couleur}
                    size="sm"
                    variant="flat"
                  >
                    {STATUTS[ligne.type].label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      (ligne.jours ?? 0) > SEUIL_ATTENTE_LONGUE_JOURS
                        ? "font-semibold text-warning-600 tabular-nums"
                        : "text-default-500 tabular-nums"
                    }
                  >
                    {libelleAnciennete(ligne.jours)}
                  </span>
                </TableCell>
                <TableCell>
                  {ligne.lien && (
                    <BoutonOuvrirLigne
                      label={`Ouvrir : ${ligne.objet}`}
                      onOuvrir={() => router.push(ligne.lien as string)}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function Compteur({
  valeur,
  couleur,
}: {
  valeur: number;
  couleur: "warning" | "default" | "success";
}) {
  return valeur > 0 ? (
    <Chip color={couleur} size="sm" variant="flat">
      {valeur}
    </Chip>
  ) : (
    <span className="text-default-300">0</span>
  );
}
