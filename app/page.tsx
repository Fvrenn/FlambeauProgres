"use client";
import { ArrowLeft } from "lucide-react";
import ThreeScene from "../public/3D/ThreeScene";
import { Progress } from "@heroui/react";
import { useState, useEffect } from "react";
import { Checkbox } from "@heroui/react";
import { fetchBadges, createBadge } from "./services/api.service";
import type { Badge, Competence, Realisations } from "../interface/interfaces";

export default function Home() {
  useEffect(() => {
    fetchBadges().then(setBadges).catch(console.error);
  }, []);
  const [badges, setBadges] = useState<Badge[]>([]);
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

    const badge = badges.find((b) => b.id === badgeId);
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
                <ThreeScene
                  rotate={!!selectedBadge}
                  selectedBadgeId={selectedBadge?.id?.toString()}
                />
              </div>

              <div className="content__badges">
                {badges.map((badge) => (
                  <div className="holographic-container" key={badge.id}>
                    <div
                      className={`holographic-card ${
                        selectedBadge?.id === badge.id ? "active" : ""
                      }`}
                      onClick={() => handleBadgeClick(badge.id)}
                    >
                      <img src={badge.image_src} alt={badge.name} />
                    </div>
                  </div>
                ))}
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
