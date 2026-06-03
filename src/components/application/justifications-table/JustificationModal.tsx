"use client";

import type { JustificationAvecRelations } from "./JustificationsTableColumns";

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

import {
  approveJustification,
  rejectJustification,
} from "@/actions/justification/justification.actions";

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
    <Modal isOpen={isOpen} scrollBehavior="inside" size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Détails de la justification
            </h3>
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
                description={justification.chef.email}
                name={justification.chef.name}
              />
            </div>

            {/* Objectif concerné */}
            <div>
              <p className="text-sm text-default-500 mb-2">Objectif</p>
              <div className="rounded-lg bg-default-100 p-3">
                <p className="font-semibold text-sm">
                  {justification.objectif.code}
                </p>
                <p className="text-sm text-default-600 mt-1">
                  {justification.objectif.description}
                </p>
              </div>
            </div>

            {/* Date de soumission */}
            {justification.soumiseAt && (
              <div>
                <p className="text-sm text-default-500 mb-2">
                  Date de soumission
                </p>
                <p className="text-sm">
                  {new Date(justification.soumiseAt).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
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
                  <Icon
                    className="text-2xl text-default-400"
                    icon="solar:document-linear"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">document.pdf</p>
                    <p className="text-xs text-default-400">
                      Cliquez pour télécharger
                    </p>
                  </div>
                  <Button
                    isIconOnly
                    as={Link}
                    href="#"
                    size="sm"
                    variant="light"
                  >
                    <Icon className="text-xl" icon="solar:download-linear" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de refus (conditionnel) */}
          {showRejectForm && (
            <div className="mt-4">
              <Textarea
                isRequired
                label="Motif du refus"
                minRows={3}
                placeholder="Expliquez pourquoi vous refusez cette justification..."
                value={motifRefus}
                onValueChange={setMotifRefus}
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
                isDisabled={isLoading}
                variant="flat"
                onPress={() => setShowRejectForm(true)}
              >
                Refuser
              </Button>
              <Button
                color="success"
                isLoading={isLoading}
                startContent={<Icon icon="solar:check-circle-linear" />}
                onPress={handleApprove}
              >
                Valider
              </Button>
            </>
          ) : (
            <>
              <Button
                isDisabled={isLoading}
                variant="light"
                onPress={() => {
                  setShowRejectForm(false);
                  setMotifRefus("");
                }}
              >
                Annuler
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={handleReject}
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
