# Nettoyage du code : inutile, redondances, réutilisation

## Contexte

Passe de nettoyage demandée en septembre 2026, dans l'ordre : retirer ce qui ne sert pas, simplifier
ce qui se répète dans un même fichier, puis extraire ce qui est copié entre plusieurs fichiers. Les
règles appliquées sont celles de `GUIDE-CODE-PROPRE.md`, en particulier « une règle métier = un seul
endroit » et sa nuance : deux codes qui se ressemblent par hasard restent séparés.

## Audit (30/09/2026)

Outils lancés sans les installer dans le projet : `npx knip@5` (fichiers, exports et dépendances
inutilisés), `npx jscpd@4 src --min-lines 5 --min-tokens 50` (blocs copiés), et
`npx tsc --noEmit --noUnusedLocals --noUnusedParameters`.

Déjà propre : aucun commentaire explicatif, `console.log`, `any` ni `TODO` dans `src/`, aucun
fichier de `src/` inutilisé.

Faux positifs de `knip`, à ne pas supprimer :

| Signalé                                                  | Pourquoi il reste                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `prisma/seed.ts`, `scripts/check-env.mjs`                | appelés par `package.json#prisma.seed` et le `CMD` du `Dockerfile`                    |
| `public/draco/draco_wasm_wrapper.js`                     | chargé à l'exécution par le décodeur Draco de la chemise                              |
| `sharp`                                                  | utilisé par Next pour optimiser les images en production                              |
| `@gltf-transform/cli`                                    | `scripts/optimize-glb.sh`                                                             |
| `@next/eslint-plugin-next`, `eslint-plugin-react-hooks`  | `eslint.config.mjs`                                                                   |
| `@react-types/shared`                                    | augmentation de module dans `src/app/providers.tsx`                                   |
| Images de `public/etapes/`, aperçus de `public/chemise/` | chemins stockés en base (seed, migrations) ou construits dans `lib/apercu-chemise.ts` |
| paramètre `request` de `api/files/[id]/route.ts`         | signature imposée par Next pour lire `params` en 2ᵉ argument                          |

Duplications retenues (même règle ou même mécanique, pas une ressemblance) :

| #   | Où                                                                                                                          | Quoi                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| R1  | `app/(app)/AppClientLayout.tsx`                                                                                             | 3 sidebars identiques, seule la largeur et le point de rupture changent |
| R2  | `components/application/sidebar/sidebar.tsx`                                                                                | icône compacte avec tooltip écrite deux fois                            |
| R3  | `services/discussion.service.ts`                                                                                            | même chargement de justification (include) deux fois                    |
| R4  | `services/etape.service.ts`                                                                                                 | chargement « étapes + statuts validés du chef » répété                  |
| R5  | `services/justification.service.ts`                                                                                         | contrôles communs d'une soumission (accès, texte requis)                |
| E1  | `actions/dashboard/realisation.actions.ts`, `actions/discussion/discussion.actions.ts`                                      | upload d'un fichier de justification (26 lignes identiques)             |
| E2  | `app/(app)/profil/layout.tsx`, `app/(app)/signaler-un-bug/layout.tsx`                                                       | layout identique au nom près                                            |
| E3  | `admin/dashboard/page.tsx`, `referent/dashboard/ReferentDashboardClient.tsx`, `referent/analyse/_components/KpiBandeau.tsx` | carte de statistique (icône, valeur, libellé)                           |
| E4  | `components/application/referent/ChefsAReviserList.tsx`, `referent/dashboard/_components/panels/JustificationsPanel.tsx`    | cellule « chef » (avatar, nom, email) et bouton d'ouverture de ligne    |
| E5  | `admin/etapes/_components/{EtapeModal,ObjectifModal}.tsx`, `admin/formations/_components/FormationModal.tsx`                | soumission d'une modal admin (transition, erreur, fermeture)            |

Écartées volontairement : les variantes `tailwind-variants` de `ui/badge.tsx` et `ui/button.tsx`
(deux composants distincts qui évolueront séparément), les props proches de `ContentAction` et
`ContentChemise`, et les deux actions de `admin/_actions/assignation.actions.ts` (le guide impose
`authorizeRole` + `safeParse` en tête de chaque action).

## Phases

