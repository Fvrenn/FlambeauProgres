"use client";
import { ArrowLeft } from "lucide-react";
import ThreeScene from "../public/3D/ThreeScene";
import { Progress } from "@heroui/react";
import { useState } from "react";
import { Checkbox } from "@heroui/react";
export interface Competence {
  id: string;
  description: string;
  isCompleted: boolean;
  files?: File[];
}
export interface Realisations {
  id: string;
  description: string;
  isCompleted: boolean;
  files?: File[];
}

export interface Badge {
  id: string;
  name: string;
  number: string;
  description: string;
  imageSrc: string;
  competences: Competence[];
  realisations: Realisations[];
}

const badgesData: Badge[] = [
  {
    id: "2b-spe_PF",
    number: "2B",
    name: "Branche Petits Flambeaux",
    description:
      "Cette spécialité s'adresse bien entendu aux Chefs de la branche Petits Flambeaux. C'est une étape indispensable pour être Chef de Troupe de cette branche mais elle concerne également tout responsable qui souhaite mieux comprendre les objectifs pédagogiques propres à cette tranche d'âge.",
    imageSrc: "/etape-badges/2b-spe_PF.svg",
    competences: [
      {
        id: "b1",
        description:
          'Acquérir et savoir utiliser le "Guide du Bois" (p. 9 à 11)',
        isCompleted: false,
      },
      {
        id: "b2",
        description:
          "Se repérer dans le carnet et savoir expliquer l'ordre et le principe des différentes parties de chaque volume.",
        isCompleted: false,
      },
      {
        id: "b3",
        description:
          "Lire le chapitre \"L'enfant à l'âge PF\" p.19 du Guide du Bois et animer une discussion avec la maîtrise pour adapter les activités et les attitudes des Chefs.",
        isCompleted: false,
      },
      {
        id: "b4",
        description:
          "Observer les jeunes de ta sizaine, noter pour chacun d'eux les domaines dans lesquels il peut progresser (gestion affaires perso, vie de groupe, une des 5 relations ...), proposer des activités en rapport et faire le point à la fin du trimestre.",
        isCompleted: false,
      },
      {
        id: "b5",
        description:
          "Connaître les grandes lignes de l'histoire des ABQS, le rôle des 5 personnages principaux et savoir raconter le départ et l'arrivée au Parc.",
        isCompleted: false,
      },
      {
        id: "b6",
        description:
          "Expliquer aux jeunes le sens des différents rituels (rassemblement, Grand Arbre, Foulard d'Accueil...) et connaître la place des différents marqueurs sur l'uniforme.",
        isCompleted: false,
      },
      {
        id: "b7",
        description:
          "Accompagner un ami du Bois dans toute la démarche de la Parole de PF.",
        isCompleted: false,
      },
    ],
    realisations: [
      {
        id: "b8",
        description:
          "Concevoir un jeu, un Cercle du Feu et un Grand Arbre en lien avec l'imaginaire des ABQS et réaliser une fiche d'activité pour chacune d'elles en précisant les objectifs, la durée, le matériel nécessaire ...",
        isCompleted: false,
      },
      {
        id: "b9",
        description:
          'Proposer une ressource pédagogique (autre qu\'une fiche d\'animation) pour compléter la partie "Bois Tahouti" du "Guide du Bois"',
        isCompleted: false,
      },
    ],
  },
];

