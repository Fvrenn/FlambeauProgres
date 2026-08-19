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
        <div
          key={f.id}
          className="flex flex-col rounded-[22px] overflow-hidden h-[270px] bg-dashboard-panel"
        >
          <div
            className="w-full shrink-0 bg-dashboard-card border-b border-dashed border-dashboard-border overflow-hidden"
            style={{ height: 160, borderRadius: "22px 22px 0 0" }}
          >
            {f.imageUrl ? (
              <HeroImage
                removeWrapper
                alt={f.titre}
                className="w-full h-full object-cover rounded-none"
                src={f.imageUrl}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1 text-foreground/30">
                <Icon className="text-2xl" icon="solar:gallery-linear" />
                <span className="text-xs">Aucune image</span>
              </div>
            )}
          </div>

          <div
            className="flex flex-col justify-between bg-dashboard-panel"
            style={{ height: 110, padding: "18px 20px 20px" }}
          >
            <p
              className="line-clamp-2"
              style={{ fontSize: 17, fontWeight: 700 }}
            >
              {f.titre}
            </p>

            <a
              className="flex items-center justify-center gap-1.5 w-full rounded-[12px] py-2 text-[13px] font-semibold text-white cursor-pointer transition-colors"
              href={f.lien}
              rel="noopener noreferrer"
              style={{ backgroundColor: "#2f4a35" }}
              target="_blank"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#4d634f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2f4a35")
              }
            >
              Accéder
              <Icon icon="solar:arrow-right-up-linear" width={14} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
