# Refacto « code propre » et audit de sécurité

## Contexte

Mise en conformité du projet avec `GUIDE-CODE-PROPRE.md` et `CLAUDE.md`, plus un audit de sécurité
mené en même temps (état au 2026-09-28, commit `b0e4ccd`). Objectif : un projet propre, sûr et
rapide, **sans refonte inutile**. Chaque phase est indépendante, livrable seule, et se termine par
`npx tsc --noEmit`, `npm run build`, `npm test` et `npx eslint <fichiers touchés>`.

Les phases sont classées par priorité : sécurité d'abord, puis dette qui gêne l'évolution, puis
confort.

## Audit de sécurité

### À corriger

| # | Gravité | Constat | Où | Phase |
|---|---|---|---|---|
| S1 | **Haute** | Les pages admin ne vérifient pas le rôle elles-mêmes : seul le layout le fait. Or un layout n'est pas réexécuté à chaque navigation (Partial Rendering, voir `node_modules/next/dist/docs/01-app/02-guides/authentication.md`, § « Layouts »). Une requête RSC forgée vers `/admin/users` peut rendre la page sans passer par le contrôle : liste des utilisateurs (emails, rôles) exposée à un Chef connecté. | `admin/{dashboard, users, etapes, etapes/[id], assignations, formations}/page.tsx` | 1 |
| S1b | **Haute** | Côté référent : la page Révision charge les compétences d'un Chef avant tout contrôle (tout utilisateur connecté peut les lire), et le tableau de bord référent ne vérifie ni le rôle avant de charger, ni que le référent suit l'étape demandée (en changeant `etapeId` dans l'URL, il voit les soumissions des autres étapes). Trouvé pendant la phase 1. | `referent/{revision, dashboard}/page.tsx` | 1 |
| S2 | **Haute** | Dépendances vulnérables (`npm audit --omit=dev`) : `next` (critique), `nodemailer`, `sharp`, `postcss`, `nanoid` (hautes). Toutes corrigeables sans version majeure. | `package.json` | 2 |
| S3 | Moyenne | Un Chef peut soumettre, et donc auto-valider, une compétence d'une étape **verrouillée** en appelant l'action directement : `submitCompetence` / `submitRealisation` ne vérifient pas que l'étape est accessible (`etapeEstAccessible`), alors que l'écran la masque. | `services/justification.service.ts` | 1 |
| S4 | Moyenne | Contenu des justifications sans limite de taille (`z.string()`), alors que la discussion est limitée à 5000 caractères. Jusqu'à 10 Mo écrits en base par requête. | `actions/dashboard/{competence, realisation}.actions.ts` | 1 |
| S5 | Moyenne | Pas de Content-Security-Policy appliquée. | déjà planifié : `docs/csp-durcissement.md`, phases 3 et 4 | 6 |
| S6 | Faible | Des pages passent des objets Prisma complets au client (`admin/users` envoie toutes les colonnes `User`). Rien de secret aujourd'hui, mais tout champ ajouté plus tard partira au navigateur. | pages admin | 3 |

### À décider (règle métier, pas un bug)

- **Validation d'un badge sans objectifs complets.** `EtapeService.validateBadge` vérifie le droit du
  référent sur l'étape, mais pas que le Chef a rempli ses objectifs. À confirmer : est-ce voulu (le
  référent juge seul) ou faut-il bloquer ?
- **Pas de limite de fréquence** sur l'envoi de messages, qui déclenche des emails. Risque de spam
  par un utilisateur connecté. Acceptable tant que l'app reste interne ; à revoir si des abus
  apparaissent.

### Vérifié, rien à faire

- Toutes les Server Actions commencent par un contrôle d'identité et une validation Zod.
- Accès aux fichiers justificatifs (`/api/files/[id]`) : contrôle par `canAccessJustification`,
  `no-store`, `nosniff`, nom de fichier nettoyé. Upload : liste blanche de types et taille maximum,
  chemins protégés contre la remontée de dossier (`resolvePath`).
- Notifications et discussions limitées à leur propriétaire ou au référent assigné.
- Emails : toutes les données utilisateur passent par `escapeHtml`.
- Aucun secret versionné (`.env*` ignoré ; `seed-data.sql` ne contient que les étapes et objectifs).
- Pas de `dangerouslySetInnerHTML`. En-têtes HSTS, `nosniff`, `X-Frame-Options` en place.

