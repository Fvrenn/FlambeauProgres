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
  User,
  Chip,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { approveJustification, rejectJustification } from "@/app/actions/justification-actions";
import type { JustificationAvecRelations } from "./JustificationsTableColumns";

type JustificationModalProps = {
  justification: JustificationAvecRelations;
  isOpen: boolean;
  onClose: () => void;
};

export default function JustificationModal({
  justification,
  isOpen,
  onClose,
}: JustificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [motifRefus, setMotifRefus] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveJustification(justification.id);
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Une erreur est survenue");
    }
  };

  const handleReject = async () => {
    if (!motifRefus.trim()) {
      alert("Veuillez saisir un motif de refus");
      return;
    }

    setIsLoading(true);
    const result = await rejectJustification(justification.id, motifRefus);
    setIsLoading(false);

    if (result.success) {
      onClose();
      setShowRejectForm(false);
      setMotifRefus("");
    } else {
      alert(result.error || "Une erreur est survenue");
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Détails de la justification</h3>
            <Chip color="warning" variant="flat">
              En attente
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody>
          {/* Informations du Chef */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-default-500 mb-2">Soumis par</p>
              <User
                avatarProps={{
                  src: justification.chef.image || undefined,
                  name: justification.chef.name.charAt(0).toUpperCase(),
                }}
                name={justification.chef.name}
                description={justification.chef.email}
              />
            </div>

            {/* Objectif concerné */}
            <div>
              <p className="text-sm text-default-500 mb-2">Objectif</p>
              <div className="rounded-lg bg-default-100 p-3">
                <p className="font-semibold text-sm">{justification.objectif.code}</p>
                <p className="text-sm text-default-600 mt-1">
                  {justification.objectif.description}
                </p>
              </div>
            </div>

            {/* Date de soumission */}
            {justification.soumiseAt && (
              <div>
                <p className="text-sm text-default-500 mb-2">Date de soumission</p>
                <p className="text-sm">
                  {new Date(justification.soumiseAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {/* Contenu de la justification */}
            <div>
              <p className="text-sm text-default-500 mb-2">Description</p>
              <div className="rounded-lg bg-default-100 p-3">
                <p className="text-sm whitespace-pre-wrap">
                  {justification.contenu || "Aucune description fournie"}
                </p>
              </div>
            </div>

            {/* Fichier attaché (si présent) */}
            {justification.objectif.fichiersRequis && (
              <div>
                <p className="text-sm text-default-500 mb-2">Fichier joint</p>
                <div className="rounded-lg border-2 border-dashed border-default-300 p-4 flex items-center gap-3">
                  <Icon icon="solar:document-linear" className="text-2xl text-default-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">document.pdf</p>
                    <p className="text-xs text-default-400">Cliquez pour télécharger</p>
                  </div>
                  <Button
                    as={Link}
                    href="#"
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <Icon icon="solar:download-linear" className="text-xl" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de refus (conditionnel) */}
          {showRejectForm && (
            <div className="mt-4">
              <Textarea
                label="Motif du refus"
                placeholder="Expliquez pourquoi vous refusez cette justification..."
                value={motifRefus}
                onValueChange={setMotifRefus}
                minRows={3}
                isRequired
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {!showRejectForm ? (
            <>
              <Button variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setShowRejectForm(true)}
                isDisabled={isLoading}
              >
                Refuser
              </Button>
              <Button
                color="success"
                onPress={handleApprove}
                isLoading={isLoading}
                startContent={<Icon icon="solar:check-circle-linear" />}
              >
                Valider
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="light"
                onPress={() => {
                  setShowRejectForm(false);
                  setMotifRefus("");
                }}
                isDisabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                color="danger"
                onPress={handleReject}
                isLoading={isLoading}
              >
                Confirmer le refus
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}