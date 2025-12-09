"use client";
import React from "react";
import { Card, CardBody, Divider, Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import MessageCard from "@/components/application/referent/_components/MessageCard";
import { Commentaire, User as UserType } from "@prisma/client";

interface DiscussionContentProps {
  comments: any[]; // Using any to match existing optimistic structure temporary, ideally typed
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
    <div className="flex flex-col h-[500px] md:h-[450px]">
      {/* Messages Scroll Area */}
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
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-default-50 rounded-2xl border-dashed border-2 border-default-200">
             <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center mb-3 text-default-400">
                <Icon icon="solar:chat-line-linear" width={24} />
             </div>
             <p className="text-sm font-medium text-default-600">Aucune discussion</p>
             <p className="text-xs text-default-400 max-w-[200px] mt-1">Commencez l'échange en demandant des précisions ci-dessous.</p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-divider bg-white z-10">
         <label className="text-xs font-semibold text-default-500 uppercase tracking-wider mb-2 block">
           Votre message
         </label>
         <div className="relative">
            <Textarea
              placeholder="Écrivez votre message ici..."
              value={motif}
              onValueChange={setMotif}
              disabled={isPending || isSubmitting}
              minRows={2}
              maxRows={4}
              variant="bordered"
              classNames={{
                inputWrapper: "bg-default-50 hover:bg-default-100 focus-within:bg-white pr-12 transition-colors duration-200 border-default-200 shadow-none",
                input: "text-sm",
              }}
            />
            {/* The send button could be conceptually part of the main modal footer, 
                but often chat interfaces have it near the input. 
                However, for this specific flow 'Demander des précisions' acts as the submit in the main footer.
                So we just leave the input here. */}
         </div>
      </div>
    </div>
  );
}
