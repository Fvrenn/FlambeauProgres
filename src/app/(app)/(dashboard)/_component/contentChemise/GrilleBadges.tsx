"use client";

import React from "react";
import Image from "next/image";

import { EtapeAvecObjectifs } from "../DashboardClient";

import { Icon } from "@/lib/icons";
import { decouperEnPages } from "@/lib/pagination";

const COLONNES = 3;
const LIGNES_MIN = 2;
const LIGNES_MAX = 4;
const LIGNES_SELON_HAUTEUR = [
  { requete: "(min-height: 900px)", lignes: LIGNES_MAX },
  { requete: "(min-height: 780px)", lignes: 3 },
];

type GrilleBadgesProps = {
  badges: EtapeAvecObjectifs[];
  selectedEtapeId: string | undefined;
  onBadgeClick: (etape: EtapeAvecObjectifs) => void;
};

export default function GrilleBadges({
  badges,
  selectedEtapeId,
  onBadgeClick,
}: GrilleBadgesProps) {
  const renderBadge = (etape: EtapeAvecObjectifs) => (
    <BadgeEtape
      key={etape.id}
      estSelectionne={selectedEtapeId === etape.id}
      etape={etape}
      onClick={() => onBadgeClick(etape)}
    />
  );

  return (
    <>
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden py-2 md:hidden">
        {badges.map(renderBadge)}
      </div>
      <CarrouselBadges badges={badges} renderBadge={renderBadge} />
    </>
  );
}

type CarrouselBadgesProps = {
  badges: EtapeAvecObjectifs[];
  renderBadge: (etape: EtapeAvecObjectifs) => React.ReactNode;
};

function CarrouselBadges({ badges, renderBadge }: CarrouselBadgesProps) {
  const pisteRef = React.useRef<HTMLDivElement>(null);
  const lignes = useLignesSelonHauteur();
  const [pageChoisie, setPageChoisie] = React.useState(0);

  const pages = decouperEnPages(badges, COLONNES * lignes);
  const pageCourante = Math.min(pageChoisie, pages.length - 1);
  const aPlusieursPages = pages.length > 1;

  React.useEffect(() => {
    pisteRef.current?.scrollTo({ left: 0 });
  }, [lignes]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = event.currentTarget;

    setPageChoisie(Math.round(scrollLeft / clientWidth));
  };

  const allerALaPage = (page: number) => {
    const piste = pisteRef.current;

    piste?.scrollTo({ left: page * piste.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="hidden flex-col items-center gap-1 md:flex">
      <div className="flex w-full items-center">
        {aPlusieursPages && (
          <FlechePage
            direction="precedente"
            estDesactivee={pageCourante === 0}
            onClick={() => allerALaPage(pageCourante - 1)}
          />
        )}
        <div
          ref={pisteRef}
          className="scrollbar-hide flex min-w-0 flex-1 snap-x snap-mandatory items-start overflow-x-auto"
          onScroll={handleScroll}
        >
          {pages.map((page, index) => (
            <div
              key={index}
              className="page-badges grid w-full shrink-0 snap-start grid-cols-3 place-items-center gap-2 py-2"
            >
              {page.map(renderBadge)}
            </div>
          ))}
        </div>
        {aPlusieursPages && (
          <FlechePage
            direction="suivante"
            estDesactivee={pageCourante === pages.length - 1}
            onClick={() => allerALaPage(pageCourante + 1)}
          />
        )}
      </div>

      {aPlusieursPages && (
        <div className="flex gap-1.5">
          {pages.map((_, index) => (
            <button
              key={index}
              aria-label={`Page ${index + 1}`}
              className={`h-1.5 cursor-pointer rounded-full transition-all ${
                index === pageCourante
                  ? "w-4 bg-foreground/60"
                  : "w-1.5 bg-foreground/20"
              }`}
              type="button"
              onClick={() => allerALaPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function useLignesSelonHauteur(): number {
  const [lignes, setLignes] = React.useState(LIGNES_MAX);

  React.useEffect(() => {
    const requetes = LIGNES_SELON_HAUTEUR.map(({ requete, lignes }) => ({
      media: window.matchMedia(requete),
      lignes,
    }));
    const sync = () =>
      setLignes(
        requetes.find(({ media }) => media.matches)?.lignes ?? LIGNES_MIN,
      );

    sync();
    requetes.forEach(({ media }) => media.addEventListener("change", sync));

    return () =>
      requetes.forEach(({ media }) =>
        media.removeEventListener("change", sync),
      );
  }, []);

  return lignes;
}

type FlechePageProps = {
  direction: "precedente" | "suivante";
  estDesactivee: boolean;
  onClick: () => void;
};

function FlechePage({ direction, estDesactivee, onClick }: FlechePageProps) {
  return (
    <button
      aria-label={
        direction === "precedente" ? "Étapes précédentes" : "Étapes suivantes"
      }
      className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-default-500 transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-30"
      disabled={estDesactivee}
      type="button"
      onClick={onClick}
    >
      <Icon
        icon={
          direction === "precedente"
            ? "solar:alt-arrow-left-linear"
            : "solar:alt-arrow-right-linear"
        }
        width={20}
      />
    </button>
  );
}

type BadgeEtapeProps = {
  etape: EtapeAvecObjectifs;
  estSelectionne: boolean;
  onClick: () => void;
};

function BadgeEtape({ etape, estSelectionne, onClick }: BadgeEtapeProps) {
  return (
    <div className="relative flex-shrink-0">
      <button
        aria-label={`Sélectionner l'étape ${etape.name}`}
        className={`cursor-pointer opacity-100 holographic-card ${
          etape.isValidated ? "validated md:opacity-80" : "md:opacity-50"
        } ${estSelectionne ? "active" : ""}`}
        onClick={onClick}
      >
        {etape.image_src ? (
          <Image
            alt={etape.name}
            className="w-[50px] h-auto md:w-[67px] md:h-[77px]"
            height={77}
            sizes="(max-width: 768px) 50px, 67px"
            src={etape.image_src}
            width={67}
          />
        ) : (
          <span
            className="flex w-[50px] h-[58px] md:w-[67px] md:h-[77px] items-center justify-center rounded-medium border border-dashboard-border text-sm font-semibold"
            style={{ color: etape.couleur ?? undefined }}
          >
            {etape.number}
          </span>
        )}
      </button>
      {etape.isValidated && (
        <Icon
          aria-label="Badge validé"
          className="absolute -top-1 -right-1 z-10 w-5 h-5 text-primary drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
          icon="solar:verified-check-bold"
        />
      )}
    </div>
  );
}
