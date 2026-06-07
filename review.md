# Code review — Page Progression (chef)

**Date :** 2026-06-06
**Branche :** `refactor/discussion`
**Effort :** max (recall)

## Périmètre

Changements de la session (feature Progression) :

- **Nouveaux fichiers**
  - `src/lib/color.ts`
  - `src/app/(app)/(dashboard)/progression/page.tsx`
  - `src/app/(app)/(dashboard)/progression/_components/ProgressBar.tsx`
  - `src/app/(app)/(dashboard)/progression/_components/EtapeProgressCard.tsx`
- **Modifiés**
  - `src/app/(app)/(dashboard)/layout.tsx` (ajout item sidebar « Progression »)
  - `src/app/(app)/(dashboard)/_component/contentAction/panels/ObjectifPanel.tsx` (extraction de `getReadableTextColor` vers `@/lib/color`)

> Hors périmètre : les changements non commités préexistants (vars CSS `--etape-color` dans `ObjectifPanel`, `danger-800`→`var`, et le fix `href: "/"` dans `layout.tsx`).

## Verdict

Le calcul de progression est **correct** (`done` = justifications validées par `etapeId`, dénominateur = nombre d'objectifs ; `done ≤ total` garanti par la contrainte `unique(chefId, objectifId)` + cascade delete). **Aucun crash.** Les problèmes réels sont dans la **couche d'affichage** + quelques points de convention/cleanup.

Candidat réfuté (écarté) : « `done > total` via `etapeId` périmé » — `updateObjectif` ne modifie jamais `etapeId`, et `objectif → justifications` est en cascade, donc `done ≤ total` tient.

## Récapitulatif

| # | Sév. | Fichier:ligne | Problème |
|---|------|---------------|----------|
| 1 | Moyen | `ProgressBar.tsx:40` | `MIN_FILL` 5.5rem → les faibles % paraissent ~40 % pleins |
| 2 | Faible-Moyen | `ProgressBar.tsx:57` | « Complété » basé sur le `pct` arrondi, pas sur `done === total` |
| 3 | Faible | `page.tsx:47` | Arrondi : un progrès non nul peut afficher 0 % |
| 4 | Moyen | `page.tsx:30` | Logique métier + règle « validé » inline dans la page (≠ `src/services/`) |
| 5 | Faible | `ProgressBar.tsx:30` | `role=progressbar` sans nom accessible si aucun label |
| 6 | Faible | `ProgressBar.tsx:22` | Animation au montage → barres à `MIN_FILL` en SSR / sans JS |
| 7 | Faible | `EtapeProgressCard.tsx:29` | Concat alpha `${color}1A` suppose un hex 6 chiffres |
| 8 | Faible | `ProgressBar.tsx:63` | `transition-all` sur le segment vide n'anime rien (mort) |
| 9 | Faible | `ProgressBar.tsx:70` | 80 `<div>` pour les hachures (~960 nœuds) — *choix assumé* |
| 10 | Faible | `page.tsx:52` | `#FCC226` dupliqué dans 4 fichiers |
| 11 | Faible | `EtapeProgressCard.tsx:25` | `<div>` fait main au lieu de HeroUI `<Card>` |

## Détail

### 1. `MIN_FILL` gonfle les faibles pourcentages — `ProgressBar.tsx:40`
`width = max(pct%, 5.5rem)`. Sur `xl:grid-cols-4`, une carte fait ~210px de piste après `p-5` ; 5.5rem = 88px ≈ **42 %** de la piste. Une étape à 5 % (voire 0 %) rend un remplissage ~42 % large, **visuellement identique** à une vraie étape à 42 %. Impacte toutes les étapes < ~42 % avec les données actuelles.
**Cause :** la pastille `%` est *à l'intérieur* du remplissage, qui doit donc être assez large pour la contenir.
**Piste de fix :** superposer la pastille (overlay) plutôt qu'à l'intérieur, ou réduire le minimum.

### 2. « Complété » basé sur le `pct` arrondi — `ProgressBar.tsx:57`
Le visuel « plein » (pas de hachures, pilule pleine) dépend de `pct < 100`, pas de `done === total`.
**Scénario :** `page.tsx:47` fait `Math.round((done/total)*100)`. `total=200, done=199` → `round(99.5)=100` → la barre montre 100 % sans hachures, alors que la carte affiche « 199/200 objectifs validés ». Précondition ≥ ~200 objectifs/étape (le seed en a ~10, donc latent), mais le flag de complétude devrait se baser sur `done === total`.

### 3. Arrondi perdant côté bas — `page.tsx:47`
`total=300, done=1` → `0.333` → `round = 0` → affiche « 0 % » pour une étape ayant un objectif validé. Même précondition (~200 objectifs) que #2.

### 4. Logique métier inline dans la page — `page.tsx:30`
Le calcul de progression et la règle « validé = `AUTO_VALIDEE | VALIDEE` » vivent dans la page, dupliquant la règle du dashboard référent (`(referent)/referent/dashboard/page.tsx:48`) et contournant la convention `src/services/` (cf. `CLAUDE.md`).
**Risque :** si la définition de « complété » change, les deux endroits peuvent diverger, sans test.
**Piste de fix :** un helper `getEtapeProgressForChef(userId)` dans un service réutilisé par les deux vues.

### 5. Pas de nom accessible — `ProgressBar.tsx:30`
`aria-label={ariaLabel ?? label}` → `undefined` si les deux sont absents. Latent (la carte passe toujours `ariaLabel`), mais un futur `<ProgressBar percentage={x} />` produit un `role=progressbar` sans nom (échec WCAG 4.1.2 / axe). Donner un nom par défaut (ex. `Progression ${pct}%`).

### 6. Animation au montage (SSR / sans JS) — `ProgressBar.tsx:22`
`show=false` au rendu serveur et au premier rendu client → `width=MIN_FILL` ; l'effet bascule après hydratation. Saut visible de 88px vers la vraie largeur à chaque chargement, et **sans JS toutes les barres restent au minimum**. Une entrée en CSS pur (keyframe) éviterait le double rendu et la dépendance au JS.

### 7. Concat alpha suppose un hex 6 chiffres — `EtapeProgressCard.tsx:29`
`${color}1A`, `${color}33`, et côté `ProgressBar` `border`/stripes. `couleur` est nullable et seules les valeurs saisies par l'admin sont validées par regex. Une valeur 3 chiffres (`#FC0`) ou nommée → `#FC01A` invalide → halo/bordure transparents silencieusement. Centraliser dans un util couleur gérant l'alpha.

### 8. Transition morte — `ProgressBar.tsx:63`
`transition-all duration-300` sur le segment vide : il est monté/démonté (`pct < 100`), pas transitionné → la classe n'anime rien. À retirer.

### 9. 80 `<div>` pour les hachures — `ProgressBar.tsx:70`
80 nœuds par barre incomplète × ~12 étapes (~960 nœuds) pour une texture statique qu'un seul `repeating-linear-gradient` dessine sans enfant.
**Note :** c'est le design que tu as explicitement demandé de conserver (ta barre d'origine) — coût signalé, **pas** une reco de changement sauf si tu le souhaites.

### 10. `#FCC226` dupliqué — `page.tsx:52`
Codé en dur ici + défaut de `ProgressBar` + `ObjectifPanel` + admin `ClientPage`. `ProgressBar` ayant déjà ce défaut, le `?? "#FCC226"` de la page est en partie redondant. Exporter un `DEFAULT_ETAPE_COLOR` (ex. depuis `src/lib/color.ts`).

### 11. Carte faite main vs HeroUI — `EtapeProgressCard.tsx:25`
`<div className="rounded-large border border-default-200 bg-content1 ...">` alors que le reste de l'app utilise `<Card>/<CardBody>`. Le theming bespoke ne suivra pas les évolutions du thème HeroUI. Utiliser `<Card><CardBody>` en gardant les styles inline du badge/ombre.

## Priorités

- **#1 (`MIN_FILL`)** : seul qui trompe l'utilisateur *aujourd'hui*.
- **#2 / #3 (arrondi)** : latents (grosses étapes) mais la complétude devrait se baser sur `done === total`.
- **#4 (logique → `src/services/`)** : ce que demande ton propre `CLAUDE.md`.
