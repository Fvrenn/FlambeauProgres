"use client";

import React from "react";
import { Card, CardBody, User, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Commentaire, User as UserType, TypeCommentaire } from "@prisma/client";

type CommentaireAvecAuteur = Commentaire & {
  auteur: UserType;
};

interface MessageCardProps {
  commentaire: CommentaireAvecAuteur;
  currentUserId?: string;
  isOptimistic?: boolean;
}

const TYPE_CONFIG: Record<
  TypeCommentaire,
  { icon: string; label: string; color: "primary" | "secondary" | "warning" }
> = {
  CHEF_REPONSE: {
    icon: "solar:chat-round-dots-linear",
    label: "Chef",
    color: "primary",
  },
  REFERENT_QUESTION: {
    icon: "solar:question-circle-linear",
    label: "Question",
    color: "warning",
  },
  REFERENT_FEEDBACK: {
    icon: "solar:chat-round-linear",
    label: "Feedback",
    color: "secondary",
  },
  SYSTEM: {
    icon: "solar:info-circle-linear",
    label: "Système",
    color: "secondary",
  },
};

export default function MessageCard({
  commentaire,
  currentUserId,
  isOptimistic = false,
}: MessageCardProps) {
  const isFromCurrentUser = commentaire.auteur.id === currentUserId;
  const typeConfig = TYPE_CONFIG[commentaire.type];

  return (
    <div
      className={`flex gap-3 w-full ${
        isFromCurrentUser ? "flex-row-reverse" : "flex-row justify-start"
      }`}
    >
      <User
        avatarProps={{
          src: commentaire.auteur.image || undefined,
          name: commentaire.auteur.name.charAt(0).toUpperCase(),
          size: "sm",
        }}
        className="flex-shrink-0"
        description=""
        name=""
      />

      <div className={`flex-shrink max-w-md`}>
        <Card
          className={`${
            isFromCurrentUser ? "bg-primary-100" : "bg-default-100"
          } ${isOptimistic ? "opacity-75" : ""}`}
        >
          <CardBody className="gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{commentaire.auteur.name}</p>
              <Chip
                color={typeConfig.color}
                size="sm"
                startContent={<Icon icon={typeConfig.icon} width={12} />}
                variant="flat"
              >
                {typeConfig.label}
              </Chip>
            </div>

            <p className="text-sm text-default-700 break-words">
              {commentaire.contenu}
            </p>

            <p className="text-xs text-default-500 mt-1">
              {new Date(commentaire.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            {isOptimistic && (
              <div className="flex items-center gap-1 text-xs text-default-500 mt-2">
                <Icon icon="solar:clock-linear" width={12} />
                En attente...
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
