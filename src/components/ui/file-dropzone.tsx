"use client";

import type { ReglesFichier } from "@/lib/fichiers";

import React from "react";
import { Button } from "@heroui/react";

import { Icon } from "@/lib/icons";
import { toAttributAccept, validerFichier } from "@/lib/fichiers";

type FileDropzoneProps = {
  label: string;
  aide: string;
  regles: ReglesFichier;
  fichier: File | null;
  onChange: (fichier: File | null) => void;
  apercuActuel?: string | null;
};

export function FileDropzone({
  label,
  aide,
  regles,
  fichier,
  onChange,
  apercuActuel,
}: FileDropzoneProps) {
  const inputId = React.useId();
  const [apercu, setApercu] = React.useState<string | null>(null);
  const [erreur, setErreur] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const choisi = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!choisi) {
      return;
    }

    const erreurValidation = validerFichier(choisi, regles);

    setErreur(erreurValidation);

    if (erreurValidation) {
      return;
    }

    remplacerApercu(estImage(choisi) ? URL.createObjectURL(choisi) : null);
    onChange(choisi);
  };

  const handleRemove = () => {
    remplacerApercu(null);
    onChange(null);
  };

  const remplacerApercu = (nouvelApercu: string | null) => {
    if (apercu) {
      URL.revokeObjectURL(apercu);
    }

    setApercu(nouvelApercu);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>

      {fichier ? (
        <FichierChoisi
          apercu={apercu}
          fichier={fichier}
          onRemove={handleRemove}
        />
      ) : (
        <label
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-dashboard-border p-6 text-center transition-colors hover:border-primary"
          htmlFor={inputId}
        >
          {apercuActuel ? (
            <ImageApercu className="h-24" src={apercuActuel} />
          ) : (
            <Icon
              className="text-default-400"
              icon="solar:cloud-upload-linear"
              width={48}
            />
          )}
          <span className="text-sm text-default-600">
            {apercuActuel
              ? "Clique pour remplacer le fichier"
              : "Clique pour sélectionner un fichier"}
          </span>
          <span className="text-xs text-default-400">{aide}</span>
        </label>
      )}

      <input
        accept={toAttributAccept(regles)}
        className="hidden"
        id={inputId}
        type="file"
        onChange={handleChange}
      />

      {erreur && <p className="text-xs text-danger">{erreur}</p>}
    </div>
  );
}

function estImage(fichier: File): boolean {
  return fichier.type.startsWith("image/");
}

type FichierChoisiProps = {
  fichier: File;
  apercu: string | null;
  onRemove: () => void;
};

function FichierChoisi({ fichier, apercu, onRemove }: FichierChoisiProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashboard-border p-4">
      {apercu && <ImageApercu className="h-48 w-full" src={apercu} />}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            className="shrink-0"
            icon={apercu ? "solar:gallery-linear" : "solar:document-linear"}
            width={20}
          />
          <span className="truncate text-sm font-medium">{fichier.name}</span>
          <span className="shrink-0 text-xs text-default-400">
            ({(fichier.size / 1024).toFixed(1)} Ko)
          </span>
        </div>
        <Button
          isIconOnly
          aria-label="Retirer le fichier"
          color="danger"
          size="sm"
          variant="flat"
          onPress={onRemove}
        >
          <Icon icon="solar:trash-bin-minimalistic-linear" width={18} />
        </Button>
      </div>
    </div>
  );
}

function ImageApercu({ src, className }: { src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- preview of a local blob URL or of the current icon; next/image cannot optimize blob URLs
    <img
      alt="Aperçu"
      className={`${className} rounded-lg object-contain`}
      src={src}
    />
  );
}
