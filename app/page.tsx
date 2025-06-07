"use client";
import { ArrowLeft } from "lucide-react";
import ThreeScene from "../public/3D/ThreeScene";
import { Progress } from "@heroui/react";
import { useState, useEffect } from "react";
import { Checkbox } from "@heroui/react";
import { fetchBadges, fetchUserProgress, saveCompetenceProgress } from "./services/api.service";
import type { Badge, Competence, Realisations } from "../interface/interfaces";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showProgress, setShowProgress] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<number, { isCompleted: boolean; completedAt: Date | null }>>({});

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    
    // Charger les badges et les progressions
    Promise.all([fetchBadges(), fetchUserProgress()])
      .then(([badgesData, progressData]) => {
        setBadges(badgesData);
        setUserProgress(progressData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [router]);

  // Fonction pour gérer le changement d'état d'une compétence
  const handleCompetenceToggle = async (competenceId: string, isCompleted: boolean) => {
    const numericId = parseInt(competenceId);
    
    try {
      // Sauvegarde optimiste
      setUserProgress(prev => ({
        ...prev,
        [numericId]: {
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      }));

      // Sauvegarde en base
      await saveCompetenceProgress(numericId, isCompleted);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      // Rollback en cas d'erreur
      setUserProgress(prev => ({
        ...prev,
        [numericId]: {
          isCompleted: !isCompleted,
          completedAt: !isCompleted ? new Date() : null,
        },
      }));
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#bbd0ff] flex items-center justify-center">
        <div className="text-2xl font-DMSans text-white">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
            <div className="flex items-center justify-between gap-10">
              <h3 className="chemise-txt1 font-koulen text-header text-white">
                Ma chemise
              </h3>
              <button
                onClick={handleLogout}
                className="bg-white text-[#171717] px-4 py-2 rounded-[20px] font-DMSans text-sm hover:bg-gray-100 transition-colors"
              >
                Déconnexion
              </button>
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
                  selectedBadgeId={selectedBadge?.number ?? null}
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
        <div className="panel--secondary__content items-center justify-center relative py-5 overflow-auto	">
          <div className="border-right"></div>
          <div className="border-right2"></div>

          {/* Affichage conditionnel : Progression OU Compétences */}
          {showProgress ? (
            <div className="progress-view pt-3 px-4 ">
              <h2 className="font-LondrinaSolid text-4xl text-white font-bold tracking-wide text-left">
                MA PROGRESSION
              </h2>
              <div className="container-progress mt-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Specialité Branche Petits Flambeaux
                  </span>
                  <Progress
                    value={60}
                    size="md"
                    aria-label="Progression Specialité Branche Petits Flambeaux"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#ece835]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Specialité Branche Flambeaux
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Specialité Branche Flambeaux"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#2357a7]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Animation
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Animation"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#eabf2c]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Communication
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Communication"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#f37b61]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Construction
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Construction"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#cc7b4d]",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Exploration
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Exploration"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#3a7155]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Intendance
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Intendance"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#733d8a]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Matériel
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Matériel"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#333333]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Nature
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Nature"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#4bbe97]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Santé
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Santé"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#9a1622]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Vie Spirituelle
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Vie Spirituelle"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#9d57a2]",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[#404359] font-DMSans text-sm font-semibold text-start">
                    Spécialité Cuisine
                  </span>
                  <Progress
                    value={60}
                    color="warning"
                    size="md"
                    aria-label="Progression Spécialité Cuisine"
                    classNames={{
                      track: "bg-white border-1 border-black",
                      indicator: "bg-[#e07f31]",
                    }}
                  />
                </div>
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
                {selectedBadge?.competences.map((competence) => {
                  const numericId = parseInt(competence.id);
                  const isCompleted = userProgress[numericId]?.isCompleted || false;
                  
                  return (
                    <div key={competence.id} className="competence-item">
                      <label className="flex gap-3 text-white text-sm">
                        <Checkbox
                          isSelected={isCompleted}
                          onValueChange={(checked) => handleCompetenceToggle(competence.id, checked)}
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
                  );
                })}
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
