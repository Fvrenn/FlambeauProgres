# 🔥 Refactor — Parcours du Chef (Allume-feu → Étape 1 → 2 → 3)

> **Date :** 2026-06-19
> **Statut :** ✅ Phases 1 à 5 faites & vérifiées (`tsc`, `build`, 50 tests OK) — reste l'enrichissement listé en bas.
> **Périmètre :** introduire les **niveaux du Parcours du Chef** au-dessus des badges existants, avec déverrouillage progressif, jalons à lire + auto-validation, et contenu interactif réutilisable.

## Contexte & objectif

**Avant :** les `Etape` modélisent en réalité **les spécialités de l'Étape 2 « Progresser »** (seed : `2b` Branche PF, `2c` Branche F, `2e` Animation, `2f` Communication, `2g` Construction, `2h` Cuisine…). Il n'existe aucune notion de **niveau de parcours** ni de **déverrouillage progressif**. Un badge est validé par un référent → écrit `ChefEtapeStatut (statut = VALIDE)` via `EtapeService.validateBadge()`.

**Cible :** refléter le Parcours du Chef officiel (livret Allume-feu, p.15) sur **2 niveaux** :

- **Niveau parcours** : `0` Allume-feu → `1` Découvrir (Étape 1) → `2` Progresser (Étape 2) → `3` Servir (Étape 3).
- **À l'intérieur de l'Étape 2 (et 3)** : les badges/spécialités déjà existants.

Un chef qui arrive ne voit d'abord que l'**Allume-feu** (contenu à lire + auto-validation). Une fois validé, l'**Étape 1** apparaît (lecture + bouton « Je certifie que mon CG a validé mon Étape 1 »). Ce n'est qu'ensuite que les **badges de l'Étape 2** se débloquent.

## Décisions de modélisation

- **Pas de colonnes booléennes sur `User`** (`allumefeu`, `etape1`…). Ça dupliquerait `ChefEtapeStatut`, ne scalerait pas (migration par étape) et finirait désynchronisé. Le déverrouillage est une **règle calculée**, pas un état stocké.
- Deux champs ajoutés sur `Etape` :
  - `niveau Int` — `0` Allume-feu, `1` Découvrir, `2` Progresser, `3` Servir.
  - `type TypeEtape` — `JALON` (Allume-feu, Étape 1 : contenu à lire + auto-validation, 0 objectif) vs `BADGE` (spécialités : objectifs + validation référent).
- **Réutilisation de `ChefEtapeStatut`** pour l'état « validé par ce chef », jalons **et** badges. `valideeParId = null` = auto-déclaré par le chef ; renseigné = validé par un référent.
- **Règle de déverrouillage** : *le niveau `T` est accessible à un chef ⇔ tous les `JALON` de niveau `< T` sont `VALIDE` pour lui.*
  - Allume-feu (niv 0) : toujours visible.
  - Étape 1 (niv 1) : visible si Allume-feu VALIDE.
  - Badges Étape 2 (niv 2) : visibles si Allume-feu + Étape 1 VALIDE.
  - Étape 3 (niv 3) : idem, en cascade.

## Décisions UX

- **Dashboard préservé + mascotte cliquable.** Au stade jalon, la chemise et le reste du dashboard restent visibles ; sous la chemise, à la place des badges, la **mascotte Allume-feu**. Clic → **modal** avec un bouton « Ouvrir le livret (PDF) » ; la validation reste **bloquée tant que le livret n'a pas été ouvert**.
- **Aucun contenu à maintenir, pas de CRUD admin.** Le PDF officiel (`public/livrets/allumefeu-v1.pdf`) est la seule source. Pour l'Étape 1 « Découvrir » / l'Étape 3 « Servir », il suffira d'ajouter leur PDF.
- Icônes extraites du PDF (`pdfimages` + fusion du masque de transparence) : `mascotte.png` (flamme → Allume-feu) et `decouvrir.png` (faisceau de bois → Étape 1) dans `public/livrets/allumefeu/`. `JalonBadge` choisit l'icône selon le niveau du jalon. Le PDF s'ouvre dans un nouvel onglet depuis la modal.

## Phases

> Ordre des phases 4 et 5 inversé avec l'équipe : **flux visible d'abord** (intégration dashboard), **contenu riche du livret ensuite**.

