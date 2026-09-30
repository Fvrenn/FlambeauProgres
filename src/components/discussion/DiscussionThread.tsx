"use client";

import type { UserRole } from "@prisma/client";
import type { ThreadObjectif } from "./types";

import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import ValidateRealisation from "./ValidateRealisation";
import { useDiscussionThread } from "./useDiscussionThread";

import { Icon } from "@/lib/icons";
import { LIBELLE_TYPE_OBJECTIF } from "@/lib/justification";
import { estReferent } from "@/lib/roles";

export type DiscussionViewer = {
  id: string;
  name: string;
  image: string | null;
  role?: UserRole;
} | null;

interface DiscussionThreadProps {
  justificationId: string;
  objectif: ThreadObjectif;
  viewer: DiscussionViewer;
  peutValider?: boolean;
  peutEcrire?: boolean;
}

export default function DiscussionThread({
  justificationId,
  objectif,
  viewer,
  peutValider,
  peutEcrire = true,
}: DiscussionThreadProps) {
  const libelle = LIBELLE_TYPE_OBJECTIF[objectif.type];
  const viewerId = viewer?.id;
  const viewerRole = viewer?.role;
  const author = viewer
    ? { id: viewer.id, name: viewer.name, image: viewer.image }
    : null;

  const { messages, isLoading, error, readOnly, sendMessage, validate } =
    useDiscussionThread(justificationId, { id: viewerId, author });

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-dashboard-border px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-default-500">
          {objectif.code}
        </p>
        <p className="text-sm text-default-700">{objectif.description}</p>
      </header>

      <div className="flex-1 overflow-y-auto">
        <MessageList
          error={error}
          isLoading={isLoading}
          messages={messages}
          viewerId={viewerId}
        />
      </div>

      <footer className="flex flex-col gap-3 border-t border-dashboard-border p-3">
        {error && messages.length > 0 && (
          <p className="text-center text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        {readOnly ? (
          <div className="flex items-center justify-center gap-2 text-sm text-success-600">
            <Icon icon="solar:check-circle-bold" width={18} />
            {libelle.charAt(0).toUpperCase()}
            {libelle.slice(1)} validée, fil clôturé
          </div>
        ) : (
          <>
            {(peutValider ?? estReferent(viewerRole)) && (
              <ValidateRealisation
                disabled={!viewerId}
                libelle={libelle}
                onValidate={validate}
              />
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
          </>
        )}
      </footer>
    </div>
  );
}
