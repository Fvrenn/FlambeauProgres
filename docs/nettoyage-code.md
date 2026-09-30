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
- [ ] **Phase 2 — Simplifier les redondances internes** : R1 à R5.
- [ ] **Phase 3 — Extraire le réutilisable** : E1 à E5.
