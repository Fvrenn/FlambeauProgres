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
import { ObjectifAvecJustification } from "../../DashboardClient";
import { submitCompetence } from "../../../_actions/competence-actions";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Réinitialiser le contenu quand on ouvre la modal avec un nouvel objectif
  React.useEffect(() => {
    if (isOpen && objectif) {
      // Si une justification existe déjà, pré-remplir le champ
      const existingJustification = objectif.justifications[0];
      setContenu(existingJustification?.contenu || "");
    }
  }, [isOpen, objectif]);

  const handleSubmit = async () => {
    if (!objectif || !contenu.trim()) return;

    setIsSubmitting(true);
    
    // Mise à jour optimiste immédiate de l'UI
    onUpdateJustification(objectif.id, {
      contenu,
      statut: "AUTO_VALIDEE",
      valideeAt: new Date(),
    });

    try {
      const result = await submitCompetence(objectif.id, contenu);

      if (result.success) {
        // Fermer la modal
        onOpenChange();
        // Rafraîchir la page en arrière-plan pour synchroniser avec le serveur
        router.refresh();
        // Réinitialiser le contenu
        setContenu("");
      } else {
        // En cas d'erreur, on pourrait rollback la mise à jour optimiste
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
      scrollBehavior="inside"
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
                <p className="text-sm text-default-600">
                  Les réalisations nécessitent un upload de fichier 
                  (fonctionnalité à venir - Étape 9).
                </p>
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
