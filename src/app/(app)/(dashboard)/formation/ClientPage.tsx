"use client";

import type { FormationCard } from "@prisma/client";

import { Image as HeroImage } from "@heroui/react";
import { Icon } from "@iconify/react";

type FormationClientPageProps = {
  formations: FormationCard[];
};

export default function FormationClientPage({
  formations,
}: FormationClientPageProps) {
  if (formations.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 gap-2 text-default-500 text-sm">
        <Icon className="text-4xl" icon="solar:book-bookmark-linear" />
        <p>Aucune ressource de formation pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {formations.map((f) => (
        <a
          key={f.id}
          className="group flex flex-col rounded-ds-lg bg-default-100 shadow-inset-border overflow-hidden transition-transform duration-fast hover:-translate-y-0.5"
          href={f.lien}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-content1">
            <HeroImage
              removeWrapper
              alt={f.titre}
              className="w-full h-full object-cover"
              src={f.imageUrl}
            />
          </div>
          <div className="flex items-center justify-between gap-2 p-5">
            <span className="font-medium text-foreground line-clamp-2">
              {f.titre}
            </span>
            <Icon
              className="text-default-400 shrink-0 group-hover:text-foreground transition-colors"
              icon="solar:arrow-right-up-linear"
              width={20}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
