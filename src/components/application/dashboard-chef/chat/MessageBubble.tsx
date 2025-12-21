"use client";

import React from "react";
import { Card, CardBody, User, Spinner } from "@heroui/react";
import { CommentaireAvecAuteur } from "@/types";

interface MessageBubbleProps {
  comment: CommentaireAvecAuteur;
  isChef: boolean;
}

export default function MessageBubble({ comment, isChef }: MessageBubbleProps) {
  return (
    <div className={`flex ${isChef ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-3 max-w-xs ${
          isChef ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <User
          avatarProps={{
            src: comment.auteur.image || undefined,
            name: comment.auteur.name.charAt(0).toUpperCase(),
            size: "sm",
          }}
          name=""
          description=""
          className="min-w-fit"
        />

        {/* Message Bubble */}
        <Card
          className={`${
            isChef ? "bg-primary text-white" : "bg-default-100 text-default-900"
          } ${comment.isPending ? "opacity-60" : ""}`}
        >
          <CardBody className="p-3 gap-1">
            <p className="text-xs font-semibold">{comment.auteur.name}</p>
            <p className="text-sm whitespace-pre-wrap">{comment.contenu}</p>
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-xs opacity-70">
                {new Date(comment.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {comment.isPending && (
                <div className="flex items-center gap-1">
                  <Spinner size="sm" color="current" />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
