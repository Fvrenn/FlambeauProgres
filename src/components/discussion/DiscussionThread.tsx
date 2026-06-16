"use client";

import type { UserRole } from "@prisma/client";
import type { ThreadObjectif } from "./types";

import React from "react";
import { Icon } from "@iconify/react";

import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import ValidateRealisation from "./ValidateRealisation";
import { useDiscussionThread } from "./useDiscussionThread";

import { useSession } from "@/lib/auth-client";

interface DiscussionThreadProps {
  justificationId: string;
  objectif: ThreadObjectif;
}

export default function DiscussionThread({
  justificationId,
  objectif,
}: DiscussionThreadProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const viewerId = user?.id;
  const viewerRole = (user && "role" in user ? user.role : undefined) as
    | UserRole
    | undefined;
  const author = user
    ? { id: user.id, name: user.name, image: user.image ?? null }
    : null;

  const { messages, isLoading, error, readOnly, sendMessage, validate } =
    useDiscussionThread(justificationId, { id: viewerId, author });

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-divider px-4 py-3">
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

      <footer className="flex flex-col gap-3 border-t border-divider p-3">
        {readOnly ? (
          <div className="flex items-center justify-center gap-2 text-sm text-success-600">
            <Icon icon="solar:check-circle-bold" width={18} />
            Réalisation validée — fil clôturé
          </div>
        ) : (
          <>
            {viewerRole === "REFERENT" && (
              <ValidateRealisation disabled={!viewerId} onValidate={validate} />
            )}
            <MessageComposer
              disabled={!viewerId}
              onSend={(text, file) => sendMessage({ text, file })}
            />
          </>
        )}
      </footer>
    </div>
  );
}
