"use client";

import type { UiMessage } from "./types";

import React from "react";
import { Card, CardBody, Spinner, User } from "@heroui/react";

import FileAttachment from "./FileAttachment";

interface MessageBubbleProps {
  message: UiMessage;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs text-success-700">
          {message.contenu}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] gap-2 ${
          isOwn ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <User
          avatarProps={{
            src: message.auteur.image || undefined,
            name: message.auteur.name.charAt(0).toUpperCase(),
            size: "sm",
          }}
          className="min-w-fit"
          description=""
          name=""
        />

        <Card
          className={`${
            isOwn ? "bg-primary text-white" : "bg-default-100 text-default-900"
          } ${message.pending ? "opacity-60" : ""}`}
        >
          <CardBody className="gap-2 p-3">
            <p className="text-xs font-semibold">{message.auteur.name}</p>

            {message.fichier && (
              <FileAttachment
                fichier={message.fichier}
                pending={message.pending}
              />
            )}

            {message.contenu && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.contenu}
              </p>
            )}

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs opacity-70">
                {message.createdAt.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {message.pending && <Spinner color="current" size="sm" />}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
