"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
  User,
  Textarea,
  Divider,
  Chip,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useTransition, useOptimistic } from "react";
import { useSession } from "@/src/lib/auth-client";
import MessageCard from "@/components/application/referent/_components/MessageCard";
import { approveJustification, requestChanges } from "@/app/actions/justification-actions";
import { markNotificationsAsReadForJustification } from "@/app/actions/notification-actions";
import { Justification, Commentaire, User as UserType, Objectif } from "@prisma/client";

type JustificationAvecRelations = Justification & {
  chef: UserType;
  objectif: Objectif;
  commentaires: (Commentaire & {
    auteur: UserType;
  })[];
  fichiers?: Array<{ id: string; nom: string; type: string; url: string }>;
};

interface ReferentValidationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  justification: JustificationAvecRelations | null;
  defaultTab: "justification" | "discussion";
}

export default function ReferentValidationModal({
  isOpen,
  onOpenChange,
  justification,
  defaultTab,
}: ReferentValidationModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [isPending, startTransition] = useTransition();

  // État pour les formulaires
  const [motif, setMotif] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"justification" | "discussion">(defaultTab);

  // État pour les commentaires (initial + recharges)
  const [localCommentaires, setLocalCommentaires] = useState(justification?.commentaires || []);

  // État optimiste pour les commentaires
  const [optimisticCommentaires, addOptimisticCommentaire] = useOptimistic(
    localCommentaires,
    (state: any[], newCommentaire: any) => [...state, newCommentaire]
  );

  // Fonction pour recharger les commentaires depuis le serveur
  const reloadCommentaires = async () => {
    if (!justification?.id) return;
    try {
      console.log("📍 [reloadCommentaires] Récupération des commentaires depuis l'API");
      const response = await fetch(`/api/justifications/${justification.id}/comments`);
      if (!response.ok) {
        console.error("❌ [reloadCommentaires] Erreur API:", response.status);
        return;
      }
      const data = await response.json();
      console.log("✅ [reloadCommentaires] Commentaires reçus:", data.commentaires?.length);
      setLocalCommentaires(data.commentaires || []);
    } catch (error) {
      console.error("❌ [reloadCommentaires] Exception:", error);
    }
  };

  // Synchroniser localCommentaires quand la justification change
  useEffect(() => {
    if (justification?.commentaires) {
      console.log("📍 [useEffect] Justification changée, synchronisation des commentaires");
      setLocalCommentaires(justification.commentaires);
    }
  }, [justification?.id, justification?.commentaires]);

  // Marquer comme lu quand la modale s'ouvre sur l'onglet Discussion
  useEffect(() => {
    if (isOpen && defaultTab === "discussion" && justification) {
      startTransition(async () => {
        const result = await markNotificationsAsReadForJustification(
          justification.id
        );
        if (result.success) {
          console.log("✅ Notifications marquées comme lues");
        }
      });
    }
    setSelectedTab(defaultTab);
  }, [isOpen, defaultTab, justification]);

  const handleApprove = async () => {
    if (!justification) return;

    setIsSubmitting(true);
    startTransition(async () => {
      const result = await approveJustification(justification.id);
      setIsSubmitting(false);

      if (result.success) {
        console.log("✅ Justification validée");
        onOpenChange();
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleRequestChanges = async () => {
    console.log("📍 [handleRequestChanges] Début - Justification:", justification?.id);
    console.log("📍 [handleRequestChanges] Motif saisi:", motif);
    console.log("📍 [handleRequestChanges] currentUserId:", currentUserId);
    console.log("📍 [handleRequestChanges] session:", session?.user);

    if (!justification || !motif.trim()) {
      console.log("❌ [handleRequestChanges] Validation échouée - Justification ou motif vide");
      alert("Veuillez saisir un motif");
      return;
    }

    if (!currentUserId || !session?.user) {
      console.log("❌ [handleRequestChanges] Erreur utilisateur non identifié");
      alert("Erreur : utilisateur non identifié");
      return;
    }

    // Sauvegarder le texte avant de le vider
    const textToSend = motif;
    console.log("📍 [handleRequestChanges] textToSend préparé:", textToSend);

    // Créer le commentaire optimiste
    const optimisticComment: Commentaire & { auteur: UserType; isPending?: boolean } = {
      id: `temp-${Date.now()}`,
      justificationId: justification.id,
      auteurId: currentUserId,
      contenu: textToSend,
      type: "REFERENT_QUESTION",
      createdAt: new Date(),
      auteur: {
        id: currentUserId,
        name: session.user.name || "Référent",
        email: session.user.email || "",
        image: session.user.image || null,
        emailVerified: null,
        role: "REFERENT",
        troupeId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isPending: true,
    };

    console.log("📍 [handleRequestChanges] optimisticComment créé:", optimisticComment);
    console.log("📍 [handleRequestChanges] État optimistique avant startTransition:");
    console.log("   - optimisticCommentaires actuels:", optimisticCommentaires);
    console.log("   - isPending:", isPending);

    setIsSubmitting(true);
    console.log("📍 [handleRequestChanges] setIsSubmitting(true) appelé");

    startTransition(async () => {
      console.log("🚀 [startTransition] DÉBUT - Inside transition");

      // Ajouter optimistiquement le commentaire DANS startTransition
      console.log("📍 [startTransition] Appel addOptimisticCommentaire");
      addOptimisticCommentaire(optimisticComment);
      console.log("✅ [startTransition] addOptimisticCommentaire exécuté");

      console.log("📍 [startTransition] Appel setMotif('')");
      setMotif(""); // Réinitialiser le formulaire immédiatement
      console.log("✅ [startTransition] setMotif exécuté");

      try {
        console.log("📍 [startTransition] Appel requestChanges avec:", {
          justificationId: justification.id,
          textToSend,
        });

        const result = await requestChanges(justification.id, textToSend);
        console.log("📍 [startTransition] Réponse requestChanges:", result);

        setIsSubmitting(false);
        console.log("📍 [startTransition] setIsSubmitting(false) appelé");

        if (!result.success) {
          console.log("❌ [startTransition] Erreur résultat:", result.error);
          alert(result.error || "Une erreur est survenue");
          return;
        }

        console.log("✅ [startTransition] Demande de précisions envoyée avec succès");
        console.log("📍 [startTransition] Appel router.refresh()");
        router.refresh(); // Refresh pour synchroniser avec le serveur
        console.log("✅ [startTransition] router.refresh() appelé");
        
        // Recharger les commentaires depuis le serveur après un court délai
        // (pour s'assurer que le serveur a fini de traiter)
        console.log("📍 [startTransition] Attente avant reloadCommentaires");
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("📍 [startTransition] Appel reloadCommentaires()");
        await reloadCommentaires();
        console.log("✅ [startTransition] reloadCommentaires() exécuté");
      } catch (err) {
        console.error("❌ [startTransition] Exception attrapée:", err);
        alert("Erreur lors de l'envoi du message");
        // En cas d'erreur, on remet le texte
        console.log("📍 [startTransition] Restauration du motif après erreur:", textToSend);
        setMotif(textToSend);
        setIsSubmitting(false);
      }

      console.log("🏁 [startTransition] FIN - Exit transition");
    });

    console.log("📍 [handleRequestChanges] FIN - startTransition lancée");
  };

  if (!justification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <User
              avatarProps={{
                src: justification.chef.image || undefined,
                name: justification.chef.name.charAt(0).toUpperCase(),
              }}
              name={justification.chef.name}
              description={justification.chef.email}
            />
            <div>
              <p className="text-sm text-default-500">
                [{justification.objectif.code}]
              </p>
              <p className="font-medium">{justification.objectif.description}</p>
            </div>
          </div>
        </ModalHeader>

        <Divider />

        <ModalBody className="gap-4">
          <Tabs
            aria-label="Validation tabs"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as "justification" | "discussion")}
            className="w-full"
          >
            {/* Onglet 1 : Justification & Fichiers */}
            <Tab
              key="justification"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:document-linear" />
                  Justification
                </div>
              }
            >
              <div className="space-y-4 py-4">
                {/* Chef info */}
                <Card className="bg-default-50">
                  <CardBody className="gap-3">
                    <p className="text-sm font-semibold">Soumis par</p>
                    <User
                      avatarProps={{
                        src: justification.chef.image || undefined,
                        name: justification.chef.name.charAt(0).toUpperCase(),
                      }}
                      name={justification.chef.name}
                      description={justification.chef.email}
                    />
                    <p className="text-xs text-default-500">
                      Soumis le{" "}
                      {justification.soumiseAt
                        ? new Date(justification.soumiseAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : "N/A"}
                    </p>
                  </CardBody>
                </Card>

                {/* Contenu de la justification */}
                <Card>
                  <CardBody className="gap-2">
                    <p className="text-sm font-semibold">Contenu</p>
                    <p className="text-sm whitespace-pre-wrap text-default-700">
                      {justification.contenu}
                    </p>
                  </CardBody>
                </Card>

                {/* Fichiers */}
                {justification.fichiers && justification.fichiers.length > 0 && (
                  <Card>
                    <CardBody className="gap-3">
                      <p className="text-sm font-semibold">Fichiers joints</p>
                      <div className="space-y-2">
                        {justification.fichiers.map((fichier) => (
                          <div
                            key={fichier.id}
                            className="flex items-center gap-2 p-2 bg-default-50 rounded-lg"
                          >
                            <Icon
                              icon={
                                fichier.type.startsWith("image")
                                  ? "solar:image-linear"
                                  : "solar:document-linear"
                              }
                              width={20}
                              className="text-default-500"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {fichier.nom}
                              </p>
                              <p className="text-xs text-default-500">
                                {fichier.type}
                              </p>
                            </div>
                            <Link
                              href={fichier.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              isExternal
                              className="flex-shrink-0"
                            >
                              <Icon
                                icon="solar:download-linear"
                                width={20}
                                className="text-primary cursor-pointer hover:text-primary-700"
                              />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            {/* Onglet 2 : Discussion & Historique */}
            <Tab
              key="discussion"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:chat-round-dots-linear" />
                  Discussion
                </div>
              }
            >
              <div className="space-y-4 py-4">
                {/* Fil de messages */}
                {optimisticCommentaires && optimisticCommentaires.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {optimisticCommentaires.map((commentaire: any) => (
                      <MessageCard
                        key={commentaire.id}
                        commentaire={commentaire}
                        currentUserId={currentUserId}
                        isOptimistic={commentaire.isPending}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-default-50">
                    <CardBody className="text-center py-6">
                      <p className="text-sm text-default-500">
                        Aucun commentaire pour le moment.
                      </p>
                    </CardBody>
                  </Card>
                )}

                <Divider />

                {/* Formulaire de demande de précisions */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Demander des précisions
                  </label>
                  <Textarea
                    placeholder="Saisissez le motif ou les détails demandés..."
                    value={motif}
                    onValueChange={setMotif}
                    disabled={isPending || isSubmitting}
                    minRows={3}
                  />
                </div>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <Divider />

        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onOpenChange}
            disabled={isPending || isSubmitting}
          >
            Fermer
          </Button>

          {selectedTab === "justification" ? (
            <Button
              color="success"
              isLoading={isPending || isSubmitting}
              startContent={
                !isPending && !isSubmitting ? (
                  <Icon icon="solar:check-circle-linear" />
                ) : null
              }
              onPress={handleApprove}
            >
              ✅ Valider
            </Button>
          ) : (
            <Button
              color="warning"
              isLoading={isPending || isSubmitting}
              startContent={
                !isPending && !isSubmitting ? (
                  <Icon icon="solar:chat-round-linear" />
                ) : null
              }
              onPress={handleRequestChanges}
            >
              Demander des Précisions
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
