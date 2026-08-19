"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { EtapeAvecObjectifs } from "./DashboardClient";

import { validerJalon } from "@/actions/etape/etape.actions";
import { Button } from "@/components/ui";

const ALLUME_FEU = {
  src: "/livrets/allumefeu/illustration.png",
  width: 361,
  height: 659,
  subtitle: "Devenir Chef-taine Flambeaux",
  pdfUrl: "/livrets/allumefeu/allumefeu-v1.pdf",
  intro:
    "Avant de valider, prends le temps de lire le livret de découverte des Flambeaux. La validation se débloque une fois le livret ouvert.",
  ctaLabel: "J'ai lu le livret et je m'engage",
};

const DECOUVRIR = {
  src: "/livrets/decouvrir/illustration.png",
  width: 273,
  height: 251,
  subtitle: "Étape 1 du Parcours du Chef",
  pdfUrl: "/livrets/decouvrir/decouvrir-v11-2015.pdf",
  intro:
    "Lis le livret « Découvrir » du Parcours du Chef, puis certifie que ton Chef de Groupe a validé ton Étape 1. La validation se débloque une fois le livret ouvert.",
  ctaLabel: "Je certifie que mon CG a validé mon Étape 1",
};

export default function JalonBadge({ jalon }: { jalon: EtapeAvecObjectifs }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPending, startTransition] = useTransition();
  const [pdfOpened, setPdfOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = jalon.niveau === 0 ? ALLUME_FEU : DECOUVRIR;

  const handleOpenPdf = () => {
    setPdfOpened(true);
    window.open(config.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleValider = () => {
    setError(null);

    startTransition(async () => {
      const result = await validerJalon(jalon.id);

      if (!result.success) {
        setError(result.error ?? "Une erreur est survenue");

        return;
      }

      onClose();
      router.refresh();
    });
  };

  return (
    <>
      <button
        aria-label={`Ouvrir ${jalon.name}`}
        className="group flex cursor-pointer flex-col items-center gap-2 rounded-3xl p-3 transition-transform hover:-translate-y-1"
        type="button"
        onClick={onOpen}
      >
        <div className="relative">
          <Image
            priority
            alt={jalon.name}
            className="h-32 w-auto drop-shadow-[0_6px_12px_rgba(0,0,0,0.2)] md:h-40"
            height={config.height}
            src={config.src}
            width={config.width}
          />
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-warning text-white shadow">
            <Icon icon="solar:arrow-right-up-linear" width={16} />
          </span>
        </div>
        <span className="text-sm font-semibold text-foreground">
          {jalon.name}
        </span>
        <span className="text-xs text-default-500">Clique pour découvrir</span>
      </button>

      <Modal
        backdrop="blur"
        classNames={{ base: "rounded-[24px]" }}
        isOpen={isOpen}
        placement="center"
        size="xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-dashboard">
          <ModalHeader className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15">
              <Image
                alt=""
                className="h-9 w-9 object-contain"
                height={44}
                src={config.src}
                width={44}
              />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{jalon.name}</span>
              <span className="text-sm font-normal text-default-500">
                {config.subtitle}
              </span>
            </div>
          </ModalHeader>
          <ModalBody className="gap-4">
            <p className="text-sm text-default-600">{config.intro}</p>
            <Button
              className="bg-nav-active text-white hover:bg-nav-hover"
              startIcon="solar:book-2-bold"
              onClick={handleOpenPdf}
            >
              Ouvrir le livret (PDF)
            </Button>
            {pdfOpened ? (
              <p className="flex items-center gap-1.5 text-sm text-nav-active">
                <Icon icon="solar:check-circle-bold" width={16} />
                Livret ouvert, tu peux maintenant valider.
              </p>
            ) : (
              <p className="text-xs text-default-400">
                Ouvre le livret pour débloquer la validation.
              </p>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter className="flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
            <Button
              className="w-full md:w-auto"
              disabled={isPending}
              variant="ghost"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              className="w-full bg-nav-active text-white hover:bg-nav-hover md:w-auto"
              disabled={!pdfOpened}
              isLoading={isPending}
              startIcon="solar:check-circle-bold"
              onClick={handleValider}
            >
              {config.ctaLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
