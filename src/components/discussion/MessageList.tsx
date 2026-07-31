"use client";

import type { UiMessage } from "./types";

import React, { Fragment, useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";

import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: UiMessage[];
  viewerId: string | undefined;
  isLoading: boolean;
  error: string | null;
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function MessageList({
  messages,
  viewerId,
  isLoading,
  error,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-default-500">
        <p className="text-sm">Aucun message pour le moment.</p>
      </div>
    );
  }

  let lastDay = "";

  return (
    <div className="flex flex-col gap-4 p-3">
      {messages.map((message) => {
        const day = dayLabel(message.createdAt);
        const showDay = day !== lastDay;

        lastDay = day;

        return (
          <Fragment key={message.id}>
            {showDay && (
              <div className="flex justify-center">
                <span className="rounded-full bg-dashboard-card px-3 py-0.5 text-xs text-foreground/50">
                  {day}
                </span>
              </div>
            )}
            <MessageBubble
              isOwn={message.auteurId === viewerId}
              message={message}
            />
          </Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
