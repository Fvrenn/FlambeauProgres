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
  cn,
} from "@heroui/react";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { Justification } from "@prisma/client";

import { ObjectifAvecJustification } from "../../DashboardClient";

import { Icon } from "@/lib/icons";
import { REGLES_JUSTIFICATION } from "@/lib/fichiers";
import { LONGUEUR_MAX_CONTENU } from "@/lib/justification";
import { FileDropzone } from "@/components/ui";
import DiscussionThread, {
  type DiscussionViewer,
} from "@/components/discussion/DiscussionThread";
import { submitCompetence } from "@/actions/dashboard/competence.actions";
import { submitRealisation } from "@/actions/dashboard/realisation.actions";
import { competenceSoumiseAEvaluation, estNiveauEtape3 } from "@/lib/roles";

interface ObjectifModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  objectif: ObjectifAvecJustification | null;
  niveauEtape: number;
  viewer: DiscussionViewer;
  onUpdateJustification: (
    objectifId: string,
    justification: Partial<Justification>,
  ) => void;
}

export default function ObjectifModal({
  isOpen,
  onOpenChange,
  objectif,
  niveauEtape,
  viewer,
  onUpdateJustification,
}: ObjectifModalProps) {
  const router = useRouter();
  const [contenu, setContenu] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && objectif) {
      const existingJustification = objectif.justifications[0];

      setContenu(existingJustification?.contenu || "");
      setSelectedFile(null);
      setErreur(null);
    }
  }, [isOpen, objectif]);

  const handleSubmit = async () => {
    if (!objectif) return;
    if (objectif.texteRequis && !contenu.trim()) return;

    const isCompetence = objectif.type === "COMPETENCE";
    const isRealisation = objectif.type === "REALISATION";
    const estAutoValidee =
      isCompetence && !competenceSoumiseAEvaluation(niveauEtape);

    if (isRealisation && !selectedFile) {
      setErreur("Ajoute un fichier de preuve pour ta réalisation");

      return;
    }

    setErreur(null);
    setIsSubmitting(true);

    onUpdateJustification(objectif.id, {
      contenu,
      statut: estAutoValidee ? "AUTO_VALIDEE" : "SOUMISE",
      valideeAt: estAutoValidee ? new Date() : null,
      soumiseAt: estAutoValidee ? null : new Date(),
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
      } else {
        const previousJustification = objectif.justifications[0];

        if (previousJustification) {
          onUpdateJustification(objectif.id, previousJustification);
        }

        router.refresh();

        setErreur(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setErreur("Une erreur est survenue lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!objectif) return null;

  const isCompetence = objectif.type === "COMPETENCE";
  const competenceAEvaluer =
    isCompetence && competenceSoumiseAEvaluation(niveauEtape);
  const destinataire = estNiveauEtape3(niveauEtape)
    ? "à la commission"
    : "au référent";
  const textRequired = objectif.texteRequis || competenceAEvaluer;
  const existingJustification = objectif.justifications[0];
  const isEditing = !!existingJustification;
  const showThread =
    (!isCompetence || competenceAEvaluer) &&
    !!existingJustification &&
    existingJustification.statut !== "BROUILLON" &&
    !existingJustification.id.startsWith("temp-");

  return (
    <Modal
      classNames={{ closeButton: "top-4 end-4" }}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className={cn("bg-dashboard", showThread && "h-[80vh]")}>
        {(onClose) =>
          showThread ? (
            <ModalBody className="overflow-hidden p-0">
              <DiscussionThread
                justificationId={existingJustification.id}
                objectif={{
                  code: objectif.code,
                  description: objectif.description,
                  type: objectif.type,
                }}
                peutValider={false}
                viewer={viewer}
              />
            </ModalBody>
          ) : (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-foreground border border-dashboard-border rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    {objectif.code}
                  </span>
                  <span className="text-[17px]">{objectif.description}</span>
                </div>
              </ModalHeader>

              <Divider className="bg-dashboard-border" />

              <ModalBody>
                {isCompetence ? (
                  <>
                    <p className="text-sm text-default-600 mb-4">
                      Décris comment tu as acquis ou démontré cette compétence.{" "}
                      {competenceAEvaluer
                        ? "Elle sera évaluée par la commission Formation."
                        : "Ta justification sera automatiquement validée."}
                    </p>

                    <Textarea
                      classNames={{
                        inputWrapper:
                          "bg-dashboard-panel data-[hover=true]:bg-dashboard-panel-hover",
                      }}
                      description={`${contenu.length} caractères`}
                      isRequired={textRequired}
                      label={
                        textRequired
                          ? "Ta justification"
                          : "Ta justification (optionnel)"
                      }
                      maxLength={LONGUEUR_MAX_CONTENU}
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
                      document). Ta soumission sera envoyée {destinataire} pour
                      validation.
                    </p>

                    <Textarea
                      className="mb-4"
                      classNames={{
                        inputWrapper:
                          "bg-dashboard-panel data-[hover=true]:bg-dashboard-panel-hover",
                      }}
                      description={`${contenu.length} caractères`}
                      isRequired={textRequired}
                      label={
                        textRequired
                          ? "Description de ta réalisation"
                          : "Description de ta réalisation (optionnel)"
                      }
                      maxLength={LONGUEUR_MAX_CONTENU}
                      maxRows={8}
                      minRows={4}
                      placeholder="Explique ce que tu as réalisé, comment et avec qui..."
                      value={contenu}
                      onValueChange={setContenu}
                    />

                    <FileDropzone
                      aide="Images, PDF, ou documents Word acceptés"
                      fichier={selectedFile}
                      label="Fichier de preuve *"
                      regles={REGLES_JUSTIFICATION}
                      onChange={setSelectedFile}
                    />
                  </>
                )}
                {erreur && (
                  <p className="text-sm text-danger" role="alert">
                    {erreur}
                  </p>
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
                    className="bg-nav-active text-white data-[hover=true]:bg-nav-hover"
                    isDisabled={
                      (textRequired && !contenu.trim()) || isSubmitting
                    }
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  >
                    {competenceAEvaluer
                      ? "Soumettre à la commission"
                      : isEditing
                        ? "Mettre à jour"
                        : "Valider la compétence"}
                  </Button>
                )}

                {!isCompetence && (
                  <Button
                    className="bg-nav-active text-white data-[hover=true]:bg-nav-hover"
                    isDisabled={
                      (textRequired && !contenu.trim()) ||
                      !selectedFile ||
                      isSubmitting
                    }
                    isLoading={isSubmitting}
                    startContent={
                      !isSubmitting && (
                        <Icon icon="solar:plain-linear" width={20} />
                      )
                    }
                    onPress={handleSubmit}
                  >
                    {isEditing ? "Resoumettre" : "Soumettre"} {destinataire}
                  </Button>
                )}
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
}
