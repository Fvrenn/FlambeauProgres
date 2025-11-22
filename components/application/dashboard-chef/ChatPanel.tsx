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
import { useSession } from "@/src/lib/auth-client";
import { CommentaireAvecAuteur } from "@/src/types/chat";
import { submitComment, getComments } from "@/app/(app)/(dashboard)/_actions/commentaire-actions";
import ChatList from "./chat/ChatList";
import ChatInput from "./chat/ChatInput";
import { User as UserType } from "@prisma/client";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  justificationId?: string;
  // initialCommentaires is removed as we load them lazily now
}

export default function ChatPanel({
  isOpen,
  onClose,
  justificationId,
}: ChatPanelProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Local state for real comments
  const [comments, setComments] = useState<CommentaireAvecAuteur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimistic state
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: CommentaireAvecAuteur[], newComment: CommentaireAvecAuteur) => [
      ...state,
      newComment,
    ]
  );

  // Lazy load comments when drawer opens
  useEffect(() => {
    if (isOpen && justificationId) {
      const loadComments = async () => {
        setIsLoading(true);
        setError(null);
        const result = await getComments(justificationId);
        if (result.success && result.data) {
          setComments(result.data);
        } else {
          setError(result.error || "Erreur lors du chargement des messages");
        }
        setIsLoading(false);
      };

      loadComments();
    }
  }, [isOpen, justificationId]);

  const handleSendMessage = async (text: string) => {
    if (!justificationId || !currentUserId || !session?.user) return;

    // Create optimistic comment
    const optimisticComment: CommentaireAvecAuteur = {
      id: `temp-${Date.now()}`,
      justificationId,
      auteurId: currentUserId,
      contenu: text,
      type: "CHEF_REPONSE",
      createdAt: new Date(),
      // updatedAt removed as it's not in the schema
      auteur: session.user as UserType,
      isPending: true,
    };

    addOptimisticComment(optimisticComment);

    // Call server action
    const result = await submitComment(justificationId, text);

    if (result.success && result.data) {
      // Update local state with the real comment from server
      // We append it to the existing comments. 
      // Note: In a real-time app, we'd want to merge carefully or re-fetch, 
      // but appending is fine for this simple case.
      setComments((prev) => [...prev, result.data as CommentaireAvecAuteur]);
    } else {
      setError(result.error || "Erreur lors de l'envoi");
      // Ideally we would roll back the optimistic update here, 
      // but useOptimistic handles the temporary state automatically 
      // (it only exists for the duration of the transition/action).
      // However, since we are updating `comments` state on success, 
      // if we fail, `comments` won't update, so the optimistic one will just disappear.
      // We might want to show an error toast.
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="right"
      backdrop="blur"
    >
      <DrawerContent className="flex flex-col h-full">
        {/* HEADER */}
        <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">Discussion</h4>
            </div>
            <Icon
              icon="solar:close-circle-linear"
              width={24}
              className="cursor-pointer text-default-400 hover:text-default-600"
              onClick={onClose}
            />
          </div>
        </DrawerHeader>

        {/* BODY - Messages */}
        <DrawerBody className="flex-1 overflow-y-auto py-0 px-0">
          <ChatList
            comments={optimisticComments}
            currentUserId={currentUserId}
            error={error}
            isLoading={isLoading}
          />
        </DrawerBody>

        {/* FOOTER - Input */}
        <DrawerFooter className="flex flex-col gap-3 border-t border-divider">
          <ChatInput onSend={handleSendMessage} disabled={!justificationId || isLoading} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