## Écarts au guide de code propre

| Constat | Où |
|---|---|
| `prisma` appelé hors des services (7 pages + `admin.actions.ts`, 493 lignes) | voir le guide, § 1 « Écarts connus » |
| `ServiceResult` déclaré 3 fois, avec 2 formes différentes | `etape`, `justification`, `discussion.service.ts` |
| Erreurs d'action non affichées (`console.error` seul, `result.success` non lu) | `FormationModal`, `UserModal`, `admin/etapes/_components/ObjectifModal`, `AssignationModal`, suppression d'objectif |
| `alert()` / `confirm()` | `(dashboard)/…/ObjectifModal.tsx`, `admin/formations/ClientPage.tsx`, `admin/etapes/[id]/ClientPage.tsx` |
| `user: any` | `profil/ClientPage.tsx` |
| Convention dépréciée en Next 16 | `middleware.ts` → `proxy.ts` |
| Code mort | page `admin/objectifs` (placeholder), `session: null` dans `auth-server.ts`, dépendances `@heroui/{button, form, input, link}` jamais importées |
| Nom obsolète | `ReferentDashboardClientV2.tsx` (il n'y a pas de V1) |
| `CLAUDE.md` décrit better-auth, qui n'est plus utilisé (l'auth passe par la session WordPress) | `CLAUDE.md` |

## Phases

- [x] **Phase 1 — Contrôle d'accès et intégrité (S1, S1b, S3, S4)**
  - Ajouter dans `lib/auth-guards.ts` un garde de page qui redirige si le rôle manque (ex.
    `exigerRole(...roles)`), testé, et l'appeler en tête de **chaque** page admin et référent. Le
    layout garde son contrôle pour la navigation, mais ce n'est plus la seule barrière.
  - `JustificationService.submitCompetence` / `submitRealisation` : refuser une étape non accessible
    pour le Chef (réutiliser `etapeEstAccessible` de `lib/parcours.ts`), avec un test par cas.
  - Limiter `contenu` à 5000 caractères dans les deux actions, comme la discussion (une constante
    partagée).

  ✅ Fait — **quoi** : contrôle du rôle dans chaque page admin et référent, contrôle « suit
  l'étape » côté référent, refus des soumissions sur une étape verrouillée, limite de taille du
  texte. **Où** : `lib/auth-guards.ts` (`exigerRole`, `suitEtape`, et `canAccessJustification`
  réutilise la même règle interne `referentSuitEtape`), les 6 pages `admin/*/page.tsx`,
  `referent/{dashboard, revision, analyse}/page.tsx`, `lib/parcours.ts`
  (`construireContexteParcours`, qui remplace deux copies du calcul dans `EtapeService`),
  `EtapeService.estAccessiblePourChef`, `JustificationService`, `lib/justification.ts`
  (`LONGUEUR_MAX_CONTENU`, aussi en `maxLength` sur les zones de texte). **Comment** : le tableau
  de bord référent et la révision appliquent la règle déjà utilisée pour les discussions (assigné
  à l'étape, ou Commission / Coordinateur pour l'étape 3) ; un admin non assigné à une étape ne voit
  donc plus son tableau de bord, comme il ne voyait déjà pas ses discussions. Au passage,
  `submitRealisation` supprime le fichier téléversé quand la soumission est refusée (il restait
  orphelin sur le disque). Tests : `auth-guards`, `parcours`, `etape.service`,
  `justification.service`.

