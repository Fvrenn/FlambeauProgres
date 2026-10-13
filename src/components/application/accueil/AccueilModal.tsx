"use client";

import type { EtatAccueil } from "@/services/accueil.service";
import type { EtapeProgressionPlateforme } from "@/services/wp-progression.service";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Autocomplete,
  AutocompleteItem,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { Icon } from "@/lib/icons";
import { ILLUSTRATION_ETAPE_1, NUMERO_ETAPE_1 } from "@/lib/parcours";
import { Button } from "@/components/ui";
import {
  passerAccueil,
  terminerAccueil,
} from "@/actions/profil/accueil.actions";

const ETAPES_FORMULAIRE = ["Étapes déjà obtenues", "Ton groupe"];

type AccueilModalProps = {
  etat: EtatAccueil;
  isOpen: boolean;
  onClose: () => void;
  premiereConnexion?: boolean;
};

export function AccueilModal({
  etat,
  isOpen,
  onClose,
  premiereConnexion = false,
}: AccueilModalProps) {
  const router = useRouter();
  const initiales = React.useMemo(
    () =>
      etat.etapes.filter((etape) => etape.declaree).map((etape) => etape.id),
    [etat.etapes],
  );

  const [pas, setPas] = React.useState(0);
  const [selection, setSelection] = React.useState<string[]>(initiales);
  const [groupe, setGroupe] = React.useState<string | null>(etat.groupeActuel);
  const [erreur, setErreur] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const estDernierPas = pas === ETAPES_FORMULAIRE.length - 1;
  const etapesModifiees =
    selection.length !== initiales.length ||
    selection.some((id) => !initiales.includes(id));
  const groupeModifie = groupe !== null && groupe !== etat.groupeActuel;

  const basculer = (etapeId: string) => {
    setSelection((courant) =>
      courant.includes(etapeId)
        ? courant.filter((id) => id !== etapeId)
        : [...courant, etapeId],
    );
  };

  const fermer = () => {
    setPas(0);
    setErreur(null);
    onClose();
  };

  const passer = () => {
    if (!premiereConnexion) {
      fermer();

      return;
    }

    startTransition(async () => {
      await passerAccueil();
      fermer();
    });
  };

  const terminer = () => {
    if (!premiereConnexion && !etapesModifiees && !groupeModifie) {
      fermer();

      return;
    }

    setErreur(null);
    startTransition(async () => {
      const result = await terminerAccueil({
        etapeIds: etapesModifiees ? selection : null,
        groupe: groupeModifie ? groupe : null,
      });

      if (!result.success) {
        setErreur(result.error ?? "Une erreur est survenue");

        return;
      }

      fermer();
      router.refresh();
    });
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{ base: "rounded-[24px]" }}
      hideCloseButton={premiereConnexion}
      isDismissable={!premiereConnexion}
      isKeyboardDismissDisabled={premiereConnexion}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="2xl"
      onClose={fermer}
    >
      <ModalContent className="bg-dashboard">
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold">
            {premiereConnexion
              ? "Bienvenue sur Flambeaux Progrès"
              : "Compléter mon profil"}
          </span>
          <span className="text-sm font-normal text-default-500">
            {pas + 1}/{ETAPES_FORMULAIRE.length} · {ETAPES_FORMULAIRE[pas]}
          </span>
        </ModalHeader>

        <ModalBody className="gap-4">
          {pas === 0 ? (
            <ChoixEtapes
              etapes={etat.etapes}
              selection={selection}
              onBasculer={basculer}
            />
          ) : (
            <ChoixGroupe
              groupe={groupe}
              groupeActuel={etat.groupeActuel}
              groupes={etat.groupes}
              onChange={setGroupe}
            />
          )}
          {premiereConnexion && (
            <p className="text-xs text-default-400">
              Tu pourras modifier ces informations plus tard depuis ton profil.
            </p>
          )}
          {erreur && (
            <p className="text-sm text-danger" role="alert">
              {erreur}
            </p>
          )}
        </ModalBody>

        <ModalFooter className="flex-col-reverse items-stretch gap-2 md:flex-row md:items-center md:justify-end">
          {pas === 0 ? (
            <Button
              className="w-full md:w-auto"
              disabled={isPending}
              variant="ghost"
              onClick={passer}
            >
              {premiereConnexion ? "Passer" : "Annuler"}
            </Button>
          ) : (
            <Button
              className="w-full md:w-auto"
              disabled={isPending}
              variant="ghost"
              onClick={() => setPas(pas - 1)}
            >
              Retour
            </Button>
          )}
          {estDernierPas ? (
            <Button
              className="w-full bg-nav-active text-white hover:bg-nav-hover md:w-auto"
              isLoading={isPending}
              startIcon="solar:check-circle-bold"
              onClick={terminer}
            >
              Enregistrer
            </Button>
          ) : (
            <Button
              className="w-full bg-nav-active text-white hover:bg-nav-hover md:w-auto"
              disabled={isPending}
              onClick={() => setPas(pas + 1)}
            >
              Suivant
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

type ChoixEtapesProps = {
  etapes: EtapeProgressionPlateforme[];
  selection: string[];
  onBasculer: (etapeId: string) => void;
};

function ChoixEtapes({ etapes, selection, onBasculer }: ChoixEtapesProps) {
  const niveaux = [...new Set(etapes.map((etape) => etape.niveau))];

  return (
    <>
      <p className="text-sm text-default-600">
        As-tu déjà obtenu des étapes avant d&apos;arriver sur Flambeaux Progrès
        ? Sélectionne-les : elles seront enregistrées ici et sur ton profil de
        la plateforme.
      </p>
      {niveaux.map((niveau) => (
        <section key={niveau} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Étape {niveau}</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {etapes
              .filter((etape) => etape.niveau === niveau)
              .map((etape) => (
                <TuileEtape
                  key={etape.id}
                  estSelectionnee={selection.includes(etape.id)}
                  etape={etape}
                  onClick={() => onBasculer(etape.id)}
                />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}

type TuileEtapeProps = {
  etape: EtapeProgressionPlateforme;
  estSelectionnee: boolean;
  onClick: () => void;
};

function imageEtape(etape: EtapeProgressionPlateforme) {
  if (etape.image_src) {
    return { src: etape.image_src, width: 56, height: 64 };
  }

  return etape.number === NUMERO_ETAPE_1 ? ILLUSTRATION_ETAPE_1 : null;
}

function TuileEtape({ etape, estSelectionnee, onClick }: TuileEtapeProps) {
  const valideeDansApp = etape.origine === "APP";
  const image = imageEtape(etape);

  return (
    <button
      aria-pressed={estSelectionnee}
      className={cn(
        "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-large border p-2 text-center transition-all duration-fast",
        estSelectionnee
          ? "border-nav-active bg-nav-active/10"
          : "border-dashboard-border opacity-60 hover:opacity-100",
        valideeDansApp && "cursor-default",
      )}
      disabled={valideeDansApp}
      title={valideeDansApp ? "Validée dans Flambeaux Progrès" : undefined}
      type="button"
      onClick={onClick}
    >
      {image ? (
        <Image
          alt=""
          className="h-14 w-auto object-contain"
          height={image.height}
          src={image.src}
          width={image.width}
        />
      ) : (
        <span
          className="flex h-14 w-12 items-center justify-center rounded-medium border border-dashboard-border text-sm font-semibold"
          style={{ color: etape.couleur ?? undefined }}
        >
          {etape.number}
        </span>
      )}
      <span className="text-xs leading-tight">{etape.name}</span>
      {estSelectionnee && (
        <Icon
          aria-hidden
          className="absolute right-1 top-1 h-5 w-5 text-nav-active"
          icon="solar:verified-check-bold"
        />
      )}
    </button>
  );
}

type ChoixGroupeProps = {
  groupes: EtatAccueil["groupes"];
  groupe: string | null;
  groupeActuel: string | null;
  onChange: (groupe: string | null) => void;
};

function ChoixGroupe({
  groupes,
  groupe,
  groupeActuel,
  onChange,
}: ChoixGroupeProps) {
  const libelleActuel = groupes.find(
    (candidat) => candidat.value === groupeActuel,
  )?.label;

  return (
    <>
      <p className="text-sm text-default-600">
        {libelleActuel ? (
          <>
            Sur la plateforme, ton groupe est{" "}
            <span className="font-semibold text-foreground">
              {libelleActuel}
            </span>
            . Si tu as changé de groupe, choisis le nouveau.
          </>
        ) : (
          "Aucun groupe n'est renseigné sur ton profil de la plateforme. Choisis le tien."
        )}
      </p>
      <Autocomplete
        defaultItems={groupes}
        label="Groupe"
        placeholder="Rechercher un groupe"
        selectedKey={groupe}
        onSelectionChange={(cle) => onChange(cle === null ? null : String(cle))}
      >
        {(item) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
