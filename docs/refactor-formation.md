# 📋 Refactor — Formation globale (décorrélée des étapes)

> **Date :** 2026-06-17
> **Statut :** ✅ implémenté & vérifié (`tsc`, `build`, `test` OK ; migration appliquée)
> **Périmètre :** sortir les ressources de formation du périmètre « étape » pour en faire une page globale.

## Contexte & objectif

**Avant :** les `FormationCard` (titre + image + lien) étaient rattachées à une `Etape` via `etapeId`. L'admin les gérait dans la page détail d'étape (`/admin/etapes/[id]`), le chef les consultait dans un **3ᵉ onglet « Formation »** propre à chaque badge.

**Cible :** une **page formation globale**, décorrélée des étapes. Toutes les ressources « en vrac » (pas de catégories pour l'instant — le découpage par étape 1/2/3 + filtres viendra plus tard). L'admin a une page dédiée de CRUD ; le chef a une page unique listant tout. Même système modal / URL / URL d'image conservé. Les cartes existantes sont conservées (détachées de leur étape).

## Phases

- [x] **Phase 1 — Schéma & migration.** ✅ Fait — `FormationCard` perd `etapeId`, la relation `etape` et `@@index([etapeId])` ; `Etape` perd la relation `formations`. _Où :_ `prisma/schema.prisma`, migration `20260617134617_formation_globale` (DROP FK + DROP INDEX + DROP COLUMN ; les 2 lignes existantes sont conservées). _Comment :_ migration écrite à la main puis `prisma migrate deploy` (l'environnement non-interactif bloque le `migrate dev` à cause de l'avertissement de perte de données, voulue ici).
- [x] **Phase 2 — Service & actions.** ✅ Fait — `FormationService.create(data)` sans `etapeId` + nouveau `list()`. _Où :_ `src/services/formation.service.ts`. Actions `createFormation/updateFormation/deleteFormation` sans `etapeId`, revalidation de `/admin/formations` + `/formation`. _Où :_ `src/app/(app)/admin/_actions/admin.actions.ts`.
- [x] **Phase 3 — Admin.** ✅ Fait — nouvelle page `/admin/formations` (`page.tsx` + `ClientPage.tsx` + `_components/FormationModal.tsx` déplacé, sans `etapeId`) ; item sidebar « Formation » (`admin/layout.tsx`). Retrait de la section formation de `admin/etapes/[id]/{page,ClientPage}.tsx` ; ancien `admin/etapes/_components/FormationModal.tsx` supprimé.
- [x] **Phase 4 — Chef.** ✅ Fait — nouvelle page `/formation` (`(dashboard)/formation/{page,ClientPage}.tsx`) ; item sidebar « Formation » (`(dashboard)/layout.tsx`). Retrait de l'onglet « Formation » d'`ObjectifPanel.tsx` ; retrait de l'`include` `formations` dans `getDashboardEtapesForChef` (`src/services/etape.service.ts`) et du champ dans le type `EtapeAvecObjectifs` (`DashboardClient.tsx`).
- [x] **Phase 5 — Types & nettoyage.** ✅ Fait — `AdminEtapeDetail` supprimé (devenu identique à `AdminEtapeWithObjectifs`, désormais utilisé par la page détail d'étape). _Où :_ `src/types/index.ts`.

## Évolutions prévues (plus tard)

- Découpage des ressources par étape (1 / 2 / 3) + filtres par ressource spécifique → introduction de catégories (nouveau modèle + onglets côté chef).
- Entrée « Formation » dans la sidebar référent si besoin (aujourd'hui visible côté chef + admin).
