"use client";

import type { SessionUser } from "@/types";

import React from "react";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";

import { Icon } from "@/lib/icons";
import { BUG_REPORT_EMAIL } from "@/config/navigation";

const ETAPES = [
  {
    icon: "solar:document-text-linear",
    title: "Décrivez ce qui s'est passé",
    description:
      "En une ou deux phrases : ce que vous avez obtenu, et ce que vous attendiez à la place.",
  },
  {
    icon: "solar:compass-linear",
    title: "Indiquez la page concernée",
    description:
      "Le nom de la page (Progression, Formation, Justifications à valider…) ou l'adresse affichée dans la barre du navigateur.",
  },
  {
    icon: "solar:refresh-linear",
    title: "Expliquez comment le bug est arrivé",
    description:
      "Les actions faites juste avant, dans l'ordre. Précisez si le problème revient à chaque fois ou s'il est arrivé une seule fois.",
  },
  {
    icon: "solar:gallery-linear",
    title: "Ajoutez une capture d'écran",
    description:
      "Si une image aide à comprendre, joignez-la au mail. Windows : Touche Windows + Maj + S. Mac : Cmd + Maj + 4. Mobile : capture d'écran classique.",
  },
];

const CONTEXTE = [
  "L'appareil utilisé (ordinateur, téléphone, tablette)",
  "Le navigateur (Chrome, Safari, Firefox…)",
  "La date et l'heure approximatives",
];

function buildMailtoHref(user: SessionUser) {
  const subject = "[Bug Flambeau Progrès] ";
  const body = [
    "Ce qui s'est passé :",
    "",
    "",
    "Ce que j'attendais :",
    "",
    "",
    "Page concernée :",
    "",
    "",
    "Comment reproduire (étape par étape) :",
    "1.",
    "2.",
    "3.",
    "",
    "Le problème revient-il à chaque fois ? (oui / non / parfois) :",
    "",
    "",
    "Capture d'écran jointe : (oui / non)",
    "",
    "---",
    `Compte : ${user.name} (${user.email})`,
    `Navigateur : ${typeof navigator !== "undefined" ? navigator.userAgent : ""}`,
    `Date : ${new Date().toLocaleString("fr-FR")}`,
  ].join("\n");

  return `mailto:${BUG_REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ClientPage({ user }: { user: SessionUser }) {
  const [mailtoHref, setMailtoHref] = React.useState(
    `mailto:${BUG_REPORT_EMAIL}`,
  );
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setMailtoHref(buildMailtoHref(user));
  }, [user]);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(BUG_REPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl w-full pt-4 md:pt-6">
      <div className="flex flex-col gap-2">
        <Chip
          className="bg-[#E06511]/10 text-[#E06511]"
          startContent={<Icon icon="solar:bug-linear" width={16} />}
          variant="flat"
        >
          Version bêta
        </Chip>
        <h1 className="text-3xl font-extrabold">Remonter un bug</h1>
        <p className="text-default-500">
          L&apos;application est en cours de test : si quelque chose ne
          fonctionne pas comme prévu, envoyez-moi un mail à{" "}
          <span className="font-medium text-foreground">
            {BUG_REPORT_EMAIL}
          </span>
          . Plus votre description est précise, plus le correctif arrive vite.
        </p>
      </div>

      <Card className="bg-dashboard-card shadow-none border border-dashboard-border">
        <CardBody className="flex flex-col gap-5 p-5 md:p-6">
          <h2 className="text-lg font-bold">Ce qu&apos;il faut me dire</h2>

          <div className="flex flex-col gap-4">
            {ETAPES.map((etape, index) => (
              <div key={etape.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E06511]/10 text-[#E06511]">
                  <Icon icon={etape.icon} width={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">
                    {index + 1}. {etape.title}
                  </span>
                  <span className="text-small text-default-500">
                    {etape.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Divider className="bg-dashboard-border" />

          <div className="flex flex-col gap-2">
            <span className="font-semibold">Si vous y pensez, ajoutez</span>
            <ul className="flex flex-col gap-1">
              {CONTEXTE.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-small text-default-500"
                >
                  <Icon
                    className="text-[#E06511]"
                    icon="solar:check-circle-linear"
                    width={16}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>

      <Card className="bg-dashboard-panel shadow-none border border-dashboard-border">
        <CardBody className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">Envoyer le signalement</h2>
            <p className="text-small text-default-500">
              Le bouton ouvre votre messagerie avec un modèle déjà rempli : il
              ne reste qu&apos;à compléter les champs et joindre la capture
              d&apos;écran.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              as="a"
              className="bg-[#E06511] text-white font-medium"
              href={mailtoHref}
              startContent={<Icon icon="solar:letter-linear" width={20} />}
            >
              Écrire le mail
            </Button>
            <Button
              className="font-medium"
              startContent={
                <Icon
                  icon={
                    copied ? "solar:check-circle-linear" : "solar:copy-linear"
                  }
                  width={20}
                />
              }
              variant="bordered"
              onPress={handleCopyEmail}
            >
              {copied ? "Adresse copiée" : "Copier l'adresse mail"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