export default function Home() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showProgress, setShowProgress] = useState(true);

  const handleBackToProgress = () => {
    setSelectedBadge(null);
    setShowProgress(true);
  };

  const handleBadgeClick = (badgeId: string) => {
    if (selectedBadge && selectedBadge.id === badgeId) {
      handleBackToProgress();
      return;
    }

    const badge = badgesData.find((b) => b.id === badgeId);
    setSelectedBadge(badge || null);
    setShowProgress(false);
  };
  return (
    <div className={`page__container ${selectedBadge ? "badge-active" : ""}`}>
      <div className="panel--primary">
        <div className="panel--primary__content">
          <div className="panel-border__top-left"></div>
          <div className="panel-border__top-middle"></div>
          <div className="panel-border__top-right"></div>
          <div className="triangle__container">
            <div className="triangle__rounded"></div>
            <div className="triangle__cache"></div>
          </div>
          <div className="content__title">
            <div className="flex items-center justify-space-between gap-10">
              <h3 className="chemise-txt1 font-koulen text-header text-white">
                Ma chemise
              </h3>
              {/* <h3 className="etape2 font-LuckiestGuy text-[30px] text-white"> 4 etape validée</h3> */}
            </div>
          </div>

          <div className=" container__3d">
            <div className="content__3d">
              <h3 className="chemise-txt2 font-koulen text-header text-white">
                Ma chemise
              </h3>
              <div className="content__3d__container">
                <ThreeScene />
              </div>

              <div className="content__badges">
                <div className="holographic-container">
                  <div
                    className={`holographic-card ${
                      selectedBadge?.id === "2b-spe_PF" ? "active" : ""
                    }`}
                    onClick={() => handleBadgeClick("2b-spe_PF")}
                  >
                    <img src="/etape-badges/2b-spe_PF.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 ml-auto content__text">
              <div className="ml-10 ">
                <div className="ml-20 triangle-shape-1 mt-[-80px] flex justify-center mr-40 w-40">
                  <img src="/shape-triangle/triangle2.svg" alt="" />
                </div>
                <h1 className=" pr-10 font-LuckiestGuy text-[70px] text-white leading-[90px]">
                  4 etape validée
                </h1>
                <div className="triangle-shape-2 flex justify-end mr-[-20px] w-40">
                  <img src="/shape-triangle/triangle1.svg" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="left-side">
            <div className="triaangle-shape-1"></div>
            <div className="title"></div>
            <div className="triaangle-shape-2"></div>
          </div>
        </div>
      </div>

      <div className="panel--secondary purple ">
        <div className="panel--secondary__content items-center justify-center relative py-5">
          <div className="border-right"></div>
          <div className="border-right2"></div>

          {/* Affichage conditionnel : Progression OU Compétences */}
          {showProgress ? (
            <div className="progress-view p-4">
              <h2 className="font-koulen text-2xl text-white font-bold tracking-wide text-left">
                MA PROGRESSION
              </h2>
              <div>
                <Progress value={60} color="warning" size="md" />
              </div>
            </div>
          ) : (
            <div className="competences-view relative z-10">
              <div className="flex items-center mb-5 gap-3 m-6">
                <button onClick={handleBackToProgress}>
                  <ArrowLeft className="text-white" />
                </button>

                <h2 className="font-LondrinaSolid text-4xl text-white font-bold tracking-wide uppercase">
                  Étape {selectedBadge?.number}. {selectedBadge?.name}
                </h2>
              </div>
              <div className="m-6 description-etape font-DMSans text-sm font-semibold border-b border-white pb-5 px-3.5 mb-5 z-10 relative pr-11">
                <p>{selectedBadge?.description}</p>
              </div>
              <div className="competences-list space-y-3 m-8">
                <h3 className="font-LondrinaSolid text-3xl text-white font-bold tracking-wide uppercase">
                  Compétences
                </h3>
                {selectedBadge?.competences.map((competence) => (
                  <div key={competence.id} className="competence-item">
                    <label className="flex gap-3 text-white text-sm">
                      <Checkbox
                        defaultSelected
                        classNames={{
                          base: "max-w-full",
                          wrapper: [
                            "before:border-white before:bg-white",
                            "after:bg-[#594238] after:border-[#594238]",
                            "hover:before:border-white/70",
                          ].join(" "),
                          icon: "text-white",
                          label: "text-white font-medium",
                        }}
                      >
                        <span className="text-checkbox font-DMSans">
                          {competence.description}
                        </span>
                      </Checkbox>
                    </label>
                  </div>
                ))}
              </div>
              <div className="competences-list space-y-3 m-8">
                <h3 className="font-LondrinaSolid text-3xl text-white font-bold tracking-wide uppercase">
                  Réalisations
                </h3>
                {selectedBadge?.realisations.map((realisations) => (
                  <div key={realisations.id} className="competence-item">
                    <label className="flex gap-3 text-white text-sm">
                      <Checkbox
                        defaultSelected
                        classNames={{
                          base: "max-w-full",
                          wrapper: [
                            "before:border-white before:bg-white",
                            "after:bg-[#594238] after:border-[#594238]",
                            "hover:before:border-white/70",
                          ].join(" "),
                          icon: "text-white",
                          label: "text-white font-medium",
                        }}
                      >
                        <span className="text-checkbox font-DMSans">
                          {realisations.description}
                        </span>
                      </Checkbox>
                    </label>
                    <div className="mt-2 ml-6">
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="block w-full text-sm text-white
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-white file:text-[#594238]
                          hover:file:bg-gray-100
                          file:cursor-pointer cursor-pointer"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          console.log(
                            `Fichiers pour ${realisations.id}:`,
                            files
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-right-center"></div>
          <div className="border-right-center2"></div>
        </div>
      </div>
      <div className="panel--tertiary">
        <div className="panel--tertiary__content flex items-center justify-center">
          <h2 className="font-koulen text-2xl text-white font-bold tracking-wide">
            MA PROGRESSION
          </h2>
        </div>
      </div>
      <div className="panel--quaternary">
        <div className="panel--quaternary__content flex items-center justify-center">
          <h2 className="font-koulen text-2xl text-white font-bold tracking-wide">
            MA PROGRESSION
          </h2>
        </div>
      </div>

      <div className="triangle__accent-container">
        <svg
          width="373"
          height="373"
          viewBox="0 0 373 373"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <g transform="translate(0, 20)">
            <path
              d="M21.2123 251.788L251.788 21.2125C296.518 -23.5179 373 8.16199 373 71.4204V301.995C373 341.21 341.21 373 301.995 373H71.4203C8.16197 373 -23.5181 296.518 21.2123 251.788Z"
              fill="#FEB38F"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
