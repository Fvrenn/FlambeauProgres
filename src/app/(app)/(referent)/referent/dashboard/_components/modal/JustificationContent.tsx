"use client";
import React from "react";
import { Card, CardBody, User, Link, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { User as UserType, Justification, Fichier } from "@prisma/client";

// Define local type for Fichier if needed or import
type FichierAvecUrl = Fichier & { url: string };

interface JustificationContentProps {
  justification: Justification & { chef: UserType; fichiers?: FichierAvecUrl[] };
}

export default function JustificationContent({ justification }: JustificationContentProps) {
  return (
    <div className="space-y-6">
      {/* 1. Meta Info & Contenu Principal - Clean Look without heavy Cards */}
      <div className="space-y-5">
        <label className="text-xs font-semibold text-default-500 uppercase tracking-wider">
          Contenu de la justification
        </label>
        <div className="bg-default rounded-xl p-4 md:p-6 border border-default-100">
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {justification.contenu}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-default-400 border-t border-default-200/50 pt-3">
            <Icon icon="solar:calendar-linear" width={14} />
            <span>Soumis le {justification.soumiseAt ? new Date(justification.soumiseAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</span>
          </div>
        </div>
      </div>

      {/* 2. Fichiers - Grid Layout for Images */}
      {justification.fichiers && justification.fichiers.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-default-500 uppercase tracking-wider flex items-center gap-2">
            <Icon icon="solar:paperclip-linear" width={14} />
            Fichiers joints ({justification.fichiers.length})
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {justification.fichiers.map((fichier) => (
              <div
                key={fichier.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-default-200 bg-white hover:border-default-300 transition-colors"
              >
                {/* Preview Area */}
                <div className="relative aspect-video w-full bg-default-100 flex items-center justify-center overflow-hidden">
                  {fichier.mimeType.startsWith("image/") ? (
                    <img
                      src={fichier.url}
                      alt={fichier.nomOriginal}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Icon icon="solar:file-text-linear" width={32} className="text-default-400" />
                  )}

                  {/* Overlay action */}
                  <a
                    href={fichier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                      <Icon icon="solar:eye-linear" className="text-default-900" width={20} />
                    </div>
                  </a>
                </div>

                {/* Footer Info */}
                <div className="p-3 flex items-center justify-between gap-2 bg-default-50/50">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-default-700 truncate" title={fichier.nomOriginal}>
                      {fichier.nomOriginal}
                    </p>
                    <p className="text-[10px] text-default-400 uppercase">
                      {fichier.mimeType.split('/')[1]}
                    </p>
                  </div>
                  <a
                    href={fichier.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-default-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Icon icon="solar:download-minimalistic-linear" width={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
