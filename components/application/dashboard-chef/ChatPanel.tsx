"use client";

import React, { useEffect, useState, useOptimistic, useTransition } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Textarea,
  Spinner,
  Divider,
  Card,
  CardBody,
  User,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { Justification, Commentaire, User as UserType } from "@prisma/client";
import { submitComment } from "@/app/(app)/(dashboard)/_actions/commentaire-actions";

// Type pour une justification complète avec commentaires et auteurs
type JustificationWithComments = Justification & {
  commentaires: (Commentaire & {
    auteur: UserType;
  })[];
  chef: UserType;
  objectif: {
    code: string;
    description: string;
  };
};

// Type pour un commentaire avec auteur et état optionnel
type CommentaireAvecAuteur = (Commentaire & {
  auteur: UserType;
  isPending?: boolean;
});

// Type pour un commentaire optimiste (en attente d'envoi)
type OptimisticComment = Commentaire & {
  auteur: UserType;
  isPending?: boolean;
};

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  objectifId: string;
  justificationId?: string;
  initialCommentaires?: CommentaireAvecAuteur[];
}

export default function ChatPanel({
  isOpen,
  onClose,
  objectifId,
  justificationId,
  initialCommentaires,
}: ChatPanelProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // État pour la justification avec commentaires
  const [justification, setJustification] = useState<JustificationWithComments | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État local pour les commentaires (initial + recharges après envoi)
  const [localCommentaires, setLocalCommentaires] = useState(
    initialCommentaires || []
  );

  // État pour le formulaire
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État optimiste pour les commentaires
  const [optimisticCommentaires, addOptimisticCommentaire] = useOptimistic(
    localCommentaires,
    (state: CommentaireAvecAuteur[], 
     newComment: CommentaireAvecAuteur) => [
      ...state,
      newComment,
    ]
  );

  // Synchroniser les commentaires initiaux quand ils changent
  useEffect(() => {
    if (initialCommentaires) {
      console.log("📍 [ChatPanel] Synchronisation des commentaires initiaux:", initialCommentaires.length);
      setLocalCommentaires(initialCommentaires);
    }
  }, [initialCommentaires]);

  // Fonction pour recharger les commentaires depuis le serveur (après envoi)
  const reloadCommentaires = async () => {
    if (!justificationId) return;

    console.log("📍 [ChatPanel] Recharge des commentaires depuis le serveur");
    try {
      const response = await fetch(
        `/api/justifications/${justificationId}/comments`
      );

      if (!response.ok) {
        console.error("❌ [ChatPanel] Erreur API:", response.status);
        return;
      }

      const data = await response.json();
      console.log("✅ [ChatPanel] Commentaires reçus:", data.commentaires?.length);
      setLocalCommentaires(data.commentaires || []);
    } catch (err) {
      console.error("❌ [ChatPanel] Exception lors du reload:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !justificationId || !currentUserId) {
      return;
    }

    // Sauvegarder le texte avant de le vider
    const textToSend = messageText;

    const newComment: OptimisticComment = {
      id: `temp-${Date.now()}`,
      justificationId,
      auteurId: currentUserId,
      contenu: textToSend,
      type: "CHEF_REPONSE" as const,
      createdAt: new Date(),
      auteur: session?.user as UserType,
      isPending: true,
    };

    console.log("📍 [ChatPanel] Envoi du message:", textToSend);
    
    // Mettre à jour l'UI de manière optimiste
    addOptimisticCommentaire(newComment);
    setMessageText("");

    setIsSubmitting(true);

    startTransition(async () => {
      try {
        // Appeler la Server Action pour soumettre le commentaire
        const result = await submitComment(justificationId, textToSend);

        if (result.success) {
          console.log("✅ [ChatPanel] Message envoyé, recharge des commentaires");
          // Attendre un court délai avant de recharger
          await new Promise(resolve => setTimeout(resolve, 300));
          await reloadCommentaires();
        } else {
          throw new Error(result.error || "Erreur lors de l'envoi du message");
        }
      } catch (err) {
        console.error("❌ [ChatPanel] Erreur lors de l'envoi:", err);
        // En cas d'erreur, on remet le texte dans la textarea
        setMessageText(textToSend);
        setError(
          err instanceof Error ? err.message : "Erreur lors de l'envoi"
        );
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const loadComments = async () => {
    if (!justificationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Appeler la Server Action pour récupérer les commentaires
      const response = await fetch(
        `/api/justifications/${justificationId}/comments`
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des commentaires");
      }

      const data = await response.json();
      setJustification(data);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="right"
      backdrop="blur"
    >
      <DrawerContent className="flex flex-col h-full">
        {/* HEADER */}
        <DrawerHeader className="flex flex-col gap-1 border-b border-divider">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">Discussion</h4>
            </div>
            <Icon
              icon="solar:close-circle-linear"
              width={24}
              className="cursor-pointer text-default-400 hover:text-default-600"
              onClick={onClose}
            />
          </div>
        </DrawerHeader>

        {/* BODY - Messages */}
        <DrawerBody className="flex-1 overflow-y-auto py-4 space-y-4">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <Card className="bg-danger-50 border border-danger-200">
                <CardBody className="text-danger">
                  <p className="text-sm">{error}</p>
                </CardBody>
              </Card>
            </div>
          ) : optimisticCommentaires.length > 0 ? (
            optimisticCommentaires.map((comment) => {
              const isChef = comment.auteur.id === currentUserId;

              return (
                <div
                  key={comment.id}
                  className={`flex ${isChef ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-xs ${
                      isChef ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <User
                      avatarProps={{
                        src: comment.auteur.image || undefined,
                        name: comment.auteur.name.charAt(0).toUpperCase(),
                        size: "sm",
                      }}
                      name=""
                      description=""
                      className="min-w-fit"
                    />

                    {/* Message Bubble */}
                    <Card
                      className={`${
                        isChef
                          ? "bg-primary text-white"
                          : "bg-default-100 text-default-900"
                      } ${comment.isPending ? "opacity-60" : ""}`}
                    >
                      <CardBody className="p-3 gap-1">
                        <p className="text-xs font-semibold">
                          {comment.auteur.name}
                        </p>
                        <p className="text-sm">{comment.contenu}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(comment.createdAt).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        {comment.isPending && (
                          <div className="flex items-center gap-1 mt-1">
                            <Spinner size="sm" />
                            <span className="text-xs">Envoi...</span>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Aucun message pour le moment.</p>
            </div>
          )}
        </DrawerBody>

        {/* FOOTER - Input */}
        <DrawerFooter className="flex flex-col gap-3 border-t border-divider">
          {error && (
            <Card className="bg-warning-50 border border-warning-200">
              <CardBody className="p-2 text-warning text-xs">{error}</CardBody>
            </Card>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Écris ton message..."
              value={messageText}
              onValueChange={setMessageText}
              minRows={2}
              maxRows={4}
              disabled={isSubmitting}
              className="flex-1"
            />
            <Button
              isIconOnly
              color="primary"
              onPress={handleSendMessage}
              isLoading={isSubmitting}
              disabled={!messageText.trim() || isSubmitting}
              size="lg"
              className="mt-auto"
            >
              <Icon icon="solar:send-linear" width={20} />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
