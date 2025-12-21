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
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ObjectifAvecJustification } from "../../DashboardClient";
import { submitCompetence } from "@/actions/dashboard/competence.actions";
import { submitRealisation } from "@/actions/dashboard/realisation.actions";
import { useRouter } from "next/navigation";
import { Justification } from "@prisma/client";

interface ObjectifModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  objectif: ObjectifAvecJustification | null;
  onUpdateJustification: (objectifId: string, justification: Partial<Justification>) => void;
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
        result = await submitRealisation(objectif.id, contenu, selectedFile || undefined);
      }

      if (result.success) {
        // Fermer la modal
        onOpenChange();
        
        router.refresh();
        
        setContenu("");
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        
        // Pour l'instant, on affiche juste l'erreur
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
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="outside"
      placement="center"
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
                    Décris comment tu as acquis ou démontré cette compétence.
                    Ta justification sera automatiquement validée.
                  </p>

                  <Textarea
                    label="Ta justification"
                    placeholder="Explique comment tu as travaillé cette compétence..."
                    value={contenu}
                    onValueChange={setContenu}
                    minRows={6}
                    maxRows={12}
                    isRequired
                    description={`${contenu.length} caractères`}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-default-600 mb-4">
                    Décris ta réalisation et ajoute une preuve (photo, PDF, document).
                    Ta soumission sera envoyée au référent pour validation.
                  </p>

                  <Textarea
                    label="Description de ta réalisation"
                    placeholder="Explique ce que tu as réalisé, comment et avec qui..."
                    value={contenu}
                    onValueChange={setContenu}
                    minRows={4}
                    maxRows={8}
                    isRequired
                    description={`${contenu.length} caractères`}
                    className="mb-4"
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fichier de preuve *
                      </label>

                      {!selectedFile ? (
                        <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*,.pdf,.doc,.docx"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Icon
                              icon="solar:cloud-upload-linear"
                              width={48}
                              className="text-default-400"
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
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon icon="solar:gallery-linear" width={20} />
                                  <span className="text-sm font-medium truncate max-w-[200px]">
                                    {selectedFile.name}
                                  </span>
                                  <span className="text-xs text-default-400">
                                    ({(selectedFile.size / 1024).toFixed(1)} Ko)
                                  </span>
                                </div>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  color="danger"
                                  variant="flat"
                                  onPress={handleRemoveFile}
                                >
                                  <Icon icon="solar:trash-bin-minimalistic-linear" width={18} />
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
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={handleRemoveFile}
                              >
                                <Icon icon="solar:trash-bin-minimalistic-linear" width={18} />
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
                variant="light"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Annuler
              </Button>

              {isCompetence && (
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!contenu.trim() || isSubmitting}
                >
                  {isEditing ? "Mettre à jour" : "Valider la compétence"}
                </Button>
              )}

              {!isCompetence && (
                <Button
                  color="warning"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!contenu.trim() || !selectedFile || isSubmitting}
                  startContent={!isSubmitting && <Icon icon="solar:send-linear" width={20} />}
                >
                  {isEditing ? "Resoummettre au référent" : "Soumettre au référent"}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
