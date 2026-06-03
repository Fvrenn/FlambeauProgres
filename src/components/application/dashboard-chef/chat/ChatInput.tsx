"use client";

import React, { useState, useTransition } from "react";
import { Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!message.trim()) return;

    const textToSend = message;

    setMessage("");

    startTransition(async () => {
      try {
        await onSend(textToSend);
      } catch (error) {
        console.error("Failed to send message", error);
        setMessage(textToSend);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        className="flex-1"
        disabled={disabled || isPending}
        maxRows={4}
        minRows={1}
        placeholder="Écris ton message..."
        value={message}
        onKeyDown={handleKeyDown}
        onValueChange={setMessage}
      />
      <Button
        isIconOnly
        className="mb-[2px]"
        color="primary"
        disabled={!message.trim() || disabled || isPending}
        isLoading={isPending}
        size="lg"
        onPress={handleSend}
      >
        <Icon icon="solar:send-linear" width={20} />
      </Button>
    </div>
  );
}
