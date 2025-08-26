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
} from "@solar-icons/react";
import { CalendarDate } from "@internationalized/date";
import type { JustificationWithRelations } from "@/src/types/justificationWithRelations";

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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Description de l'activité
                  </p>
                  <p className="text-gray-800">
                    {justification.activiteDescription || "Non renseigné"}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Quand ?</h3>
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Date de l'activité
                    </p>
                    <p className="text-gray-800">
                      {formatDate(justification.dateActivite)}
                    </p>
                  </div>

                  {justification.dureeHeures && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Durée</p>
                      <p className="text-gray-800">
                        {justification.dureeHeures} heure(s)
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Contexte</p>
                    <p className="text-gray-800">
                      {justification.contexte || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Avec qui ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Nombre de jeunes
                    </p>
                    <p className="text-gray-800">
                      {justification.nombreJeunes || "Non renseigné"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Tranche d'âge</p>
                    <p className="text-gray-800">
                      {justification.trancheAge || "Non renseigné"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Niveau</p>
                    <p className="text-gray-800">
                      {justification.niveau || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Résultats ?</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Objectifs atteints
                  </p>
                  <p className="text-gray-800">
                    {justification.objectifsAtteints || "Non renseigné"}
                  </p>
                </div>
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
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // TODO: Implémenter la validation
                    console.log("Valider la justification");
                  }}
                >
                  ✅ Valider
                </button>

                <button
                  type="button"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // TODO: Implémenter la demande de précisions
                    console.log("Demander des précisions");
                  }}
                >
                  ⚠️ Demander des précisions
                </button>

                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // TODO: Implémenter le refus
                    console.log("Refuser la justification");
                  }}
                >
                  ❌ Refuser
                </button>
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
  );
}
