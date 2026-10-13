"use client";

import type { UserRole } from "@prisma/client";
import type { ThreadObjectif } from "./types";

import { Button } from "@heroui/react";

import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import ValidateRealisation from "./ValidateRealisation";
import { useDiscussionThread } from "./useDiscussionThread";

import { Icon } from "@/lib/icons";
import { ConfirmPopover } from "@/components/ui";
import { LIBELLE_TYPE_OBJECTIF, STATUTS_EN_ATTENTE } from "@/lib/justification";
import { estReferent } from "@/lib/roles";

export type DiscussionViewer = {
  id: string;
  name: string;
  image: string | null;
  role?: UserRole;
} | null;

type ResultatAction = { success: boolean; error?: string };

interface DiscussionThreadProps {
  justificationId: string;
  objectif: ThreadObjectif;
  viewer: DiscussionViewer;
  peutValider?: boolean;
  peutEcrire?: boolean;
  onRetirer?: () => Promise<ResultatAction>;
}

export default function DiscussionThread({
  justificationId,
  objectif,
  viewer,
  peutValider,
  peutEcrire = true,
  onRetirer,
}: DiscussionThreadProps) {
  const libelle = LIBELLE_TYPE_OBJECTIF[objectif.type];
  const viewerId = viewer?.id;
  const viewerRole = viewer?.role;
  const author = viewer
    ? { id: viewer.id, name: viewer.name, image: viewer.image }
    : null;

  const {
    messages,
    statut,
    etapeValidee,
    isLoading,
    error,
    readOnly,
    sendMessage,
    validate,
    annulerValidation,
  } = useDiscussionThread(justificationId, { id: viewerId, author });

  const evalue = peutValider ?? estReferent(viewerRole);
  const peutRetirer =
    Boolean(onRetirer) &&
    !etapeValidee &&
    statut !== null &&
    STATUTS_EN_ATTENTE.includes(statut);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-dashboard-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-default-500">
          {objectif.code}
        </p>
        <p className="line-clamp-3 text-sm text-default-700">
          {objectif.description}
        </p>
      </header>

      <div className="min-h-0 flex-1">
        <MessageList
          error={error}
          isLoading={isLoading}
          messages={messages}
          viewerId={viewerId}
        />
      </div>

      <footer className="flex shrink-0 flex-col gap-3 border-t border-dashboard-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {error && messages.length > 0 && (
          <p className="text-center text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {readOnly ? (
          <>
            <div className="flex items-center justify-center gap-2 text-sm text-success-600">
              <Icon icon="solar:check-circle-bold" width={18} />
              {libelle.charAt(0).toUpperCase()}
              {libelle.slice(1)} validée, fil clôturé
            </div>
            {evalue && !etapeValidee && (
              <ConfirmPopover
                confirmLabel="Annuler la validation"
                message={`La ${libelle} repassera dans la liste « à valider ».`}
                titre="Revenir sur la validation ?"
                onConfirm={annulerValidation}
              >
                <Button
                  size="sm"
                  startContent={<Icon icon="solar:undo-left-linear" />}
                  variant="light"
                >
                  Revenir sur la validation
                </Button>
              </ConfirmPopover>
            )}
          </>
        ) : (
          <>
            {evalue && (
              <>
                <ValidateRealisation
                  disabled={!viewerId}
                  libelle={libelle}
                  onValidate={validate}
                />
                {peutEcrire && (
                  <p className="text-center text-xs text-default-500">
                    Pas conforme ? Écrivez au chef : la {libelle} passera « en
                    attente du chef ».
                  </p>
                )}
              </>
            )}
            {peutEcrire ? (
              <MessageComposer
                disabled={!viewerId}
                onSend={(text, file) => sendMessage({ text, file })}
              />
            ) : (
              <p className="text-center text-xs text-default-500">
                Lecture seule : l&apos;évaluation revient à la commission
                Formation.
              </p>
            )}
            {peutRetirer && onRetirer && (
              <ConfirmPopover
                confirmLabel="Retirer"
                message={`Ta ${libelle} repassera en brouillon : tu pourras la corriger et la renvoyer.`}
                titre="Retirer ta soumission ?"
                onConfirm={onRetirer}
              >
                <Button
                  className="self-center"
                  color="danger"
                  size="sm"
                  startContent={<Icon icon="solar:undo-left-linear" />}
                  variant="light"
                >
                  Retirer ma soumission
                </Button>
              </ConfirmPopover>
            )}
          </>
        )}
      </footer>
    </div>
  );
}
