"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardBody } from "@heroui/react";

import MessageBubble from "./MessageBubble";

import { CommentaireAvecAuteur } from "@/types";

interface ChatListProps {
  comments: CommentaireAvecAuteur[];
  currentUserId: string | undefined;
  error?: string | null;
  isLoading?: boolean;
}

export default function ChatList({
  comments,
  currentUserId,
  error,
  isLoading,
}: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="bg-danger-50 border border-danger-200">
          <CardBody className="text-danger">
            <p className="text-sm">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Chargement des messages...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Aucun message pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      {comments.map((comment) => (
        <MessageBubble
          key={comment.id}
          comment={comment}
          isChef={comment.auteur.id === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
