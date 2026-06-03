"use client";

import React, { useEffect, useState, useOptimistic } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { User as UserType } from "@prisma/client";

import ChatList from "./chat/ChatList";
import ChatInput from "./chat/ChatInput";

import { useSession } from "@/lib/auth-client";
import { CommentaireAvecAuteur } from "@/types";
import { submitComment, getComments } from "@/actions/comment/comment.actions";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  justificationId?: string;
}

export default function ChatPanel({
  isOpen,
  onClose,
  justificationId,
}: ChatPanelProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [comments, setComments] = useState<CommentaireAvecAuteur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: CommentaireAvecAuteur[], newComment: CommentaireAvecAuteur) => [
      ...state,
      newComment,
    ],
  );

  useEffect(() => {
    if (!isOpen || !justificationId) return;

    let cancelled = false;

    const loadComments = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getComments(justificationId);

      if (cancelled) return;

      if (result.success && result.data) {
        setComments(result.data);
      } else {
        setError(result.error || "Erreur lors du chargement des messages");
      }

      setIsLoading(false);
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [isOpen, justificationId]);

  const handleSendMessage = async (text: string) => {
    if (!justificationId || !currentUserId || !session?.user) return;

    const optimisticComment: CommentaireAvecAuteur = {
      id: `temp-${Date.now()}`,
      justificationId,
      auteurId: currentUserId,
      contenu: text,
      type: "CHEF_REPONSE",
      createdAt: new Date(),
      auteur: session.user as UserType,
      isPending: true,
    };

    addOptimisticComment(optimisticComment);

    const result = await submitComment(justificationId, text);

    if (result.success && result.data) {
      setComments((prev) => [...prev, result.data as CommentaireAvecAuteur]);
    } else {
      setError(result.error || "Erreur lors de l'envoi");
    }
  };

  return (
    <Drawer
      backdrop="blur"
      isOpen={isOpen}
      placement="right"
      size="lg"
      onClose={onClose}
    >
      <DrawerContent className="flex flex-col h-full">
        <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">Discussion</h4>
            </div>
            <Icon
              className="cursor-pointer text-default-400 hover:text-default-600"
              icon="solar:close-circle-linear"
              width={24}
              onClick={onClose}
            />
          </div>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-y-auto py-0 px-0">
          <ChatList
            comments={optimisticComments}
            currentUserId={currentUserId}
            error={error}
            isLoading={isLoading}
          />
        </DrawerBody>

        <DrawerFooter className="flex flex-col gap-3 border-t border-divider">
          <ChatInput
            disabled={!justificationId || isLoading}
            onSend={handleSendMessage}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
