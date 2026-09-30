"use client";

import type { StatutJustification } from "@prisma/client";
import type { ThreadMessage } from "@/services/discussion.service";
import type { ThreadAuthor, UiMessage } from "./types";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getThread,
  postMessage,
  validateRealisation,
} from "@/actions/discussion/discussion.actions";
import { REGLES_JUSTIFICATION, validerFichier } from "@/lib/fichiers";
import { estJustificationValidee } from "@/lib/justification";

const POLL_INTERVAL_MS = 7000;
const MESSAGE_NON_ENVOYE =
  "Message non envoyé : vérifie ta connexion puis réessaie";

function toUiMessage(message: ThreadMessage): UiMessage {
  return {
    id: message.id,
    auteurId: message.auteurId,
    contenu: message.contenu,
    type: message.type,
    createdAt: new Date(message.createdAt),
    auteur: {
      id: message.auteur.id,
      name: message.auteur.name,
      image: message.auteur.image,
    },
    fichier: message.fichier
      ? {
          id: message.fichier.id,
          nomOriginal: message.fichier.nomOriginal,
          mimeType: message.fichier.mimeType,
        }
      : null,
  };
}

type Viewer = { id: string | undefined; author: ThreadAuthor | null };

export function useDiscussionThread(justificationId: string, viewer: Viewer) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [statut, setStatut] = useState<StatutJustification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const viewerRef = useRef(viewer);

  viewerRef.current = viewer;

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) {
        setIsLoading(true);
      }

      const result = await getThread(justificationId);

      if (result.success) {
        const server = result.data.messages.map(toUiMessage);

        setMessages((prev) => [...server, ...prev.filter((m) => m.pending)]);
        setStatut(result.data.statut);
        setError(null);
      } else if (!opts?.silent) {
        setError(result.error);
      }

      if (!opts?.silent) {
        setIsLoading(false);
      }
    },
    [justificationId],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        refresh({ silent: true });
      }
    };

    const intervalId = setInterval(tick, POLL_INTERVAL_MS);

    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [refresh]);

  const sendMessage = useCallback(
    async ({
      text,
      file,
    }: {
      text: string;
      file: File | null;
    }): Promise<boolean> => {
      const trimmed = text.trim();
      const { id: viewerId, author } = viewerRef.current;

      if ((!trimmed && !file) || !viewerId || !author) {
        return false;
      }

      if (file) {
        const fileError = validerFichier(file, REGLES_JUSTIFICATION);

        if (fileError) {
          setError(fileError);

          return false;
        }
      }

      const tempId = `temp-${Date.now()}`;
      const optimistic: UiMessage = {
        id: tempId,
        auteurId: viewerId,
        contenu: trimmed || null,
        type: "USER",
        createdAt: new Date(),
        auteur: author,
        fichier: file
          ? { id: tempId, nomOriginal: file.name, mimeType: file.type }
          : null,
        pending: true,
      };

      setMessages((prev) => [...prev, optimistic]);
      setError(null);

      const result = await postMessage(
        justificationId,
        trimmed,
        file ?? undefined,
      ).catch(() => ({ success: false as const, error: MESSAGE_NON_ENVOYE }));

      if (!result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(result.error);

        return false;
      }

      const real = toUiMessage(result.data);

      setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
      await refresh({ silent: true });

      return true;
    },
    [justificationId, refresh],
  );

  const validate = useCallback(async () => {
    if (!viewerRef.current.id) {
      return;
    }

    const result = await validateRealisation(justificationId).catch(() => ({
      success: false as const,
      error: "Validation non enregistrée : vérifie ta connexion puis réessaie",
    }));

    if (result.success) {
      await refresh({ silent: true });
    } else {
      setError(result.error);
    }
  }, [justificationId, refresh]);

  return {
    messages,
    statut,
    isLoading,
    error,
    readOnly: statut ? estJustificationValidee(statut) : false,
    sendMessage,
    validate,
  };
}