- [x] **Phase 1 — Schéma & migration (additive).** ✅ Fait — enum `TypeEtape { JALON, BADGE }` ; `Etape.niveau Int @default(2)` + `Etape.type TypeEtape @default(BADGE)`. _Où :_ `prisma/schema.prisma`, migration `20260619192749_parcours_niveau_type` (`ADD COLUMN … NOT NULL DEFAULT` → backfill auto `niveau=2` / `type=BADGE` sur les badges existants, sans reseed). _Comment :_ `prisma migrate dev` (additif → pas de blocage perte de données, contrairement à la migration formation). `tsc` + `build` + 34 tests OK.
- [x] **Phase 2 — Règle de déverrouillage (service + tests).** ✅ Fait — règle de cascade en helpers purs + câblage service. _Où :_ `src/lib/parcours.ts` (`niveauMaxDebloque` / `etapeEstDebloquee`) ; `src/services/etape.service.ts` (`getDashboardEtapesForChef` et `getProgressForChef` exposent `verrouille` ; `getProgressForChef` expose aussi `niveau`). _Comment :_ plafond = `min` des niveaux des JALON non validés (`+∞` si tous validés) ; une étape est débloquée ⇔ `niveau ≤ plafond`. _Tests :_ `src/lib/parcours.test.ts` (10) + `src/services/etape.service.test.ts` (3, prisma mocké) → 47 tests OK ; `tsc` + `build` OK.
- [x] **Phase 3 — Jalons & auto-validation.** ✅ Fait — jalons **Allume-feu** (niv 0) + **Découvrir / Étape 1** (niv 1) seedés en `JALON` (sans objectif, `number` `"0"` / `"1"`). _Où :_ `prisma/seed.ts` ; `EtapeService.autoValiderJalon()` (`src/services/etape.service.ts`) → upsert `ChefEtapeStatut VALIDE`, `valideeParId = null`, **avec garde anti-triche** (le niveau de l'étape doit être débloqué) ; server action `validerJalon` (`src/actions/etape/etape.actions.ts`, `authorizeRole("CHEF")` + Zod, revalide `/` + `/progression`). Tri des étapes passé à `[{ niveau }, { ordre }]` (jalons avant badges). _Tests :_ +3 (non-jalon refusé, anti-triche Étape 1 avant Allume-feu, Allume-feu auto-déclaré) → 50 tests OK ; `tsc` + `build` OK ; jalons vérifiés en base.
- [x] **Phase 4 — Intégration dashboard & flux visible.** ✅ Fait — le dashboard chef affiche le parcours progressivement. _Où :_ `DashboardClient.tsx` branche vers `JalonView` (nouveau — `_component/JalonView.tsx`) tant qu'il reste un `JALON` débloqué non validé (Allume-feu, puis Étape 1) ; sinon la chemise/badges actuelle. `contentChemise.tsx` ne liste que les `BADGE`. Vue jalon = description + checklist d'engagement (Allume-feu) + lien livret PDF (`public/livrets/allumefeu-v1.pdf`) + bouton appelant `validerJalon` puis `router.refresh()`. `/progression` filtré aux `BADGE` (`type` exposé sur `EtapeProgressForChef`). _Comment :_ après validation, la cascade rouvre le niveau suivant automatiquement (Allume-feu → Étape 1 → badges). `tsc` + 50 tests + `build` OK.
- [x] **Phase 5 — Mascotte Allume-feu + modal (gate PDF).** ✅ Fait — le dashboard n'est plus remplacé : `DashboardClient` calcule le jalon courant et le passe à `ContentChemise`, qui affiche la mascotte (`JalonBadge`, `_component/JalonBadge.tsx`) à la place de la grille de badges. Clic → modal HeroUI : bouton « Ouvrir le livret (PDF) » (`window.open`) qui débloque le bouton de validation (`isDisabled` tant que le PDF n'est pas ouvert) → `validerJalon`. Mascotte extraite du PDF dans `public/livrets/allumefeu/mascotte.png`. Chaque jalon a son livret PDF (Allume-feu → `allumefeu-v1.pdf`, Étape 1 → `decouvrir-v11-2015.pdf`) et son icône, avec le **même gate** (validation bloquée tant que le PDF n'est pas ouvert) ; seul le libellé du bouton diffère (« je m'engage » / « je certifie »). Ancien `JalonView` plein écran supprimé. Approche retenue après essais successifs (accordéon → diaporama → multistep form → PDF inline). `tsc` + 50 tests + `build` OK.

## Évolutions prévues (plus tard)

- `/progression` : masquer ou griser les badges verrouillés (aujourd'hui filtrés aux `BADGE`, sans état « verrouillé »).
- Tracking de lecture des sections → barre de progression « vraie » du jalon.
- Contre-validation CG/référent des jalons (renseigner `valideeParId` a posteriori).
- Étape 3 « Servir » (Leader / Formateur / Expert) sur le même modèle.
- Dépôt direct sur la plateforme des réalisations déposées sur Flambeaux Progrès.