- [x] **Phase 2 — Dépendances (S2)**
  - `npm audit fix` (sans `--force`), puis build et test manuel rapide (connexion, upload, email).
  - Prisma : l'audit propose une version marquée « majeure » ; à traiter à part, après lecture du
    changelog.
  - Retirer `@heroui/button`, `@heroui/form`, `@heroui/input`, `@heroui/link` (jamais importés).

  ✅ Fait — **quoi** : `next` 16.2.4 → 16.3.6, `nodemailer` 9.0.5 → 9.1.1, `sharp` 0.35.3 → 0.35.5,
  override `postcss` → 8.5.28, `vitest` 4.1.11, `@gltf-transform/cli` 4.5.1, dépendances
  indirectes (`tar`, `js-yaml`, `brace-expansion`, `fflate`…) via `npm audit fix` ; 4 paquets
  `@heroui/*` retirés. **Où** : `package.json`, `package-lock.json`,
  `services/storage.service.ts`. **Comment** : `npm audit fix` plante en npm 10.9
  (`Cannot read properties of null (reading 'edgesOut')`) ; les mises à jour restantes ont été
  faites avec `npx npm@latest` (npm 12), puis `npx prisma generate` (npm 12 ne lance pas les
  scripts d'installation) ; le lockfile reste en format 3 et `npm ci` (npm 10, Dockerfile) passe.
  Next 16.3 signalait que les chemins dynamiques de `StorageService` faisaient embarquer tout le
  projet dans `.next/standalone` : `turbopackIgnore` ajouté, le standalone ne contient plus que
  `server.js`, `package.json` et `node_modules`. Vérifié : build, tests, serveur standalone
  (icône 200/404, redirection WordPress sans session).
  **Risque accepté** : la faille `deepmerge-ts` (via `@prisma/config`) touche toutes les versions
  jusqu'à Prisma 8.1 ; le seul « correctif » proposé est de redescendre en 6.12. Ce code ne sert
  qu'au chargement de la config de la CLI Prisma (migrations, `generate`), jamais à des données
  utilisateur. À revoir à la prochaine version de Prisma.

- [x] **Phase 3 — Accès aux données dans les services (S6)**
  - Déplacer la logique Prisma de `admin.actions.ts` dans des services (`EtapeService` ou un
    `etape-admin.service.ts`, `UserService`, `AssignationService`, `ObjectifService`), avec tests.
    Les actions ne gardent que : garde → Zod → service → `revalidatePath`.
  - Pages admin et référent : charger via ces services avec un `select` ciblé (ce que l'écran
    affiche, rien de plus). Lectures indépendantes en `Promise.all` (le tableau de bord référent
    enchaîne 4 requêtes l'une après l'autre).
  - Un seul `ServiceResult` partagé (`src/types`), utilisé par tous les services.

  ✅ Fait — **quoi** : plus aucun `prisma` hors de `services/` et `lib/` ; actions admin découpées
  par domaine ; `select` ciblés là où des données personnelles partaient au navigateur ; requête
  N+1 du tableau de bord référent supprimée ; un seul `ServiceResult`. **Où** : nouveaux services
  `user`, `assignation`, `objectif`, `etape-admin`, `admin-dashboard`, `referent`, `fichier`
  (chacun avec son `.test.ts`) ; `admin/_actions/admin.actions.ts` (493 lignes) remplacé par
  `{user, assignation, etape, objectif, formation}.actions.ts` + `schemas.ts` ; pages admin,
  `referent/{dashboard, revision}/page.tsx`, `api/files/[id]/route.ts` ; `src/types`
  (`UserResume`, `ServiceResult`) ; `lib/justification.ts` (`chefsAyantToutValide`, testée) ;
  `StorageService.read` (partagé par la route des fichiers et les icônes). **Comment** : la page
  Utilisateurs, la liste des référents, les Chefs du tableau de bord référent et de la révision
  ne reçoivent plus que `USER_RESUME_SELECT` (id, nom, email, avatar, rôle) au lieu de toutes les
  colonnes `User` (identifiant WordPress, dates de synchronisation…). Le tableau de bord référent
  faisait 2 requêtes de comptage par Chef, l'une après l'autre : il fait maintenant toutes ses
  lectures en parallèle, plus au plus une requête pour les Chefs à réviser. `ServiceResult` prend
  la forme en union discriminée de la discussion (`error` n'existe que si `success` est faux).

- [x] **Phase 4 — Erreurs visibles, plus de `alert` / `confirm`**
  - Les modals admin et la suppression d'objectif lisent `result.success` et affichent
    `result.error` (message dans le composant ou `addToast`).
  - Remplacer `confirm()` par une confirmation en popover (modèle : `ValidateRealisation.tsx`) et
    `alert()` par un message dans `ObjectifModal`.
  - Typer `user` dans `profil/ClientPage.tsx` (`SessionUser`).

  ✅ Fait — **quoi** : toutes les actions admin affichent leur erreur, plus aucun `alert()`,
  `confirm()` ni `any`. **Où** : `components/admin/FormModal.tsx` (prop `erreur`, utilisée par
  `EtapeModal`, `ObjectifModal`, `FormationModal`, `UserModal`), `AssignationModal.tsx` (message +
  retour arrière de la case cochée en cas d'échec), nouveau `components/ui/confirm-popover.tsx`
  (`ConfirmPopover`, erreur affichée dans le popover) pour la suppression d'une formation et d'un
  objectif, `(dashboard)/…/ObjectifModal.tsx` (message dans la modal), `profil/ClientPage.tsx`
  (`ProfilUser`). **Comment** : les modals passent à `useTransition` et lisent `result.success` ;
  `router.refresh()` retiré là où l'action revalide déjà la page. Au passage : les actions
  compétence / réalisation revalidaient `/dashboard`, une route qui n'existe pas (le tableau de
  bord est `/`) ; corrigé. `renderCell` de `admin/etapes/[id]` n'est plus un `useCallback` (il
  n'était pas mémoïsable et levait un avertissement `exhaustive-deps`). `ConfirmPopover` vérifié
  au clic dans un navigateur (déclencheur `Button` et `<button>`, succès et échec).

- [x] **Phase 5 — Conventions Next 16 et nettoyage**
  - Renommer `middleware.ts` en `proxy.ts` (voir `03-file-conventions/proxy.md` dans la doc
    installée), vérifier que le matcher et la redirection vers WordPress fonctionnent toujours.
  - Supprimer la page `admin/objectifs`, `session: null`, renommer `ReferentDashboardClientV2` en
    `ReferentDashboardClient`.
  - Mettre à jour `CLAUDE.md` (auth WordPress, lien vers `GUIDE-CODE-PROPRE.md`).

  ✅ Fait — **quoi** : `middleware.ts` → `src/proxy.ts` (fonction `proxy`), code mort supprimé,
  `CLAUDE.md` à jour. **Où** : `src/proxy.ts` ; page `admin/objectifs` supprimée ;
  `lib/auth-server.ts` (`getUser` est directement la fonction mise en cache, sans l'objet
  `{ session: null, user }` hérité de better-auth) ; `ReferentDashboardClientV2` →
  `ReferentDashboardClient` ; `eslint-config-next` retiré (jamais référencé par
  `eslint.config.mjs`) ; 3 exports internes de `lib/public-url.ts` redevenus privés ; `CLAUDE.md`,
  `GUIDE-CODE-PROPRE.md`, `docs/csp-durcissement.md`. **Comment** : **le proxy doit être dans
  `src/`**, au niveau de `app/` : placé à la racine, Next 16.3 l'ignore sans erreur (plus de ligne
  « Proxy » dans le build, plus de `redirect_to` vers WordPress). Vérifié sur le serveur
  standalone : redirection avec `redirect_to` pour `/` et `/admin/users`, icônes toujours
  exclues. Recherche de code mort avec `npx knip` : les autres signalements sont des faux
  positifs (script `seed`, `check-env.mjs` du Dockerfile, décodeur Draco chargé par URL, `sharp`
  pour `next/image`, `@gltf-transform/cli` du script `glb:optimize`).

- [ ] **Phase 6 — CSP (S5)**
  - Terminer les phases 3 et 4 de `docs/csp-durcissement.md`. Rien à ajouter ici : ce doc fait foi.

  ⏳ En cours — phase 3 de `docs/csp-durcissement.md` faite (CSP en `Report-Only` contenant la
  politique finale, vérifiée sans violation en mode bloquant dans Chrome). Reste la phase 4 :
  passer `CSP_BLOQUANTE` à `true` après observation des rapports GlitchTip en production.

## Hors périmètre (volontairement)

- Découper les fichiers qui dépassent un peu les seuils du guide mais restent lisibles
  (`sidebar.tsx`, `button.tsx`, `JournalTable.tsx`) : à faire par la règle du boy-scout quand on y
  touche, pas en refacto dédiée.
- ~~Mise en cache de la session WordPress entre requêtes~~ : ✅ fait ensuite à la demande —
  `lib/wordpress-auth.ts` (`getSessionWp`) garde la réponse de WordPress 60 s en mémoire, par
  empreinte SHA-256 des cookies de session (`lib/cache-memoire.ts`, testé). Seules les réponses
  valides sont gardées ; la lecture avant écriture de la progression (`fetchWpProgression`) reste
  en direct ; l'entrée est oubliée après une écriture de progression et à la déconnexion.
  Contrepartie assumée : une session invalidée côté WordPress (expiration, mot de passe changé)
  reste acceptée par l'app au plus 60 s. Les rôles, en base, ne sont pas concernés.