- [x] **Phase 1 — Retirer l'inutile** : imports `React` inutiles (runtime JSX automatique),
      `export` des types et constantes utilisés seulement dans leur fichier, dépendance
      `@iconify/types` déclarée.
      ✅ Fait — **quoi** : 29 imports `React` retirés (`"jsx": "react-jsx"` n'en a pas besoin), 27
      `export` retirés (types de `lib/` et `services/`, `ProvidersProps`, `ListeJustifications`,
      `CSP_BLOQUANTE`), `@iconify/types` ajouté aux `devDependencies` (importé par
      `lib/icons.generated.ts`). **Où** : 49 fichiers de `src/`, `package.json`. **Comment** :
      liste tirée de `tsc --noUnusedLocals` et de `knip`, qui ne signale plus que les faux positifs
      ci-dessus. Vérifié : `tsc`, `eslint`, 279 tests, `next build`.
- [x] **Phase 2 — Simplifier les redondances internes** : R1 à R5.
      ✅ Fait —
      **R1** `AppClientLayout.tsx` : les sidebars `lg` et `xl` ne différaient que par la largeur,
      fusionnées (`w-60 xl:w-72`) ; les deux sidebars fixes restantes (compacte, complète) sont
      décrites par `SIDEBARS_FIXES` et leurs props communes écrites une fois (`contenuSidebar`).
      **R2** `sidebar.tsx` : `renderIcone` et `renderIconeCompacte` remplacent 4 copies de
      l'icône et 2 du tooltip compact ; classe parasite `test` retirée.
      **R3** `discussion.service.ts` : requête commune `getJustificationANotifier` ; le statut
      « validée » passe par `estJustificationValidee` (`lib/justification.ts`, testée), aussi
      utilisée par `useDiscussionThread.ts` qui recopiait la liste en dur.
      **R4** `etape.service.ts` : `getValidationsDuChef` (étapes validées + origine) remplace 4
      lectures de `chefEtapeStatut`, `enregistrerValidation` les 2 `upsert` « VALIDE / APP » ;
      `autoValiderJalon` ne relit plus l'étape à part (elle est dans la liste chargée).
      **R5** `justification.service.ts` : `preparerSoumission` porte les contrôles communs à
      `submitCompetence` et `submitRealisation` (objectif, type, étape débloquée, texte requis).
      **Comment** : comportement inchangé, tests existants conservés (mocks `etape.findUnique`
      devenus inutiles retirés de `autoValiderJalon`), tests ajoutés pour
      `estJustificationValidee` et le refus d'un objectif qui n'est pas une réalisation.
      Vérifié : `tsc`, `eslint`, 282 tests, `next build` ; `jscpd` passe de 17 à 12 clones.
- [x] **Phase 3 — Extraire le réutilisable** : E1 à E5.
      ✅ Fait —
      **E1** `DiscussionService.stockerPieceJointe` (`services/discussion.service.ts`, testée) :
      stocke le fichier d'une justification et renvoie son `FichierData` ; les actions
      `submitRealisation` et `postMessage` l'appellent au lieu de recopier l'upload.
      **E2** groupe de routes `app/(app)/(compte)/` : `profil` et `signaler-un-bug` y sont
      déplacés sous un seul `layout.tsx` (`CompteLayout`) ; URL inchangées.
      **E3** `components/ui/stat-card.tsx` (`StatCard`, props `tone`, `hint`, `onSelect`) remplace
      les cartes du dashboard admin, du dashboard référent et de `KpiBandeau` ; les couleurs en dur
      du référent (`#a67300`, `#127f51`) deviennent les tokens `warning-700` / `success-700`
      (mêmes valeurs).
      **E4** `components/admin/CelluleUtilisateur.tsx` (avatar, nom, email : 3 tableaux, dont
      `admin/users`) et `components/admin/BoutonOuvrirLigne.tsx` (flèche d'ouverture qui ne
      déclenche pas le clic de ligne : 2 tableaux).
      **E5** `components/admin/useSoumissionModal.ts` : transition, erreur affichée et fermeture
      en cas de succès, pour `EtapeModal`, `ObjectifModal`, `FormationModal` et `UserModal`.
      `AssignationModal` reste à part (mise à jour optimiste, sans fermeture).
      **En plus** : `etape.service.ts` `getParcoursDuChef` (dernier chargement répété de la
      phase 2) ; `analytics.service.ts` : filtre, champs lus et construction d'un événement
      (`toEvenement`) communs aux réalisations et aux badges, après un test de caractérisation
      (`analytics.service.test.ts`, le service n'en avait pas) ; `lib/icons.ts` reformaté.
      Guide mis à jour (§1, composants partagés et erreur d'action admin).
      **Comment** : vérifié par `tsc`, `eslint src` (0 avertissement), 287 tests, `next build`
      (`/profil` et `/signaler-un-bug` toujours servies) ; `jscpd` : 17 → 3 clones, les trois
      écartés volontairement ci-dessus.
