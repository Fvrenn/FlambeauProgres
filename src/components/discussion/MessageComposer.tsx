"use client";

import React, { useRef, useState, useTransition } from "react";
import { Button, Chip, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";

import { validateFileClient } from "./useDiscussionThread";

interface MessageComposerProps {
  disabled?: boolean;
  onSend: (text: string, file: File | null) => Promise<void>;
}

export default function MessageComposer({
  disabled,
  onSend,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = disabled || isPending;

  const resetFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;

    if (picked) {
      const validationError = validateFileClient(picked);

      if (validationError) {
        setFileError(validationError);
        resetFileInput();

        return;
      }
    }

    setFileError(null);
    setFile(picked);
  };

  const clearFile = () => {
    setFile(null);
    resetFileInput();
  };

  const clearAll = () => {
    setText("");
    clearFile();
  };

  const handleSend = () => {
    if (!text.trim() && !file) {
      return;
    }

    startTransition(async () => {
      await onSend(text, file);
      clearAll();
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {fileError && <p className="text-xs text-danger">{fileError}</p>}

      {file && (
        <Chip
          startContent={<Icon icon="solar:paperclip-linear" width={14} />}
          variant="flat"
          onClose={clearFile}
        >
          {file.name}
        </Chip>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={inputRef}
          accept="image/*,application/pdf,.doc,.docx"
          className="hidden"
          type="file"
          onChange={handlePick}
        />

        <Button
          isIconOnly
          isDisabled={busy}
          variant="flat"
          onPress={() => inputRef.current?.click()}
        >
          <Icon icon="solar:paperclip-linear" width={20} />
        </Button>

        <Textarea
          className="flex-1"
          isDisabled={busy}
          maxRows={4}
          minRows={1}
          placeholder="Écris ton message..."
          value={text}
          onKeyDown={handleKeyDown}
          onValueChange={setText}
        />

        <Button
          isIconOnly
          color="primary"
          isDisabled={busy || (!text.trim() && !file)}
          isLoading={isPending}
          onPress={handleSend}
        >
          <Icon icon="solar:plain-linear" width={20} />
        </Button>
      </div>
    </div>
  );
}
