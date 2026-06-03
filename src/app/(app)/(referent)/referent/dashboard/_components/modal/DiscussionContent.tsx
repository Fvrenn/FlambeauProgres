"use client";
import React from "react";
import { Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";

import MessageCard from "@/components/application/referent/_components/MessageCard";
import { CommentaireAvecAuteur } from "@/types";

interface DiscussionContentProps {
  comments: CommentaireAvecAuteur[];
  currentUserId: string | undefined;
  motif: string;
  setMotif: (val: string) => void;
  isPending: boolean;
  isSubmitting: boolean;
}

export default function DiscussionContent({
  comments,
  currentUserId,
  motif,
  setMotif,
  isPending,
  isSubmitting,
}: DiscussionContentProps) {
  return (
    <div className="flex flex-col h-[500px] overflow-y-auto">
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((commentaire) => (
            <MessageCard
              key={commentaire.id}
              commentaire={commentaire}
              currentUserId={currentUserId}
              isOptimistic={commentaire.isPending}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-default rounded-2xl ">
            <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-3 text-default-400">
              <Icon icon="solar:chat-line-linear" width={24} />
            </div>
            <p className="text-sm font-medium text-default-600">
              Aucune discussion
            </p>
            <p className="text-xs text-default-400 max-w-[200px] mt-1">
              Commencez l'échange en demandant des précisions ci-dessous.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2">
        <Textarea
          isDisabled={isPending || isSubmitting}
          label="Votre message"
          maxRows={4}
          minRows={2}
          placeholder="Écrivez votre message ici..."
          value={motif}
          onValueChange={setMotif}
        />
      </div>
    </div>
  );
}
