# 📋 Plan de refactor — Design system (Claude Design)

> **Date :** 2026-07-30
> **Statut :** validé, en cours (phase par phase)
> **Périmètre :** remplacer le style des boutons/cards/badges de l'app par le langage visuel généré via Claude Design (kit à la racine : `components/`, `tokens/`, `guidelines/`), en gardant les couleurs sémantiques actuelles (primary/secondary/success/warning/danger).

## Contexte & objectif

Le kit généré par Claude Design (`SKILL.md` + `components/`, `tokens/`) définit une esthétique boutons pilule, cartes à rayon 24px, badges/tags arrondis, sur une base Inter + palette crème/or/violet. Il ne s'agit pas d'une lib prête à l'emploi (pas de générique `Card`, pas de couleurs danger/success, pas de nesting de menu) — on en extrait la forme (rayons, ombres, spacing) et on l'applique à nos vrais composants TypeScript dans `src/components/ui/`.

La page d'accueil (chemise 3D) n'est **pas concernée** par ce refactor. `JalonBadge` (modal Allume-feu / Découvrir) fait exception : ses boutons ont été migrés sur demande explicite du user (voir plus bas), sans toucher à la 3D elle-même.

## Périmètre resserré (2026-07-30)

Après la Phase 1, le user a précisé qu'il ne veut **pas tout refaire** — seulement les pages qui le dérangent réellement :

- **Formation** : cartes à refaire (déjà décrit fonctionnellement plus haut dans la conversation).
- **Progression** : garder la barre de progression actuelle (aimée telle quelle), seulement refaire la carte autour.
- **Admin** : toutes les pages sont "pas top top", **assignations en particulier décrite comme "une catastrophe"** — priorité haute.
- **Modals** : incohérentes entre elles à travers l'admin — besoin d'un style de modal unifié, pas juste un remplacement de boutons dedans.

Sidebar/chrome global, Auth/Profil, Discussion/Référent et les panneaux du dashboard **sortent du périmètre pour l'instant** (pas mentionnés comme un problème par le user). On les gardera en tête si demandé plus tard, mais on ne les touche pas de nous-même.

## Phases

