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
import {
  Input,
  Textarea,
  Select,
  SelectSection,
  SelectItem,
} from "@heroui/react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { CustomTextarea } from "@/src/components/ui/Textarea";
import { CustomDatePicker } from "@/src/components/ui/DatePicker";
import { CustomSelect } from "@/src/components/ui/Select";
import { CustomCheckbox } from "@/src/components/ui/Checkbox";
import { useJustification } from "@/src/hooks/useJustification";
import ProgressBar from "@/src/components/ui/Progress";
import { useSession } from "@/src/lib/auth-client";
import type { Badge } from "@/src/types/badge";
import type { DateValue } from "@internationalized/date";
import { Selection } from "@heroui/react";
import { addToast } from "@heroui/toast";
import SubmitConfirmModal from "./ConfirmModal";

interface MaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  competence: {
    code: string;
    description: string;
    type: "COMPETENCE" | "REALISATION";
    fichiersRequis?: boolean;
  };
  badge: Badge;
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const objectif = badge.objectifs.find((o) => o.code === competence.code);
  const objectifId = objectif?.id ?? "";
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: session } = useSession();
  const chefId = session?.user?.id ?? "";

  const { useDraft } = useJustification();
  const {
    data: draft,
    isLoading,
    refetch,
  } = useDraft(badge.id, objectifId, chefId);

  const initialFormState = {
    activiteDescription: "",
    dateActivite: undefined as DateValue | undefined,
    dureeHeures: undefined as number | undefined,
    contexte: "",
    nombreJeunes: "" as string,
    trancheAge: "" as string,
    niveau: "" as string,
    objectifsAtteints: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [statut, setStatut] = useState<"BROUILLON" | "SOUMISE">("BROUILLON");

  const {
    saveJustification,
    submitJustification,
    isSaving,
    isSubmitting,
    saveError,
    submitError,
  } = useJustification();

  const hasFormContent = () => {
    return (
      form.activiteDescription.trim() !== "" ||
      form.dateActivite !== undefined ||
      form.dureeHeures !== undefined ||
      form.contexte.trim() !== "" ||
      form.nombreJeunes !== "" ||
      form.trancheAge !== "" ||
      form.niveau !== "" ||
      form.objectifsAtteints.trim() !== "" ||
      uploadedFiles.length > 0
    );
  };

  const handleModalClose = (open: boolean) => {
    if (!open && isOpen) {
      autoSave();
    }
    onOpenChange(open);
  };

  const autoSave = async () => {
    if (hasFormContent() && statut !== "SOUMISE") {
      try {
        const formattedData = formatFormData();
        if (draft && draft.id) {
          // PATCH si le brouillon existe
          await fetch("/api/justification", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formattedData,
              id: draft.id,
              statut: "BROUILLON",
            }),
          });
        } else {
          // POST si pas de brouillon
          await saveJustification(formattedData);
        }

        addToast({
          title: "Brouillon sauvegardé",
          description: `Brouillon pour la compétence ${competence.code} du badge ${badge.name} sauvegardé`,
          variant: "solid",
          color: "success",
        });

        console.log("Brouillon sauvegardé automatiquement");
      } catch (error) {
        addToast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder le brouillon",
          variant: "solid",
          color: "danger",
        });
      }
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      refetch();
    }
    
    if (draft) {
      setForm({
        activiteDescription: draft.activiteDescription ?? "",
        dateActivite:
          draft.dateActivite && draft.dateActivite !== ""
            ? (() => {
                const date = new Date(draft.dateActivite);
                if (!isNaN(date.getTime())) {
                  return new CalendarDate(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate()
                  );
                }
                return undefined;
              })()
            : undefined,
        dureeHeures: draft.dureeHeures ?? undefined,
        contexte: draft.contexte ?? "",
        nombreJeunes: draft.nombreJeunes ? String(draft.nombreJeunes) : "",
        trancheAge: draft.trancheAge ?? "",
        niveau: draft.niveau ?? "",
        objectifsAtteints: draft.objectifsAtteints ?? "",
      });
      setStatut(draft.statut ?? "BROUILLON");
    } else {
      setForm(initialFormState);
      setStatut("BROUILLON");
    }
    setUploadedFiles([]);
    setActiveTab("justification");
  }, [isOpen, competence.code, draft]);

  const formatFormData = () => {
    return {
      activiteDescription: form.activiteDescription,
      dateActivite: form.dateActivite ? form.dateActivite.toString() : "",
      dureeHeures: form.dureeHeures,
      contexte: form.contexte,
      nombreJeunes: form.nombreJeunes, // <-- garde la valeur brute !
      trancheAge: form.trancheAge,
      niveau: form.niveau,
      objectifsAtteints: form.objectifsAtteints,
      chefId,
      objectifId,
      badgeId: badge.id,
    };
  };

  const handleSave = async () => {
    const formattedData = formatFormData();
    await saveJustification(formattedData);
    setStatut("BROUILLON");
  };

  const handleSubmit = async () => {
    try {
      const formattedData = formatFormData();
      await submitJustification(formattedData);
      setStatut("SOUMISE");

      addToast({
        title: "Justification soumise",
        description: `Justification pour la compétence ${competence.code} du badge ${badge.name} soumise avec succès`,
        variant: "solid",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Erreur de soumission",
        description: "Impossible de soumettre la justification",
        variant: "solid",
        color: "danger",
      });
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectionChange = (field: string, keys: Selection) => {
    const selectedKey = Array.from(keys)[0] as string;
    handleFieldChange(field, selectedKey || "");
  };

  // ...existing code pour les définitions des onglets et options...
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
    { key: "11-15", label: "11-15 ans" },
    { key: "15-17", label: "15-17 ans" },
  ];

  const niveau = [
    { key: "Débutant", label: "Débutant" },
    { key: "Intermédiaire", label: "Intermédiaire" },
    { key: "Avancé", label: "Avancé" },
  ];

  // ...existing code pour handleFileUpload, removeFile, getFileIcon...
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Gallery size={20} color="#6366f1" />;
    } else if (file.type === "application/pdf") {
      return <DocumentText size={20} color="#dc2626" />;
    }
    return <DocumentText size={20} color="#6b7280" />;
  };

  function renderTabContent() {
    switch (activeTab) {
      case "justification":
        return (
          <div>
            <div className="mb-9">
              {competence.type === "REALISATION"
                ? "Justification de la réalisation"
                : "Justification de la compétence"}
            </div>

            <div className="flex flex-col gap-7">
              <section>
                <h3 className="font-medium text-base mb-4">Quoi&nbsp;?</h3>
                <CustomTextarea
                  theme="default"
                  label="Description"
                  labelPlacement="inside"
                  placeholder="Entrez la justification ici..."
                  description={
                    competence.type === "REALISATION"
                      ? "💡 Exemple : Création d'un projet nature avec recyclage"
                      : "💡 Exemple : Atelier nœuds de 2h avec jeux et défis"
                  }
                  minRows={3}
                  maxRows={10}
                  value={form.activiteDescription}
                  onValueChange={(value) =>
                    handleFieldChange("activiteDescription", value)
                  }
                />
              </section>

              <section>
                <h3 className="font-medium text-base mb-4">Quand&nbsp;?</h3>
                <div className="flex flex-col gap-4">
                  <CustomDatePicker
                    theme="default"
                    labelPlacement="inside"
                    label="Date de l'activité"
                    showMonthAndYearPickers
                    value={form.dateActivite}
                    onChange={(date) => handleFieldChange("dateActivite", date)}
                  />
                  <CustomTextarea
                    theme="default"
                    label="Contexte"
                    labelPlacement="inside"
                    placeholder="Entrez le contexte ici..."
                    description="💡 Exemple : Camp rallye 2025"
                    minRows={3}
                    maxRows={10}
                    value={form.contexte}
                    onValueChange={(value) =>
                      handleFieldChange("contexte", value)
                    }
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
                      selectedKeys={
                        form.nombreJeunes
                          ? new Set([form.nombreJeunes])
                          : new Set()
                      }
                      onSelectionChange={(keys) =>
                        handleSelectionChange("nombreJeunes", keys)
                      }
                    />
                    <CustomSelect
                      theme="default"
                      label="Tranche d'âge"
                      labelPlacement="inside"
                      placeholder="Sélectionnez une tranche"
                      options={Tranche}
                      selectedKeys={
                        form.trancheAge ? new Set([form.trancheAge]) : new Set()
                      }
                      onSelectionChange={(keys) =>
                        handleSelectionChange("trancheAge", keys)
                      }
                    />
                    <CustomSelect
                      theme="default"
                      label="Niveau"
                      labelPlacement="inside"
                      placeholder="Sélectionnez un niveau"
                      options={niveau}
                      selectedKeys={
                        form.niveau ? new Set([form.niveau]) : new Set()
                      }
                      onSelectionChange={(keys) =>
                        handleSelectionChange("niveau", keys)
                      }
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
                  value={form.objectifsAtteints}
                  onValueChange={(value) =>
                    handleFieldChange("objectifsAtteints", value)
                  }
                />
              </section>

              {/* Section d'upload pour les réalisations */}
              {(competence.type === "REALISATION" ||
                competence.fichiersRequis) && (
                <section>
                  <h3 className="font-medium text-base mb-4">
                    Fichiers justificatifs
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Gallery
                        size={48}
                        color="#9ca3af"
                        className="mx-auto mb-4"
                      />
                      <div className="mb-4">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium"
                        >
                          Choisir des fichiers
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Glissez-déposez vos fichiers ici ou cliquez pour
                        sélectionner
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Formats acceptés : Images (JPG, PNG), PDF, Documents
                        Word
                      </p>
                    </div>
                  </div>

                  {/* Liste des fichiers uploadés */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-3">
                        Fichiers sélectionnés :
                      </h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getFileIcon(file)}
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isSubmitting || statut === "SOUMISE"}
                >
                  {isSubmitting ? "Soumission..." : "Soumettre"}
                </button>
              </div>
            </div>
          </div>
        );
      // ...existing code pour les autres tabs...
      case "commentaire":
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow p-6">
              {/* Message principal */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  A
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
                  defaultSelected={!!form.activiteDescription}
                  disabled
                  className="text-white"
                >
                  Justification rédigée
                </CustomCheckbox>
                {competence.type === "REALISATION" && (
                  <CustomCheckbox
                    theme="modal"
                    className="text-white"
                    defaultSelected={uploadedFiles.length > 0}
                    disabled
                  >
                    Fichiers joints
                  </CustomCheckbox>
                )}
                <CustomCheckbox
                  theme="modal"
                  defaultSelected={statut === "SOUMISE"}
                  disabled
                  className="text-white"
                >
                  Soumission effectuée
                </CustomCheckbox>
                <CustomCheckbox
                  theme="modal"
                  disabled
                  defaultSelected={false}
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
    <>
      <SubmitConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={async () => {
          const formattedData = formatFormData();
          try {
            if (draft && draft.id) {
              await fetch("/api/justification", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...formattedData,
                  id: draft.id,
                  statut: "SOUMISE",
                }),
              });
            } else {
              await submitJustification(formattedData);
            }
            setStatut("SOUMISE");
            addToast({
              title: "Justification soumise",
              description: `Justification pour la compétence ${competence.code} du badge ${badge.name} soumise avec succès`,
              variant: "solid",
              color: "success",
            });
            setIsConfirmOpen(false);
          } catch (error) {
            addToast({
              title: "Erreur de soumission",
              description: "Impossible de soumettre la justification",
              variant: "solid",
              color: "danger",
            });
          }
        }}
      />
      <Modal isOpen={isOpen} onOpenChange={handleModalClose} size="5xl">
        <ModalContent>
          <ModalBody className="p-0">
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
                        onClick={() =>
                          setActiveTab(tab.key as typeof activeTab)
                        }
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
