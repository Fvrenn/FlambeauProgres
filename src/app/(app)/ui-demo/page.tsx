import React from "react";

import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@/components/ui";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-foreground/50 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <hr className="flex-1 border-foreground/10" />
      <span className="text-xs font-medium text-foreground/40 uppercase tracking-widest">
        {label}
      </span>
      <hr className="flex-1 border-foreground/10" />
    </div>
  );
}

export default function UiDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">
        <header>
          <h1 className="text-4xl font-bold text-foreground">
            🎨 Design System — FlambeauProgrès
          </h1>
          <p className="mt-2 text-foreground/60 text-lg">
            Composants réutilisables avec{" "}
            <code className="text-sm bg-default px-1.5 py-0.5 rounded font-mono">
              tailwind-variants
            </code>
          </p>
        </header>

        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-foreground border-b-2 border-primary pb-2">
            Button
          </h2>

          <Section
            description="color prop: primary | secondary | success | warning | danger | default"
            title="Couleurs (variant=solid)"
          >
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
            <Button color="default">Default</Button>
          </Section>

          <Divider label="variant" />

          <Section
            description="variant prop: solid | flat | outline | ghost | link"
            title="Variants (color=primary)"
          >
            <Button color="primary" variant="solid">
              Solid
            </Button>
            <Button color="primary" variant="flat">
              Flat
            </Button>
            <Button color="primary" variant="outline">
              Outline
            </Button>
            <Button color="primary" variant="ghost">
              Ghost
            </Button>
            <Button color="primary" variant="link">
              Link
            </Button>
          </Section>

          <Divider label="size" />

          <Section
            description="size prop: xs | sm | md | lg | xl"
            title="Tailles"
          >
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button color="primary" size="xl">
              XLarge
            </Button>
          </Section>

          <Divider label="icons" />

          <Section
            description="startIcon / endIcon prop (icône Iconify)"
            title="Avec icônes"
          >
            <Button color="primary" startIcon="solar:home-2-linear">
              Accueil
            </Button>
            <Button color="success" endIcon="solar:alt-arrow-right-linear">
              Continuer
            </Button>
            <Button
              color="danger"
              startIcon="solar:trash-bin-trash-bold"
              variant="flat"
            >
              Supprimer
            </Button>
            <Button
              color="default"
              endIcon="solar:alt-arrow-down-linear"
              startIcon="solar:add-circle-bold"
              variant="outline"
            >
              Ajouter
            </Button>
          </Section>

          <Divider label="icon only" />

          <Section
            description="isIconOnly prop — bouton carré"
            title="Icône seule (isIconOnly)"
          >
            <Button
              isIconOnly
              aria-label="Accueil"
              color="primary"
              size="xs"
              startIcon="solar:home-2-linear"
            />
            <Button
              isIconOnly
              aria-label="Valider"
              color="success"
              size="sm"
              startIcon="solar:check-circle-bold"
            />
            <Button
              isIconOnly
              aria-label="Supprimer"
              color="danger"
              size="md"
              startIcon="solar:trash-bin-trash-bold"
              variant="flat"
            />
            <Button
              isIconOnly
              aria-label="Paramètres"
              color="default"
              size="lg"
              startIcon="solar:settings-bold"
              variant="outline"
            />
            <Button
              isIconOnly
              aria-label="Notification"
              color="warning"
              size="xl"
              startIcon="solar:bell-bold"
            />
          </Section>

          <Divider label="états" />

          <Section description="isLoading / disabled" title="États">
            <Button isLoading color="primary">
              Chargement…
            </Button>
            <Button isLoading color="success" loadingText="Enregistrement…">
              Enregistrer
            </Button>
            <Button disabled color="default">
              Désactivé
            </Button>
          </Section>

          <Divider label="rounded" />

          <Section
            description="rounded prop: none | sm | md | lg | xl | full"
            title="Border radius (rounded)"
          >
            <Button color="primary" rounded="none">
              None
            </Button>
            <Button color="primary" rounded="sm">
              SM
            </Button>
            <Button color="primary" rounded="md">
              MD
            </Button>
            <Button color="primary" rounded="xl">
              XL
            </Button>
            <Button color="primary" rounded="full">
              Full
            </Button>
          </Section>

          <Divider label="fullWidth" />

          <section className="flex flex-col gap-3 w-full">
            <h2 className="text-xl font-bold text-foreground">Full Width</h2>
            <Button fullWidth color="primary" startIcon="solar:login-2-bold">
              Se connecter
            </Button>
            <Button fullWidth color="default" variant="outline">
              Annuler
            </Button>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-foreground border-b-2 border-primary pb-2">
            Badge
          </h2>

          <Section title="Couleurs (variant=flat)">
            <Badge color="primary">Primary</Badge>
            <Badge color="secondary">Secondary</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="warning">Warning</Badge>
            <Badge color="danger">Danger</Badge>
            <Badge color="default">Default</Badge>
          </Section>

          <Divider label="variants" />

          <Section title="Variants (color=success)">
            <Badge color="success" variant="solid">
              Solid
            </Badge>
            <Badge color="success" variant="flat">
              Flat
            </Badge>
            <Badge color="success" variant="outline">
              Outline
            </Badge>
            <Badge color="success" variant="dot">
              Dot
            </Badge>
          </Section>

          <Divider label="tailles" />

          <Section title="Tailles">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Section>

          <Divider label="avec icônes" />

          <Section title="Avec icônes">
            <Badge color="success" icon="solar:check-circle-bold">
              Validé
            </Badge>
            <Badge color="warning" icon="solar:clock-circle-bold">
              En attente
            </Badge>
            <Badge color="danger" icon="solar:close-circle-bold">
              Refusé
            </Badge>
            <Badge color="primary" icon="solar:fire-bold">
              Jalon
            </Badge>
          </Section>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-foreground border-b-2 border-primary pb-2">
            Card
          </h2>

          <Section
            description="variant prop: elevated | flat | outline | glass"
            title="Variants"
          >
            <Card className="w-60" variant="elevated">
              <CardHeader>
                <span className="text-sm font-bold text-foreground">
                  Elevated
                </span>
                <span className="text-xs text-foreground/50">
                  Carte blanche avec ombre
                </span>
              </CardHeader>
              <CardBody>
                <Badge color="success" variant="dot">
                  Actif
                </Badge>
                <p className="text-sm text-foreground/70">
                  Contenu de la carte elevated.
                </p>
              </CardBody>
              <CardFooter>
                <Button color="primary" size="sm">
                  Action
                </Button>
                <Button color="default" size="sm" variant="ghost">
                  Annuler
                </Button>
              </CardFooter>
            </Card>

            <Card className="w-60" variant="flat">
              <CardHeader>
                <span className="text-sm font-bold text-foreground">Flat</span>
                <span className="text-xs text-foreground/50">
                  Fond beige discret
                </span>
              </CardHeader>
              <CardBody>
                <Badge color="warning" variant="flat">
                  En attente
                </Badge>
                <p className="text-sm text-foreground/70">
                  Contenu de la carte flat.
                </p>
              </CardBody>
              <CardFooter>
                <Button color="warning" size="sm">
                  Voir
                </Button>
              </CardFooter>
            </Card>

            <Card className="w-60" variant="outline">
              <CardHeader>
                <span className="text-sm font-bold text-foreground">
                  Outline
                </span>
                <span className="text-xs text-foreground/50">
                  Contour seulement
                </span>
              </CardHeader>
              <CardBody>
                <Badge color="danger" variant="outline">
                  Refusé
                </Badge>
                <p className="text-sm text-foreground/70">
                  Contenu de la carte outline.
                </p>
              </CardBody>
              <CardFooter>
                <Button color="danger" size="sm" variant="outline">
                  Détails
                </Button>
              </CardFooter>
            </Card>

            <Card
              className="w-60 bg-gradient-to-br from-primary/20 to-success/10"
              variant="glass"
            >
              <CardHeader>
                <span className="text-sm font-bold text-foreground">Glass</span>
                <span className="text-xs text-foreground/50">Glassmorphism</span>
              </CardHeader>
              <CardBody>
                <Badge color="primary" variant="solid">
                  Premium
                </Badge>
                <p className="text-sm text-foreground/70">
                  Contenu de la carte glass.
                </p>
              </CardBody>
              <CardFooter>
                <Button color="primary" size="sm">
                  Explorer
                </Button>
              </CardFooter>
            </Card>
          </Section>

          <Divider label="tailles" />

          <Section title="Tailles (size)">
            <Card className="w-48" size="sm" variant="elevated">
              <CardHeader>
                <span className="font-bold text-sm">Small</span>
              </CardHeader>
              <CardBody>
                <p className="text-xs text-foreground/60">Carte compacte</p>
              </CardBody>
            </Card>
            <Card className="w-56" size="md" variant="elevated">
              <CardHeader>
                <span className="font-bold text-sm">Medium</span>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-foreground/60">Taille par défaut</p>
              </CardBody>
            </Card>
            <Card className="w-64" size="lg" variant="elevated">
              <CardHeader>
                <span className="font-bold text-base">Large</span>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-foreground/60">Carte spacieuse</p>
              </CardBody>
            </Card>
          </Section>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-foreground border-b-2 border-primary pb-2">
            Utilisation
          </h2>
          <Card variant="flat">
            <CardBody>
              <pre className="text-xs text-foreground/80 overflow-x-auto leading-6">
                {`import { Button, Badge, Card, CardHeader, CardBody, CardFooter } from "@/components/ui";

// Bouton avec icône et variante
<Button color="primary" size="lg" startIcon="solar:home-2-linear">
  Accueil
</Button>

// Bouton icône seule
<Button isIconOnly color="danger" variant="flat" startIcon="solar:trash-bin-trash-bold" />

// Badge statut
<Badge color="success" variant="dot">Validé</Badge>

// Carte complète
<Card variant="elevated">
  <CardHeader>
    <h3>Titre</h3>
    <p>Sous-titre</p>
  </CardHeader>
  <CardBody>Contenu…</CardBody>
  <CardFooter>
    <Button size="sm" color="primary">Action</Button>
  </CardFooter>
</Card>`}
              </pre>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
