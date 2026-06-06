"use client";

import type { ThreadFile } from "./types";

import React from "react";
import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

interface FileAttachmentProps {
  fichier: ThreadFile;
  pending?: boolean;
}

export default function FileAttachment({
  fichier,
  pending,
}: FileAttachmentProps) {
  if (pending) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-default-200 bg-default-50 px-3 py-2">
        <Spinner color="current" size="sm" />
        <span className="text-xs truncate">{fichier.nomOriginal}</span>
      </div>
    );
  }

  const url = `/api/files/${fichier.id}`;
  const isImage = fichier.mimeType.startsWith("image/");

  if (isImage) {
    return (
      <a href={url} rel="noopener noreferrer" target="_blank">
        {/* eslint-disable-next-line @next/next/no-img-element -- fichier servi par la route authentifiée /api/files/[id] (no-store) : next/image le refetcherait sans session → 403 */}
        <img
          alt={fichier.nomOriginal}
          className="max-h-48 rounded-lg object-cover"
          src={url}
        />
      </a>
    );
  }

  return (
    <a
      download
      className="flex items-center gap-2 rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-default-700 hover:border-default-300"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon icon="solar:file-text-linear" width={20} />
      <span className="flex-1 text-xs truncate" title={fichier.nomOriginal}>
        {fichier.nomOriginal}
      </span>
      <Icon icon="solar:download-minimalistic-linear" width={16} />
    </a>
  );
}
