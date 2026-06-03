"use client";

import React, {
  useEffect,
  useState,
  useTransition,
  useOptimistic,
} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Button,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  Justification,
  Commentaire,
  User as UserType,
  Objectif,
  Fichier,
} from "@prisma/client";

import JustificationContent from "./modal/JustificationContent";
import DiscussionContent from "./modal/DiscussionContent";

import { useSession } from "@/lib/auth-client";
import { CommentaireAvecAuteur } from "@/types";
import {
  approveJustification,
  requestChanges,
} from "@/actions/justification/justification.actions";
import { markNotificationsAsReadForJustification } from "@/actions/notification/notification.actions";

type FichierAvecUrl = Fichier & {
  url: string;
};

export type JustificationAvecRelations = Justification & {
  chef: UserType;
  objectif: Objectif;
  commentaires: (Commentaire & {
    auteur: UserType;
  })[];
  fichiers?: FichierAvecUrl[];
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

  const [motif, setMotif] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "justification" | "discussion"
  >(defaultTab);

  const [localCommentaires, setLocalCommentaires] = useState(
    justification?.commentaires || [],
  );
  const [optimisticCommentaires, addOptimisticCommentaire] = useOptimistic(
    localCommentaires,
    (state: CommentaireAvecAuteur[], newCommentaire: CommentaireAvecAuteur) => [
      ...state,
      newCommentaire,
    ],
  );

  useEffect(() => {
    if (justification?.commentaires) {
      setLocalCommentaires(justification.commentaires);
    }
    if (isOpen) {
      setSelectedTab(defaultTab);
    }
  }, [justification, isOpen, defaultTab]);

  useEffect(() => {
    if (isOpen && defaultTab === "discussion" && justification) {
      startTransition(async () => {
        await markNotificationsAsReadForJustification(justification.id);
      });
    }
  }, [isOpen, defaultTab, justification]);

  const reloadCommentaires = async () => {
    if (!justification?.id) return;
    try {
      const response = await fetch(
        `/api/justifications/${justification.id}/comments`,
      );

      if (response.ok) {
        const data = await response.json();

        setLocalCommentaires(data.commentaires || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async () => {
    if (!justification) return;
    setIsSubmitting(true);
    startTransition(async () => {
      const result = await approveJustification(justification.id);

      setIsSubmitting(false);
      if (result.success) {
        onOpenChange();
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    });
  };

  const handleRequestChanges = async () => {
    if (!justification || !motif.trim() || !currentUserId || !session?.user) {
      alert("Veuillez saisir un message valide");

      return;
    }

    const textToSend = motif;
    const optimisticComment: CommentaireAvecAuteur = {
      id: `temp-${Date.now()}`,
      justificationId: justification.id,
      auteurId: currentUserId,
      contenu: textToSend,
      type: "REFERENT_QUESTION",
      createdAt: new Date(),
      auteur: session.user as unknown as UserType,
      isPending: true,
    };

    setIsSubmitting(true);
    startTransition(async () => {
      addOptimisticCommentaire(optimisticComment);
      setMotif("");

      try {
        const result = await requestChanges(justification.id, textToSend);

        setIsSubmitting(false);

        if (!result.success) {
          alert(result.error);
          setMotif(textToSend);

          return;
        }

        router.refresh();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await reloadCommentaires();
      } catch (err) {
        setMotif(textToSend);
        setIsSubmitting(false);
      }
    });
  };

  if (!justification) return null;

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      scrollBehavior="outside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-3">
              <User
                avatarProps={{
                  src: justification.chef.image || undefined,
                  name: justification.chef.name.charAt(0).toUpperCase(),
                  className: "w-10 h-10 md:w-12 md:h-12 text-sm",
                }}
                description={
                  <p className="text-xs text-default-500">
                    {justification.chef.email}
                  </p>
                }
                name={
                  <span className="text-base font-bold text-foreground">
                    {justification.chef.name}
                  </span>
                }
              />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-2.5 py-1 rounded-full bg-default-100 border border-default-200 text-xs font-bold text-default-700">
                {justification.objectif.code}
              </span>
            </div>
          </div>

          <div className="bg-default p-3 rounded-xl border border-default-100">
            <p className="text-sm text-default-600 line-clamp-2 leading-relaxed">
              {justification.objectif.description}
            </p>
          </div>

          <Tabs
            aria-label="Mode d'affichage"
            classNames={{
              base: "w-full",
              tabList: "w-full bg-default-100 p-1 rounded-full gap-2",
              cursor: "bg-primary rounded-full",
              tab: "h-10 text-xs md:text-sm font-medium",
              tabContent:
                "group-data-[selected=true]:text-white text-default-500 transition-colors",
            }}
            selectedKey={selectedTab}
            onSelectionChange={(key) =>
              setSelectedTab(key as "justification" | "discussion")
            }
          >
            <Tab
              key="justification"
              title={
                <div className="flex items-center gap-2">
                  <span>Détails & Preuves</span>
                </div>
              }
            />
            <Tab
              key="discussion"
              title={
                <div className="flex items-center gap-2">
                  <span>Discussion</span>
                  {optimisticCommentaires.length > 0 && (
                    <span className="bg-default-200/50 group-data-[selected=true]:bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                      {optimisticCommentaires.length}
                    </span>
                  )}
                </div>
              }
            />
          </Tabs>
        </ModalHeader>

        <ModalBody className="p-0">
          <div className="p-4 md:p-6 min-h-[300px]">
            {selectedTab === "justification" ? (
              <JustificationContent justification={justification} />
            ) : (
              <DiscussionContent
                comments={optimisticCommentaires}
                currentUserId={currentUserId}
                isPending={isPending}
                isSubmitting={isSubmitting}
                motif={motif}
                setMotif={setMotif}
              />
            )}
          </div>
        </ModalBody>

        <ModalFooter className="p-4 border-t border-default-100 z-20">
          <Button
            className="font-medium text-default-500 hover:text-default-900"
            isDisabled={isPending || isSubmitting}
            variant="light"
            onPress={onOpenChange}
          >
            Fermer
          </Button>

          {selectedTab === "justification" ? (
            <Button
              className="text-white font-medium"
              color="primary"
              isLoading={isPending || isSubmitting}
              startContent={
                !isPending && !isSubmitting ? (
                  <Icon icon="solar:check-read-linear" width={20} />
                ) : null
              }
              onPress={handleApprove}
            >
              Valider
            </Button>
          ) : (
            <Button
              className="bg-primary text-black font-semibold shadow-lg shadow-[#DDFE02]/20"
              isLoading={isPending || isSubmitting}
              startContent={
                !isPending && !isSubmitting ? (
                  <Icon icon="solar:plain-linear" width={20} />
                ) : null
              }
              onPress={handleRequestChanges}
            >
              Envoyer
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
