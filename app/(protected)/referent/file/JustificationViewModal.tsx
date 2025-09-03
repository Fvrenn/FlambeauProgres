import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import React, { useState } from "react";
import {
  Home,
  ChatRoundLine,
  RoundGraph,
  Gallery,
  DocumentText,
  DangerTriangle,
} from "@solar-icons/react";
import { CalendarDate } from "@internationalized/date";
import type { JustificationWithRelations } from "@/src/types/justificationWithRelations";
import { CustomButton } from "@/src/components/ui/Button";
import { useValidateJustification } from "@/src/hooks/useValidateJustification";
import RefuserJustificationModal from "./RefuserJustificationModal";
import DemandePrecisionModal from "./DemandePrecisionModal";

interface JustificationViewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  justification: JustificationWithRelations;
}

export default function JustificationViewModal({
  isOpen,
  onOpenChange,
  justification,
}: JustificationViewModalProps) {
  const [activeTab, setActiveTab] = useState<
    "justification" | "commentaire" | "statut"
  >("justification");

  // État pour la modal de demande de précision
  const [demandePrecisionModal, setDemandePrecisionModal] = useState<{
    isOpen: boolean;
    champ: string;
    champLabel: string;
  }>({
    isOpen: false,
    champ: "",
    champLabel: "",
  });

  // État pour la modal de refus
  const [refuserModal, setRefuserModal] = useState(false);

  // Hook pour la validation
  const { mutate: validateJustification, isPending: isValidating } = useValidateJustification();

  const tabs = [
    { key: "justification", label: "Justification", icon: Home },
    { key: "commentaire", label: "Commentaire", icon: ChatRoundLine },
    { key: "statut", label: "Statut", icon: RoundGraph },
  ];

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Non renseigné";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  };

  const handleDemanderPrecision = (champ: string, champLabel: string) => {
    setDemandePrecisionModal({
      isOpen: true,
      champ,
      champLabel,
    });
  };

  const handleValider = () => {
    if (!justification?.id) return;
    validateJustification({
      justificationId: justification.id,
      action: "VALIDER",
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const handleRefuser = (commentaire: string) => {
    if (!justification?.id) return;
    validateJustification({
      justificationId: justification.id,
      action: "REFUSER",
      commentaire,
    }, {
      onSuccess: () => {
        setRefuserModal(false);
        onOpenChange(false);
      }
    });
  };

  const renderChampAvecBouton = (
    valeur: string | number | null | undefined,
    champ: string,
    champLabel: string,
    description: string
  ) => {
    const isEmpty = !valeur || valeur === "" || valeur === "Non renseigné";

    return (
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <p className={`text-gray-800 ${isEmpty ? "text-gray-400 italic" : ""}`}>
              {valeur || "Non renseigné"}
            </p>
          </div>
          <button
            onClick={() => handleDemanderPrecision(champ, champLabel)}
            className={`ml-2 p-1 rounded transition-colors ${
              isEmpty
                ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
            }`}
            title={`Demander une précision sur ${champLabel}`}
          >
            <DangerTriangle weight="BoldDuotone" size={16} color={isEmpty ? "#0f4159" : "#aaa"} />
          </button>
        </div>
      </div>
    );
  };

  function renderTabContent() {
    switch (activeTab) {
      case "justification":
        return (
          <div>
            <div className="mb-9">
              <h2 className="text-xl font-semibold">Justification soumise</h2>
              <p className="text-gray-600 mt-2">
                Soumise le {formatDate(justification.soumiseAt)} par{" "}
                {justification.chef.name}
              </p>
            </div>

            <div className="flex flex-col gap-7">
              <section>
                <h3 className="font-medium text-base mb-4">Quoi ?</h3>
                {renderChampAvecBouton(
                  justification.activiteDescription,
                  "activiteDescription",
                  "Description de l'activité",
                  "Description de l'activité"
                )}
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Quand ?</h3>
                <div className="flex flex-col gap-4">
                  {renderChampAvecBouton(
                    formatDate(justification.dateActivite),
                    "dateActivite",
                    "Date de l'activité",
                    "Date de l'activité"
                  )}

                  {renderChampAvecBouton(
                    justification.dureeHeures
                      ? `${justification.dureeHeures} heure(s)`
                      : null,
                    "dureeHeures",
                    "Durée",
                    "Durée"
                  )}

                  {renderChampAvecBouton(
                    justification.contexte,
                    "contexte",
                    "Contexte",
                    "Contexte"
                  )}
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Avec qui ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderChampAvecBouton(
                    justification.nombreJeunes,
                    "nombreJeunes",
                    "Nombre de jeunes",
                    "Nombre de jeunes"
                  )}

                  {renderChampAvecBouton(
                    justification.trancheAge,
                    "trancheAge",
                    "Tranche d'âge",
                    "Tranche d'âge"
                  )}

                  {renderChampAvecBouton(
                    justification.niveau,
                    "niveau",
                    "Niveau",
                    "Niveau"
                  )}
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Résultats ?</h3>
                {renderChampAvecBouton(
                  justification.objectifsAtteints,
                  "objectifsAtteints",
                  "Objectifs atteints",
                  "Objectifs atteints"
                )}
              </section>

              {/* Section fichiers - à développer plus tard */}
              <section>
                <h3 className="font-medium text-base mb-4">
                  Fichiers justificatifs
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 italic">
                    Fonctionnalité à venir : affichage des fichiers joints
                  </p>
                </div>
              </section>

              {/* Actions de validation pour le référent */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <CustomButton
                  theme="primary"
                  onClick={handleValider}
                  disabled={isValidating}
                  isLoading={isValidating}
                  startContent={!isValidating && <span>✅</span>}
                >
                  Valider
                </CustomButton>

                <CustomButton
                  theme="danger"
                  onClick={() => setRefuserModal(true)}
                  disabled={isValidating}
                >
                  <span className="mr-2">❌</span>
                  Refuser
                </CustomButton>
              </div>
            </div>
          </div>
        );

      case "commentaire":
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500 italic text-center">
                Fonctionnalité à venir : système de commentaires entre référent
                et chef
              </p>
            </div>
          </div>
        );

      case "statut":
        return (
          <div>
            <div className="bg-[#f5f4ed] py-2.5 px-3 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">
                    {justification.badge.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    Badge {justification.badge.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {justification.objectif.code} -{" "}
                    {justification.objectif.description}
                  </p>
                </div>
              </div>

              <hr className="border-light-grey mt-4 mb-5 mx-3" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Justification soumise</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📝</span>
                  <span>En attente de validation référent</span>
                </div>

                <div className="text-sm text-gray-600 mt-4">
                  <p>
                    <strong>Chef :</strong> {justification.chef.name}
                  </p>
                  <p>
                    <strong>Email :</strong> {justification.chef.email}
                  </p>
                  <p>
                    <strong>Statut :</strong> {justification.statut}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <>
      {/* Modal de refus */}
      <RefuserJustificationModal
        isOpen={refuserModal}
        onOpenChange={setRefuserModal}
        onConfirm={handleRefuser}
        isLoading={isValidating}
      />

      {/* Modal de demande de précision */}
      {justification?.id && (
        <DemandePrecisionModal
          isOpen={demandePrecisionModal.isOpen}
          onOpenChange={(open) =>
            setDemandePrecisionModal((prev) => ({ ...prev, isOpen: open }))
          }
          justificationId={justification.id}
          champ={demandePrecisionModal.champ}
          champLabel={demandePrecisionModal.champLabel}
          onSuccess={() => {
            console.log("Précision demandée avec succès");
          }}
        />
      )}

      {/* Modal principale */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          <ModalBody className="p-0">
            <div className="flex min-h-[250px]">
              {/* Bloc aside pour la navigation */}
              <aside className="flex flex-col w-80 border-r border-gray-200 pr-4 bg-background rounded-l-lg px-8 py-11">
                <span className="font-medium text-base mb-9">
                  Validation {justification.badge.name}
                </span>

                <div className="pl-2 mb-4">
                  <p className="mb-11 text-base font-medium">
                    {justification.objectif.code} :{" "}
                    {justification.objectif.description}
                  </p>
                </div>

                <nav>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        className={`
                          w-full text-left px-4 py-2 mb-2 rounded-xl transition-colors font-normal flex items-center gap-2
                          ${
                            activeTab === tab.key
                              ? "bg-light-beige text-black"
                              : "hover:bg-medium-black hover:text-white text-gray-700"
                          }
                        `}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      >
                        {Icon && <Icon size={18} />}
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Contenu principal */}
              <div className="flex-1 px-8 pt-12 pb-6">
                <div>{renderTabContent()}</div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
