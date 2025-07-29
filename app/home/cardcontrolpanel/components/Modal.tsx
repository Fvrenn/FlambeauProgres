import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import React, { useState } from "react";
import { Home, ChatRoundLine, RoundGraph } from "@solar-icons/react";
import {
  Input,
  Textarea,
  Select,
  SelectSection,
  SelectItem,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { CustomTextarea } from "@/src/components/ui/Textarea";
import { CustomDatePicker } from "@/src/components/ui/DatePicker";
import { CustomSelect } from "@/src/components/ui/Select";
import { CustomCheckbox } from "@/src/components/ui/Checkbox";

import ProgressBar from "@/src/components/ui/Progress";
interface MaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  competence: {
    code: string;
    description: string;
  };
  badge: {
    name: string;
    image_src: string;
  };
}

export default function MaModal({
  isOpen,
  onOpenChange,
  competence,
  badge,
}: MaModalProps) {
  const [activeTab, setActiveTab] = useState<
    "justification" | "commentaire" | "statut"
  >("justification");

  // Définition des onglets
  const tabs = [
    { key: "justification", label: "Justification", icon: Home },
    { key: "commentaire", label: "Commentaire", icon: ChatRoundLine },
    { key: "statut", label: "Statut", icon: RoundGraph },
  ];

  const nbJeunes = [
    { key: "1-5", label: "1-5" },
    { key: "5-10", label: "5-10" },
    { key: "10-15", label: "10-15" },
    { key: "15-20", label: "15-20" },
  ];
  const Tranche = [
    { key: "7-8", label: "7-8 ans" },
    { key: "9-11", label: "9-11 ans" },
    { key: "11-15 ", label: "11-15 ans" },
    { key: "15-17", label: "15-17 ans" },
  ];

  const niveau = [
    { key: "Débutant", label: "Débutant" },
    { key: "Intermédiaire", label: "Intermédiaire" },
    { key: "Avancé", label: "Avancé" },
  ];

  function renderTabContent() {
    switch (activeTab) {
      case "justification":
        return (
          <div>
            <div className="mb-9">
              Justification de la compétence (placeholder)
            </div>

            <div className="flex flex-col gap-7">
              <section>
                <h3 className="font-medium text-base mb-4">Quoi&nbsp;?</h3>
                <CustomTextarea
                  theme="default"
                  label="Description"
                  labelPlacement="inside"
                  placeholder="Entrez la justification ici..."
                  description="💡 Exemple : Atelier nœuds de 2h avec jeux et défis"
                  minRows={3}
                  maxRows={10}
                />
              </section>
              <section>
                <h3 className="font-medium text-base mb-4">Quand&nbsp;?</h3>
                <div className="flex flex-col gap-4">
                  <CustomDatePicker
                    theme="default"
                    labelPlacement="inside"
                    label="Date de l’activité"
                    minValue={today(getLocalTimeZone())}
                    showMonthAndYearPickers
                  />
                  <CustomTextarea
                    theme="default"
                    label="Contexte"
                    labelPlacement="inside"
                    placeholder="Entrez le contexte ici..."
                    description="💡 Exemple : Camp rallye 2025"
                    minRows={3}
                    maxRows={10}
                  />
                </div>
              </section>
              <section>
                <h3 className="font-medium text-base mb-4">Avec qui&nbsp;?</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <CustomSelect
                      theme="default"
                      label="Nombre de jeunes"
                      labelPlacement="inside"
                      placeholder="Sélectionnez un nombre"
                      options={nbJeunes}
                      onSelectionChange={(keys) => console.log(keys)}
                    />
                    <CustomSelect
                      theme="default"
                      label="Tranche d’âge"
                      labelPlacement="inside"
                      placeholder="Sélectionnez une tranche"
                      options={Tranche}
                      onSelectionChange={(keys) => console.log(keys)}
                    />
                    <CustomSelect
                      theme="default"
                      label="Niveau"
                      labelPlacement="inside"
                      placeholder="Sélectionnez un niveau"
                      options={niveau}
                      onSelectionChange={(keys) => console.log(keys)}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Résultats&nbsp;?</h3>
                <CustomTextarea
                  theme="default"
                  label="Objectifs atteints"
                  labelPlacement="inside"
                  placeholder="Entrez les objectifs qui ont été atteints"
                  description="💡 Exemple : La plupart des jeunes maîtrisent"
                  minRows={3}
                  maxRows={10}
                />
              </section>
            </div>
          </div>
        );
      case "commentaire":
        // Exemple de structure de messages
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6">
              {/* Message principal */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {/* Initiales ou icône */}A
                </div>
                <div>
                  <span className="font-semibold">Admin Alice</span>
                  <span className="ml-2 text-xs text-gray-400">2024-03-15</span>
                </div>
              </div>
              <div className="ml-12 mb-4 text-gray-800">
                Voici un commentaire important concernant les nouvelles
                fonctionnalités.
              </div>
              {/* Réponse */}
              <div className="flex items-start gap-3 ml-8 border-l-2 border-gray-100 pl-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  U
                </div>
                <div>
                  <div>
                    <span className="font-semibold">User Bob</span>
                    <span className="ml-2 text-xs text-gray-400">
                      2024-03-16
                    </span>
                  </div>
                  <div className="text-gray-700">
                    Merci pour cette information. Pouvez-vous donner plus de
                    détails&nbsp;?
                  </div>
                </div>
              </div>
              {/* Champ de réponse */}
              <form className="mt-6 flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Écrire une réponse…"
                  size="md"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                >
                  Répondre
                </button>
              </form>
            </div>
          </div>
        );
      case "statut":
        return (
          <div>
            <div className="bg-[#f5f4ed] py-2.5 px-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <img
                  className="max-w-14 h-16"
                  src={badge.image_src}
                  alt={`Badge ${badge.name}`}
                />
                <ProgressBar percentage={10} label={`Etapes ${badge.name}`} />
              </div>

              <hr className="border-light-grey mt-4 mb-5 mx-3" />

              <div className="flex flex-col gap-1">
                <CustomCheckbox
                  theme="modal"
                  defaultSelected
                  disabled
                  className="text-white"
                >
                  Justification rédigée
                </CustomCheckbox>
                <CustomCheckbox
                  theme="modal"
                  className="text-white"
                  disabled
                >
                  Fichiers joints
                </CustomCheckbox>
                <CustomCheckbox
                  theme="modal"
                  defaultSelected
                  disabled
                  className="text-white"
                >
                  Soumission effectuée  
                </CustomCheckbox>
                <CustomCheckbox
                  theme="modal"
                  disabled
                  defaultSelected
                  className="text-white"
                >
                  Précisions demandées
                </CustomCheckbox>
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
        {/* <ModalHeader>
          <span className="font-bold text-lg">Détail de la compétence</span>
        </ModalHeader> */}
        <ModalBody className="p-0">
          {/* Texte au-dessus de la nav */}

          <div className="flex min-h-[250px]">
            {/* Bloc aside pour la navigation */}
            <aside className="flex flex-col w-80 border-r border-gray-200 pr-4 bg-background rounded-l-lg px-8 py-11">
              <span className="font-medium text-base mb-9">
                Etapes {badge.name}
              </span>

              <div className="pl-2 mb-4">
                <p className="mb-11 text-base font-medium ">
                  {competence.code} :&nbsp;
                  {competence.description}
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
        {/* <ModalFooter>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}
