"use client";

import type { OrigineValidation, StatutChefEtape } from "@prisma/client";
import type { UserResume } from "@/types";
import type { JustificationAdmin } from "@/services/progression-admin.service";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";

import {
  reinitialiserEtapeAdmin,
  supprimerJustificationAdmin,
} from "../../../_actions/progression.actions";

import { Icon } from "@/lib/icons";
import { CelluleUtilisateur } from "@/components/admin/CelluleUtilisateur";
import {
  Badge,
  Card,
  CardBody,
  ConfirmPopover,
  StatusChip,
} from "@/components/ui";
import { LIBELLE_TYPE_OBJECTIF } from "@/lib/justification";

type EtapeProgression = {
  id: string;
  number: string;
  name: string;
  statut: {
    statut: StatutChefEtape;
    origine: OrigineValidation;
    valideeAt: Date | null;
  } | null;
  justifications: JustificationAdmin[];
};

type ProgressionClientPageProps = {
  utilisateur: UserResume;
  etapes: EtapeProgression[];
};

const LIBELLE_STATUT_ETAPE: Record<StatutChefEtape, string> = {
  NON_COMMENCE: "Non commencée",
  EN_COURS: "En cours",
  EN_REVISION: "En révision",
  VALIDE: "Étape validée",
};

function formaterDate(date: Date | null): string | null {
  return date
    ? date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
}

export default function ProgressionClientPage({
  utilisateur,
  etapes,
}: ProgressionClientPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/users">Utilisateurs</BreadcrumbItem>
        <BreadcrumbItem>Progression</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold">Progression</h1>
        <CelluleUtilisateur utilisateur={utilisateur} />
        <p className="text-small text-default-500">
          Suppression définitive, y compris des éléments déjà validés (messages
          et fichiers compris). Une étape déclarée sur le profil de la
          plateforme y sera réimportée tant qu&apos;elle n&apos;est pas retirée
          là-bas.
        </p>
      </div>

      {etapes.length === 0 && (
        <p className="text-small text-default-500">
          Aucune soumission ni validation pour cet utilisateur.
        </p>
      )}

      {etapes.map((etape) => (
        <Card key={etape.id} className="w-full">
          <CardBody>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-semibold">
                  {etape.number} · {etape.name}
                </p>
                {etape.statut && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      color={
                        etape.statut.statut === "VALIDE" ? "success" : "default"
                      }
                    >
                      {LIBELLE_STATUT_ETAPE[etape.statut.statut]}
                    </Badge>
                    {etape.statut.origine === "PLATEFORME" && (
                      <Badge>Plateforme</Badge>
                    )}
                    {etape.statut.valideeAt && (
                      <span className="text-tiny text-default-500">
                        {formaterDate(etape.statut.valideeAt)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <ConfirmPopover
                confirmLabel="Réinitialiser"
                message="Toutes les soumissions de cette étape et sa validation seront supprimées."
                titre={`Réinitialiser l'étape ${etape.number} ?`}
                onConfirm={() =>
                  reinitialiserEtapeAdmin(utilisateur.id, etape.id)
                }
              >
                <button
                  className="text-tiny text-danger underline-offset-2 hover:underline"
                  type="button"
                >
                  Réinitialiser l&apos;étape
                </button>
              </ConfirmPopover>
            </div>

            {etape.justifications.length > 0 && (
              <ul className="flex flex-col divide-y divide-dashboard-border">
                {etape.justifications.map((justification) => (
                  <LigneJustification
                    key={justification.id}
                    chefId={utilisateur.id}
                    justification={justification}
                  />
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function LigneJustification({
  chefId,
  justification,
}: {
  chefId: string;
  justification: JustificationAdmin;
}) {
  const { objectif, _count } = justification;
  const date = formaterDate(
    justification.valideeAt ??
      justification.soumiseAt ??
      justification.updatedAt,
  );

  return (
    <li className="flex items-start justify-between gap-3 py-2">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-small">
          <span className="font-semibold">{objectif.code}</span>{" "}
          <span className="text-default-500">
            ({LIBELLE_TYPE_OBJECTIF[objectif.type]})
          </span>
        </p>
        <p className="line-clamp-2 text-tiny text-default-600">
          {objectif.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip statut={justification.statut} />
          <span className="text-tiny text-default-500">
            {date}
            {_count.messages > 0 && ` · ${_count.messages} message(s)`}
            {_count.fichiers > 0 && ` · ${_count.fichiers} fichier(s)`}
          </span>
        </div>
      </div>

      <ConfirmPopover
        confirmLabel="Supprimer"
        message="La soumission, ses messages et ses fichiers seront supprimés définitivement."
        titre={`Supprimer ${objectif.code} ?`}
        onConfirm={() => supprimerJustificationAdmin(chefId, justification.id)}
      >
        <button
          aria-label={`Supprimer ${objectif.code}`}
          className="shrink-0 text-lg text-danger active:opacity-50"
          type="button"
        >
          <Icon icon="solar:trash-bin-trash-linear" />
        </button>
      </ConfirmPopover>
    </li>
  );
}
