"use client";

import "./CardEtapes.css";
import { useBadges } from "@/hooks/useBadges";
import { ChemiseModel } from "@/components/home/cardchemise/ChemiseModel";

interface CardChemiseProps {
  onBadgeSelect: (badgeNumber: string) => void;
  selectedBadge: string | null;
}

export const CardChemise = ({
  onBadgeSelect,
  selectedBadge,
}: CardChemiseProps) => {
  const { badges, isLoading, error } = useBadges();

  if (isLoading) return <p>Chargement des badges...</p>;
  if (error) return <p>Erreur lors du chargement des badges.</p>;

  return (
    <section className="bg-dark-beige w-full p-0.5 rounded-3xl h-full">
      <div className="flex h-2/4 justify-center">
        {/* Passage de selectedBadge au ChemiseModel */}
        <ChemiseModel selectedBadge={selectedBadge} />
      </div>
      <div className="bg-light-beige w-full h-2/4 rounded-3xl border border-border-beige p-7">
        <div className="grid grid-cols-3 gap-4 place-items-center">
          {badges.map((badge) => (
            <div
              key={badge.number}
              className={`holographic-card${selectedBadge === badge.number ? " active" : ""}`}
              onClick={() => onBadgeSelect(badge.number)}
            >
              <img
                className="max-w-[67px] max-h-[77px]"
                src={badge.image_src}
                alt={`Badge ${badge.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};