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
    setMessage(""); // Clear immediately for better UX

    startTransition(async () => {
      try {
        await onSend(textToSend);
      } catch (error) {
        // In a real app, you might want to restore the message or show a toast
        console.error("Failed to send message", error);
        setMessage(textToSend); // Restore on failure
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
        placeholder="Écris ton message..."
        value={message}
        onValueChange={setMessage}
        minRows={1}
        maxRows={4}
        disabled={disabled || isPending}
        className="flex-1"
        onKeyDown={handleKeyDown}
      />
      <Button
        isIconOnly
        color="primary"
        onPress={handleSend}
        isLoading={isPending}
        disabled={!message.trim() || disabled || isPending}
        size="lg"
        className="mb-[2px]" // Align with textarea bottom
      >
        <Icon icon="solar:send-linear" width={20} />
      </Button>
    </div>
  );
}
