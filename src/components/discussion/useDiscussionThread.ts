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

const ALLOWED_MIME_TYPES = new Set<string>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const POLL_INTERVAL_MS = 7000;

export function validateFileClient(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return "Type de fichier non autorisé (images, PDF ou Word uniquement)";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Fichier trop volumineux (8 Mo maximum)";
  }

  return null;
}

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
    async ({ text, file }: { text: string; file: File | null }) => {
      const trimmed = text.trim();
      const { id: viewerId, author } = viewerRef.current;

      if ((!trimmed && !file) || !viewerId || !author) {
        return;
      }

      if (file) {
        const fileError = validateFileClient(file);

        if (fileError) {
          setError(fileError);

          return;
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
      );

      if (result.success) {
        const real = toUiMessage(result.data);

        setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
        await refresh({ silent: true });
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(result.error);
      }
    },
    [justificationId, refresh],
  );

  const validate = useCallback(
    async (text: string) => {
      if (!viewerRef.current.id) {
        return;
      }

      const result = await validateRealisation(
        justificationId,
        text.trim() || undefined,
      );

      if (result.success) {
        await refresh({ silent: true });
      } else {
        setError(result.error);
      }
    },
    [justificationId, refresh],
  );

  return {
    messages,
    statut,
    isLoading,
    error,
    readOnly: statut === "VALIDEE",
    sendMessage,
    validate,
  };
}
