"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Justification } from "@prisma/client";

import { ObjectifAvecJustification } from "../../DashboardClient";

import { submitCompetence } from "@/actions/dashboard/competence.actions";
import { submitRealisation } from "@/actions/dashboard/realisation.actions";

interface ObjectifModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  objectif: ObjectifAvecJustification | null;
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
}

export default function ObjectifModal({
  isOpen,
  onOpenChange,
  objectif,
  onUpdateJustification,
}: ObjectifModalProps) {
  const router = useRouter();
  const [contenu, setContenu] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && objectif) {
      const existingJustification = objectif.justifications[0];

      setContenu(existingJustification?.contenu || "");

      setSelectedFile(null);
      setFilePreview(null);
    }
  }, [isOpen, objectif]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async () => {
    if (!objectif || !contenu.trim()) return;

    const isCompetence = objectif.type === "COMPETENCE";
    const isRealisation = objectif.type === "REALISATION";

    if (isRealisation && !selectedFile) {
      alert("Veuillez sélectionner un fichier pour votre réalisation");

      return;
    }

    setIsSubmitting(true);

    onUpdateJustification(objectif.id, {
      contenu,
      statut: isCompetence ? "AUTO_VALIDEE" : "SOUMISE",
      valideeAt: isCompetence ? new Date() : null,
      soumiseAt: isRealisation ? new Date() : null,
    });

    try {
      let result;

      if (isCompetence) {
        result = await submitCompetence(objectif.id, contenu);
      } else {
        result = await submitRealisation(
          objectif.id,
          contenu,
          selectedFile || undefined,
        );
      }

      if (result.success) {
        onOpenChange();

        router.refresh();

        setContenu("");
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur est survenue lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!objectif) return null;

  const isCompetence = objectif.type === "COMPETENCE";
  const existingJustification = objectif.justifications[0];
  const isEditing = !!existingJustification;

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      scrollBehavior="outside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold border border-default-800 py-2 px-3 rounded-full">
                  {objectif.code}
                </span>
                <span className="text-lg">{objectif.description}</span>
              </div>
            </ModalHeader>

            <ModalBody>
              {isCompetence ? (
                <>
                  <p className="text-sm text-default-600 mb-4">
                    Décris comment tu as acquis ou démontré cette compétence. Ta
                    justification sera automatiquement validée.
                  </p>

                  <Textarea
                    isRequired
                    description={`${contenu.length} caractères`}
                    label="Ta justification"
                    maxRows={12}
                    minRows={6}
                    placeholder="Explique comment tu as travaillé cette compétence..."
                    value={contenu}
                    onValueChange={setContenu}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-default-600 mb-4">
                    Décris ta réalisation et ajoute une preuve (photo, PDF,
                    document). Ta soumission sera envoyée au référent pour
                    validation.
                  </p>

                  <Textarea
                    isRequired
                    className="mb-4"
                    description={`${contenu.length} caractères`}
                    label="Description de ta réalisation"
                    maxRows={8}
                    minRows={4}
                    placeholder="Explique ce que tu as réalisé, comment et avec qui..."
                    value={contenu}
                    onValueChange={setContenu}
                  />

                  <div className="space-y-4">
                    <div>
                      <p className="block text-sm font-medium mb-2">
                        Fichier de preuve *
                      </p>

                      {!selectedFile ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <input
                            accept="image/*,.pdf,.doc,.docx"
                            className="hidden"
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                          />
                          <label
                            className="cursor-pointer flex flex-col items-center gap-2"
                            htmlFor="file-upload"
                          >
                            <Icon
                              className="text-default-400"
                              icon="solar:cloud-upload-linear"
                              width={48}
                            />
                            <p className="text-sm text-default-600">
                              Clique pour sélectionner un fichier
                            </p>
                            <p className="text-xs text-default-400">
                              Images, PDF, ou documents Word acceptés
                            </p>
                          </label>
                        </div>
                      ) : (
                        <div className="border border-default-300 rounded-lg p-4">
                          {filePreview ? (
                            <div className="space-y-3">
                              {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (data/blob URL) : non optimisable par next/image */}
                              <img
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                                src={filePreview}
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon
                                    icon="solar:gallery-linear"
                                    width={20}
                                  />
                                  <span className="text-sm font-medium truncate max-w-[200px]">
                                    {selectedFile.name}
                                  </span>
                                  <span className="text-xs text-default-400">
                                    ({(selectedFile.size / 1024).toFixed(1)} Ko)
                                  </span>
                                </div>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  variant="flat"
                                  onPress={handleRemoveFile}
                                >
                                  <Icon
                                    icon="solar:trash-bin-minimalistic-linear"
                                    width={18}
                                  />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon icon="solar:document-linear" width={24} />
                                <div>
                                  <p className="text-sm font-medium truncate max-w-[250px]">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-xs text-default-400">
                                    {(selectedFile.size / 1024).toFixed(1)} Ko
                                  </p>
                                </div>
                              </div>
                              <Button
                                isIconOnly
                                color="danger"
                                size="sm"
                                variant="flat"
                                onPress={handleRemoveFile}
                              >
                                <Icon
                                  icon="solar:trash-bin-minimalistic-linear"
                                  width={18}
                                />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isSubmitting}
                variant="light"
                onPress={onClose}
              >
                Annuler
              </Button>

              {isCompetence && (
                <Button
                  color="primary"
                  isDisabled={!contenu.trim() || isSubmitting}
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                >
                  {isEditing ? "Mettre à jour" : "Valider la compétence"}
                </Button>
              )}

              {!isCompetence && (
                <Button
                  color="warning"
                  isDisabled={!contenu.trim() || !selectedFile || isSubmitting}
                  isLoading={isSubmitting}
                  startContent={
                    !isSubmitting && (
                      <Icon icon="solar:send-linear" width={20} />
                    )
                  }
                  onPress={handleSubmit}
                >
                  {isEditing
                    ? "Resoummettre au référent"
                    : "Soumettre au référent"}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
