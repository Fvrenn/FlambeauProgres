/**
 * Page de démo des composants UI — /ui-demo
 * Pour y accéder : http://localhost:3000/ui-demo
 */
import React from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@/components/ui";

// ─────────────────────────────────────────────
//  Sections de la démo
// ─────────────────────────────────────────────

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
        <h2 className="text-xl font-bold text-[#0f1511]">{title}</h2>
        {description && (
          <p className="text-sm text-[#0f1511]/50 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <hr className="flex-1 border-[#0f1511]/10" />
      <span className="text-xs font-medium text-[#0f1511]/40 uppercase tracking-widest">
        {label}
      </span>
      <hr className="flex-1 border-[#0f1511]/10" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page principale
// ─────────────────────────────────────────────
export default function UiDemoPage() {
  return (
    <div className="min-h-screen bg-[#F3F2E9] py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold text-[#0f1511]">
            🎨 Design System — FlambeauProgrès
          </h1>
          <p className="mt-2 text-[#0f1511]/60 text-lg">
            Composants réutilisables avec{" "}
            <code className="text-sm bg-[#E8E7DE] px-1.5 py-0.5 rounded font-mono">
              tailwind-variants
            </code>
          </p>
        </header>

        {/* ════════════════════════════════════
            BUTTON
        ════════════════════════════════════ */}
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-[#0f1511] border-b-2 border-[#FCC226] pb-2">
            Button
          </h2>

          {/* Couleurs × variant=solid */}
          <Section
            title="Couleurs (variant=solid)"
            description="color prop: primary | secondary | success | warning | danger | default"
          >
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
            <Button color="default">Default</Button>
          </Section>

          <Divider label="variant" />

          {/* Variants */}
          <Section
            title="Variants (color=primary)"
            description="variant prop: solid | flat | outline | ghost | link"
          >
            <Button variant="solid"   color="primary">Solid</Button>
            <Button variant="flat"    color="primary">Flat</Button>
            <Button variant="outline" color="primary">Outline</Button>
            <Button variant="ghost"   color="primary">Ghost</Button>
            <Button variant="link"    color="primary">Link</Button>
          </Section>

          <Divider label="size" />

          {/* Tailles */}
          <Section
            title="Tailles"
            description="size prop: xs | sm | md | lg | xl"
          >
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl" color="primary">XLarge</Button>
          </Section>

          <Divider label="icons" />

          {/* Avec icônes */}
          <Section
            title="Avec icônes"
            description="startIcon / endIcon prop (icône Iconify)"
          >
            <Button startIcon="solar:home-2-linear" color="primary">
              Accueil
            </Button>
            <Button endIcon="solar:alt-arrow-right-linear" color="success">
              Continuer
            </Button>
            <Button
              startIcon="solar:trash-bin-trash-bold"
              color="danger"
              variant="flat"
            >
              Supprimer
            </Button>
            <Button
              startIcon="solar:add-circle-bold"
              endIcon="solar:alt-arrow-down-linear"
              variant="outline"
              color="default"
            >
              Ajouter
            </Button>
          </Section>

          <Divider label="icon only" />

          {/* Icône seule */}
          <Section
            title="Icône seule (isIconOnly)"
            description="isIconOnly prop — bouton carré"
          >
            <Button isIconOnly size="xs" color="primary" startIcon="solar:home-2-linear" aria-label="Accueil" />
            <Button isIconOnly size="sm" color="success" startIcon="solar:check-circle-bold" aria-label="Valider" />
            <Button isIconOnly size="md" color="danger"  variant="flat" startIcon="solar:trash-bin-trash-bold" aria-label="Supprimer" />
            <Button isIconOnly size="lg" color="default" variant="outline" startIcon="solar:settings-bold" aria-label="Paramètres" />
            <Button isIconOnly size="xl" color="warning" startIcon="solar:bell-bold" aria-label="Notification" />
          </Section>

          <Divider label="états" />

          {/* États */}
          <Section
            title="États"
            description="isLoading / disabled"
          >
            <Button isLoading color="primary">
              Chargement…
            </Button>
            <Button isLoading loadingText="Enregistrement…" color="success">
              Enregistrer
            </Button>
            <Button disabled color="default">
              Désactivé
            </Button>
          </Section>

          <Divider label="rounded" />

          {/* Rounded */}
          <Section
            title="Border radius (rounded)"
            description="rounded prop: none | sm | md | lg | xl | full"
          >
            <Button rounded="none"  color="primary">None</Button>
            <Button rounded="sm"    color="primary">SM</Button>
            <Button rounded="md"    color="primary">MD</Button>
            <Button rounded="xl"    color="primary">XL</Button>
            <Button rounded="full"  color="primary">Full</Button>
          </Section>

          <Divider label="fullWidth" />

          {/* Full width */}
          <section className="flex flex-col gap-3 w-full">
            <h2 className="text-xl font-bold text-[#0f1511]">Full Width</h2>
            <Button fullWidth color="primary" startIcon="solar:login-2-bold">
              Se connecter
            </Button>
            <Button fullWidth variant="outline" color="default">
              Annuler
            </Button>
          </section>
        </div>

        {/* ════════════════════════════════════
            BADGE
        ════════════════════════════════════ */}
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-[#0f1511] border-b-2 border-[#FCC226] pb-2">
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
            <Badge color="success" variant="solid">Solid</Badge>
            <Badge color="success" variant="flat">Flat</Badge>
            <Badge color="success" variant="outline">Outline</Badge>
            <Badge color="success" variant="dot">Dot</Badge>
          </Section>

          <Divider label="tailles" />

          <Section title="Tailles">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Section>

          <Divider label="avec icônes" />

          <Section title="Avec icônes">
            <Badge color="success" icon="solar:check-circle-bold">Validé</Badge>
            <Badge color="warning" icon="solar:clock-circle-bold">En attente</Badge>
            <Badge color="danger"  icon="solar:close-circle-bold">Refusé</Badge>
            <Badge color="primary" icon="solar:fire-bold">Jalon</Badge>
          </Section>
        </div>

        {/* ════════════════════════════════════
            CARD
        ════════════════════════════════════ */}
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-[#0f1511] border-b-2 border-[#FCC226] pb-2">
            Card
          </h2>

          <Section
            title="Variants"
            description="variant prop: elevated | flat | outline | glass"
          >
            {/* Elevated */}
            <Card variant="elevated" className="w-60">
              <CardHeader>
                <span className="text-sm font-bold text-[#0f1511]">Elevated</span>
                <span className="text-xs text-[#0f1511]/50">Carte blanche avec ombre</span>
              </CardHeader>
              <CardBody>
                <Badge color="success" variant="dot">Actif</Badge>
                <p className="text-sm text-[#0f1511]/70">
                  Contenu de la carte elevated.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" color="primary">Action</Button>
                <Button size="sm" variant="ghost" color="default">Annuler</Button>
              </CardFooter>
            </Card>

            {/* Flat */}
            <Card variant="flat" className="w-60">
              <CardHeader>
                <span className="text-sm font-bold text-[#0f1511]">Flat</span>
                <span className="text-xs text-[#0f1511]/50">Fond beige discret</span>
              </CardHeader>
              <CardBody>
                <Badge color="warning" variant="flat">En attente</Badge>
                <p className="text-sm text-[#0f1511]/70">
                  Contenu de la carte flat.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" color="warning">Voir</Button>
              </CardFooter>
            </Card>

            {/* Outline */}
            <Card variant="outline" className="w-60">
              <CardHeader>
                <span className="text-sm font-bold text-[#0f1511]">Outline</span>
                <span className="text-xs text-[#0f1511]/50">Contour seulement</span>
              </CardHeader>
              <CardBody>
                <Badge color="danger" variant="outline">Refusé</Badge>
                <p className="text-sm text-[#0f1511]/70">
                  Contenu de la carte outline.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline" color="danger">Détails</Button>
              </CardFooter>
            </Card>

            {/* Glass */}
            <Card variant="glass" className="w-60 bg-gradient-to-br from-[#FCC226]/20 to-[#1bc47d]/10">
              <CardHeader>
                <span className="text-sm font-bold text-[#0f1511]">Glass</span>
                <span className="text-xs text-[#0f1511]/50">Glassmorphism</span>
              </CardHeader>
              <CardBody>
                <Badge color="primary" variant="solid">Premium</Badge>
                <p className="text-sm text-[#0f1511]/70">
                  Contenu de la carte glass.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" color="primary">Explorer</Button>
              </CardFooter>
            </Card>
          </Section>

          <Divider label="tailles" />

          <Section title="Tailles (size)">
            <Card size="sm" variant="elevated" className="w-48">
              <CardHeader><span className="font-bold text-sm">Small</span></CardHeader>
              <CardBody><p className="text-xs text-[#0f1511]/60">Carte compacte</p></CardBody>
            </Card>
            <Card size="md" variant="elevated" className="w-56">
              <CardHeader><span className="font-bold text-sm">Medium</span></CardHeader>
              <CardBody><p className="text-sm text-[#0f1511]/60">Taille par défaut</p></CardBody>
            </Card>
            <Card size="lg" variant="elevated" className="w-64">
              <CardHeader><span className="font-bold text-base">Large</span></CardHeader>
              <CardBody><p className="text-sm text-[#0f1511]/60">Carte spacieuse</p></CardBody>
            </Card>
          </Section>
        </div>

        {/* ════════════════════════════════════
            Usage / Code
        ════════════════════════════════════ */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-[#0f1511] border-b-2 border-[#FCC226] pb-2">
            Utilisation
          </h2>
          <Card variant="flat">
            <CardBody>
              <pre className="text-xs text-[#0f1511]/80 overflow-x-auto leading-6">
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