- [x] **Extra — Modal Allume-feu / Découvrir (Étape 1 → débloque l'Étape 2)** — `_component/JalonBadge.tsx`.
  ✅ Fait — les 3 boutons de la modal (Ouvrir le livret, Annuler, CTA de validation) migrés sur `@/components/ui` `Button` ; radius de la `Modal` HeroUI aligné à 24px comme les autres modals. Le reste (image 3D, animation, structure du composant) non touché. `tsc --noEmit`, `npm run build`, `npm test` (50/50) verts.
- [x] **Phase 1 — Fondations (tokens + primitives)** — `tailwind.config.js`, `src/components/ui/{button,card,badge,avatar,index}.tsx`.
  ✅ Fait — tokens de forme (rayons `ds-sm/ds-md/ds-lg`, `shadow-pill`, `shadow-inset-border`, `duration-fast`) ajoutés à `tailwind.config.js` ; `Button` en pilule flat (sans ombre, `font-medium`, hauteurs 28/32/40/48/56) ; `Card` en rayon 24px + `shadow-inset-border` ; `Badge` en pilule à hauteur fixe (20/24/28) ; nouveau `src/components/ui/avatar.tsx` (cercle, initiales sur fond ink-900, `ring` or) exporté dans `index.ts`. API des composants inchangée (color/variant/size). `tsc --noEmit`, `npm run build`, `npm test` (50/50) verts.
- [x] **Phase 2 — Page Formation** — `formation/ClientPage.tsx` (cartes uniquement).
  ✅ Fait — cartes en `rounded-ds-lg` (24px) + `shadow-inset-border` + fond blanc (`bg-white`), zone image en `bg-content1` (stone-200, = surface-sunken du kit), padding texte passé à 20px (`p-5`), hover en léger lift (`-translate-y-0.5`) au lieu du changement de couleur de bordure.
- [x] **Phase 3 — Page Progression** — `progression/_components/EtapeProgressCard.tsx` (carte uniquement, `ProgressBar.tsx` intouché).
  ✅ Fait — `Card`/`CardBody` HeroUI remplacés par `@/components/ui` (`isHoverable`, padding par défaut du `Card` au lieu d'un `p-5` en double). La barre de progression circulaire à curseur flottant (`ProgressBar.tsx`) n'a **pas été touchée**, comme demandé.
  🔧 Correctif (retour user) — le fond blanc pur (`bg-white`) des cartes sur le fond crème de la page (`#F3F2E9`) donnait un effet "blanc sur blanc cassé" trop plat. Changé en `bg-default-100` (`#E8E7DE`, = `surface-muted` du kit, choix confirmé par le user) dans `src/components/ui/card.tsx` (variant `elevated`) et dans les cartes Formation (la zone image passe en `bg-content1`, plus foncée, pour rester distincte de la carte). Corrige Progression, Formation et Assignations d'un coup (composant partagé).
- [x] **Phase 4 — Admin : Assignations** (priorité, "catastrophe" côté style) — `admin/assignations/ClientPage.tsx`.
  ✅ Fait — grille de cartes migrée sur `@/components/ui` (`Card` variant `elevated` + `isHoverable`, `CardHeader/CardBody/CardFooter`, `Button`) ; `AvatarGroup` HeroUI remplacé par un groupe d'`Avatar` maison avec chevauchement (`-space-x-2`, anneau blanc) + pastille "+N". La modal (`AssignationModal.tsx`) n'a **pas** été touchée — elle attend la passe de cohérence des modals (Phase 5). `tsc --noEmit` et `npm run build` verts.
- [x] **Phase 5 — Modals : passe de cohérence** — inventaire de tous les `Modal*` HeroUI de l'admin, un seul style/structure (header/body/footer) partagé.
  ✅ Fait — nouveau `src/components/admin/FormModal.tsx` (wrapper partagé : header + footer Annuler/Submit avec le `Button` du design system, coins à 24px). Appliqué à `FormationModal`, `ObjectifModal`, `UserModal`, `EtapeModal` (garde son `size="3xl"`/`scrollBehavior="inside"`, contenu interne des tabs/objectifs pas touché — hors scope). `AssignationModal` (pattern différent, un seul bouton "Fermer") passe aussi au `Button` du design system + même radius 24px, sans wrapper partagé. `tsc --noEmit`, `npm run build`, `npm test` (50/50) verts.
- [x] **Phase 6 — Admin : reste des pages** — `admin/{formations,etapes,users}/*`.
  ✅ Fait — `formations/ClientPage.tsx` : grille de cartes migrée sur `Card`/`CardBody`/`Button` (`@/components/ui`), image en `bg-content1` sur carte `bg-default-100`, boutons éditer/supprimer en icônes `ghost`. `etapes/ClientPage.tsx` et `users/ClientPage.tsx` : bouton d'action principal + carte mobile (`isPressable` → `onClick`) migrés ; `Chip` de rôle → `Badge` ; `Avatar` HeroUI → `Avatar` du design system. **Limite connue** : les boutons de navigation utilisant `as={Link}` (ex. "Gérer les objectifs", "Gérer" sur mobile) restent en `Button` HeroUI — notre `Button` n'a pas encore de variante polymorphe (`as`/`href`), migration à faire si besoin plus tard. `AdminDataTable` (desktop) non touché — hors périmètre (Table). `tsc --noEmit`, `npm run build`, `npm test` (50/50) verts.

Chaque phase est lancée sur validation explicite, une par une.

**Hors périmètre pour l'instant** (à réactiver seulement si demandé) : sidebar/chrome global, Auth/Profil, Discussion/Référent, panneaux du dashboard.
