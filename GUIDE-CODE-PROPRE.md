# Guide de code propre — Flambeaux Progrès

Objectif : un code **facile à maintenir, à faire évoluer et à compléter**, y compris par quelqu'un qui n'est pas expert en développement web, et quel que soit l'auteur (humain ou IA). Ce document fixe les règles ; l'avancement des refactors et les décisions métier sont dans `docs/*.md`, les commandes et procédures (migrations, déploiement) dans `README.md` et `CLAUDE.md`.

---

## 1. Sources de vérité et code de référence

### Next.js 16 / React 19
- **La doc livrée avec le paquet fait foi** : `node_modules/next/dist/docs/` (version exacte installée, 16.2.x), puis les typings de `node_modules/next` et `node_modules/react`. Pour Prisma, HeroUI, Zod, react-hook-form : leur doc officielle à la version du `package.json`.
- **Jamais la mémoire** : une API, une option ou un comportement Next / React se vérifie avant d'être utilisé. Next change beaucoup entre versions majeures (ex. en v16, `middleware` est déprécié et renommé `proxy` : `01-app/03-api-reference/03-file-conventions/proxy.md`).

### Le code à imiter
| Sujet | Fichiers (sous `src/`) |
|---|---|
| Server Action | `actions/profil/progression.actions.ts`, `actions/etape/etape.actions.ts` (`validerJalon`) |
| Service (logique métier + Prisma) | `services/etape.service.ts` (+ `.test.ts`), `services/formation.service.ts` (CRUD simple) |
| Contrôle d'accès | `lib/auth-guards.ts` (+ `.test.ts`), `lib/roles.ts` (+ `.test.ts`) |
| Fonctions pures métier | `lib/parcours.ts` (+ `.test.ts`), `lib/wp-redirect.ts` (+ `.test.ts`) |
| Page serveur → composant client | `app/(app)/(compte)/profil/page.tsx` → `ClientPage.tsx` |
| Action côté client (transition + message) | `app/(app)/(compte)/profil/_components/ProgressionPlateforme.tsx` |
| Confirmation d'une action | `components/ui/confirm-popover.tsx` (`ConfirmPopover`, jamais `confirm()`) |
| Erreur d'une action dans un formulaire admin | `components/admin/FormModal.tsx` (prop `erreur`) + `components/admin/useSoumissionModal.ts`, utilisés par `admin/formations/_components/FormationModal.tsx` |
| Composants partagés | `components/ui/*` (via `@/components/ui`, dont `StatCard`), `components/admin/{FormModal, AdminDataTable, CelluleUtilisateur, BoutonOuvrirLigne}.tsx` |

**Écarts connus dans le code, à ne pas imiter** : aucun à ce jour, le refacto de septembre 2026 les a tous traités (`docs/refacto-code-propre.md`). En relever un ici quand on en repère un qu'on ne corrige pas tout de suite.

---

## 2. Les principes

### Un fichier = une responsabilité
Un fichier fait **une seule chose**. Si on doit utiliser « et » pour décrire ce qu'il fait, il faut le découper.
- ✅ `lib/parcours.ts` calcule les règles de déblocage du parcours (fonctions pures, testées).
- ✅ `lib/auth-guards.ts` dit qui a le droit de faire quoi.
- ❌ une Server Action qui vérifie les droits **et** écrit en base **et** calcule le déblocage **et** envoie un email.

### Une règle métier = un seul endroit
Une même logique (rôles autorisés, déblocage d'une étape, statut validé d'une justification…) n'est **jamais copiée** : on crée une fonction et on l'appelle. Une copie finit toujours par diverger.

**Nuance : même règle métier ≠ ressemblance par hasard.** On factorise une *même règle* (`estReferent`, `STATUTS_VALIDES`). Deux codes qui se ressemblent mais représentent des choses différentes restent séparés, sinon l'abstraction devra se tordre dès que l'un des deux évolue.

### On écrit une fois, on appelle partout
La mécanique (session utilisateur, contrôle de rôle, client Prisma, URL publique) est écrite **une seule fois** : `getUser()`, `authorizeRole()`, `prisma`, `urlPublique()`. Une nouvelle action tient en quelques lignes lisibles et typées.

### Simple avant « malin »
Pas d'abstraction sans **au moins deux usages réels**. Pas de classe là où une fonction suffit, pas de hook custom pour un seul composant, pas de contexte React pour passer une prop sur deux niveaux.

---

## 3. Règles Clean Code appliquées à Next / React

Tirées de *Clean Code* (R. C. Martin), traduites pour TypeScript / Next.

### 3.1 Commentaires
**Pas de commentaire explicatif dans le code.** Un commentaire n'est pas vérifié par le compilateur : quand le code bouge, il ment. Avant d'en vouloir un : renommer, extraire une fonction, nommer une variable ou une constante, écrire un test qui porte le cas.

**✅ Seules exceptions : les directives fonctionnelles**
- `eslint-disable*`, `@ts-expect-error`, `prettier-ignore`, `turbopackIgnore`.
- Toujours avec leur **raison après `--`**, c'est le seul endroit où un *pourquoi* vit dans le code :
  `// eslint-disable-next-line @next/next/no-img-element -- file served by the authenticated /api/files/[id] route (no-store); next/image would refetch it without the session and get a 403`

**Où va le *pourquoi* d'une décision non évidente** (contrainte WordPress, règle du livret…) : dans le nom (`suitEtapeSansAssignation`), dans un test (`it("ne débloque pas l'étape 3 sans spécialité validée")`), ou dans `docs/*.md` quand il faut un paragraphe.

**❌ À supprimer**
| Type | Exemple | À faire |
|---|---|---|
| Redondant | `// Récupère l'utilisateur`, `// Handle submit` | supprimer |
| Bannière | `// ===== Filtres =====` | supprimer ; si le fichier en a besoin, il est trop gros → le découper |
| Code commenté (TS ou JSX) | `{/* <OldPanel /> */}` | supprimer : git le garde |
| Paraphrase du JSX | `{/* Header */}` au-dessus du header | supprimer ou extraire un sous-composant bien nommé |
| Journal, auteur, date | `// modifié par X le …` | supprimer : c'est le rôle de git |
| `TODO` | `// TODO: gérer l'erreur` | le faire, ou le noter dans `docs/*.md` |

### 3.2 Nommage
- **Le vocabulaire métier est en français et ne se traduit jamais** : `etape`, `jalon`, `objectif`, `justification`, `chef`, `referent`, `niveau`, `parcours` (pas `step`, `milestone`). Le mot du code = le mot du schéma Prisma = le mot de l'écran.
- **Une langue par fichier pour le reste** : suivre les voisins (`lib/` et composants métier en français, services en anglais pour les verbes CRUD : `list`, `create`, `update`, `remove`). On ne mélange pas `estValide` et `isValid` dans le même fichier.
- **Le nom dit l'intention et l'unité** : `dureeMs`, `niveauMax`, `tailleMaxOctets` ; pas `d`, `tmp`, `data2`.
- **Un mot par concept, partout** :
  | Préfixe / suffixe | Sens | Exemple |
  |---|---|---|
  | `get…` | renvoie une valeur, **sans effet de bord** | `getUser`, `getProgressForChef` |
  | `est… / a… / peut…` (ou `is… / has… / can…` dans un fichier anglais) | booléen, formulé **au positif** | `estReferent`, `peutValiderEtape`, `aChange`, `isPending` |
  | `handle…` | gestionnaire d'événement défini dans un composant | `handleCreate`, `handleDelete` |
  | `on…` | prop qui reçoit un gestionnaire | `onClose`, `onValidate` |
  | `to… / build…` | convertit / construit une forme (fonction pure) | `buildWpLoginUrl` |
  | `…Schema` | schéma Zod | `validerJalonSchema`, `formationSchema` |
  | `…Input` / `…FormData` | données entrantes d'un service / d'un formulaire | `FormationInput`, `FormationFormData` |
  | `…Props` | props d'un composant | `FormationModalProps` |
  | `…Service` | classe de `src/services/` | `EtapeService` |
- **Chargement / envoi** : `isPending` (issu de `useTransition` ou d'un state), pas `loading`.
- **Pas de mots vides** (`Data` seul, `Info`, `Manager`, `Helper`), **pas d'encodage** (`_champ`, `IInterface`).
- **Pas de valeur magique** : une constante nommée déclarée une fois (`NIVEAU_ETAPE_3`, `ROLES_ADMIN`) ; un ensemble fixe de valeurs → l'`enum` Prisma (`UserRole`, `TypeEtape`), jamais la chaîne brute retapée.
- **Le nom du composant = le nom du fichier** : `FormationModal.tsx` → `FormationModal`. Fichiers de `lib/`, `services/`, `actions/` en `kebab-case`.
- **La longueur suit la portée** : `i` dans une boucle de 3 lignes, un nom complet pour une fonction exportée.

### 3.3 Fonctions
- **Petites et une seule chose** ; si on peut en extraire une fonction au nom qui ne soit pas une reformulation, elle en fait plusieurs.
- **Un seul niveau d'abstraction** : une Server Action ou une page **orchestre** (auth → validation → service → revalidation) et appelle des fonctions nommées.
- **Lecture de haut en bas** : la fonction exportée, puis juste en dessous les fonctions internes qu'elle appelle.
- **0 à 3 arguments** ; au-delà, un objet typé (`{ chefId, referentId, etapeId }`). **Pas de booléen qui change le comportement** : deux fonctions bien nommées.
- **Faire OU renvoyer** : une fonction modifie un état ou renvoie une information, pas les deux.
- **Conditions lisibles** : une condition complexe devient une fonction ou une variable nommée (`modifiable(etape)`, `aChange`).
- **Calculs en fonctions pures** (sans Prisma, sans React, sans `fetch`) dans `src/lib/`, testées en une ligne (`niveauMaxDebloque`, `jalonsImplicites`).

### 3.4 Composants, actions, services
- **Une seule raison de changer** :
  - une **page serveur** (`page.tsx`) vérifie l'accès, charge les données via un service et les passe au composant client ;
  - un **composant client** (`"use client"`) affiche et réagit aux actions de l'utilisateur ;
  - une **Server Action** (`src/actions/`, `_actions/`) : auth + validation Zod + appel d'un service + `revalidatePath` ;
  - un **service** (`src/services/`) porte la logique métier et parle à Prisma ;
  - une **lib** (`src/lib/`) calcule (fonctions pures) ou fournit une mécanique partagée.
- **Server Component par défaut** : `"use client"` seulement là où il faut de l'état, un effet ou un événement, et le plus bas possible dans l'arbre.
- **Signaux d'alerte** : fichier > 250 lignes, fonction > 30 lignes, > 3 paramètres, composant > ~150 lignes de JSX, plus de ~5 `useState` dans un composant. Invitation à découper.
- **Exposer le minimum** : n'exporter que ce qui est utilisé ailleurs ; les sous-composants propres à un fichier restent non exportés (`ProfilIdentity` dans `ProfilForm.tsx`).
- **Ne parler qu'à ses voisins** : un composant client appelle une Server Action, jamais un service ni `prisma` ; un composant parle à un autre par ses props.
- **Pas de code mort** : fonction jamais appelée, page jamais atteinte, variable inutilisée, `console.log` de test → supprimé.

### 3.5 Erreurs
- **Un service ne connaît pas l'écran** : il renvoie un `ServiceResult` (`src/types`, `{ success: true }` ou `{ success: false, error }`) pour une erreur métier attendue, ou laisse remonter l'exception.
- **Une Server Action ne lève jamais vers le client** : elle attrape, fait `console.error` avec contexte, et renvoie `{ success: false, error: "message pour l'utilisateur" }`. Exception : `redirect()` / `notFound()`, appelés **hors** du `try` (ils fonctionnent en levant une exception).
- **Erreur de chargement (page serveur) → dans la page** : `error.tsx` du segment pour l'inattendu, un état vide explicite pour l'absence de données ; `notFound()` / `redirectToLogin()` pour les cas prévus.
- **Erreur d'action → affichée à l'utilisateur, à côté de l'action** : le composant lit `result.success` et affiche `result.error` (message dans le composant, comme `ProgressionPlateforme.tsx`, ou `addToast` de `@heroui/toast`, déjà monté dans `providers.tsx`). **Jamais** un `console.error` seul, **jamais** `alert()` ni `confirm()` (confirmation : `ConfirmPopover`).
- **Ne pas avaler une erreur en silence** : un `catch` qui renvoie une valeur vide n'est acceptable que pour une donnée **secondaire** qui ne doit pas bloquer la page, et le nom le dit (`getProgressionOuVide`).
- **Préférer une valeur vide à `null`** : `[]`, `''`.
- **Typer au lieu de `any`** ; `unknown` pour ce qui n'est pas encore connu (une erreur attrapée est `unknown`). Types Prisma dérivés avec `Prisma.XGetPayload<…>` (`src/types/index.ts`), pas recopiés à la main.

### 3.6 Mise en forme et cohérence
- **Ordre dans un composant** : hooks de lib (`useRouter`…) → `useState` / `useTransition` → valeurs dérivées (`useMemo` seulement si le calcul est coûteux) → effets → `handle…` → `return` JSX. Les sous-composants et fonctions pures locales vont **sous** le composant exporté ou dans leur propre fichier.
- **Ordre dans une Server Action** : `authorizeRole` → `schema.safeParse` → service → `revalidatePath` → `return { success: true }`.
- **Ce qui va ensemble est proche** : un schéma Zod juste au-dessus de l'action qui l'utilise ; une fonction interne juste sous celle qui l'appelle.
- **La forme est outillée** : `.prettierrc.json` et `eslint.config.mjs` (`npx eslint <fichiers>`, `npm run lint` corrige). Ordre des imports, tri des props JSX, lignes vides avant `return` : ESLint s'en charge.
- **Cohérence avant préférence** : un nouveau code s'écrit comme les fichiers de référence (§1). Si une convention change, elle change partout, et dans ce guide.

### 3.7 La règle du boy-scout
Laisser un fichier un peu plus propre qu'on ne l'a trouvé : renommer une variable obscure, supprimer un commentaire inutile, extraire une fonction trop longue. Petites améliorations, dans le fichier touché, sans refonte hors sujet dans la même modification.

### 3.8 Checklist de relecture
- [ ] Chaque nom dit ce que fait la chose, sans commentaire ; le vocabulaire métier est en français.
- [ ] Aucun commentaire hors directives ; chaque directive a sa raison après `--`.
- [ ] Chaque fonction fait une chose, en peu de lignes, avec ≤ 3 arguments et sans booléen de sélection.
- [ ] Aucune logique copiée : elle existe déjà (`lib/`, `services/`) ou a été extraite.
- [ ] Chaque Server Action commence par `authorizeRole` + `safeParse`, délègue à un service, ne lève pas vers le client.
- [ ] Aucun composant client n'importe `prisma` ni un service ; aucune page n'appelle `prisma` directement.
- [ ] Erreur d'action affichée à l'utilisateur (`result.error`), pas de `alert` / `confirm` / `console.error` seul.
- [ ] Pas de valeur magique, pas de code mort, pas de `console.log`, pas de `any`.
- [ ] Les fonctions pures et les services ajoutés ont leur `.test.ts`.
- [ ] `npx tsc --noEmit`, `npm run build`, `npm test` et `npx eslint <fichiers touchés>` passent.

---

## 4. Où ranger quoi

```
src/
├── app/                                   ← routes (App Router)
│   ├── (app)/                             ← zone authentifiée
│   │   ├── (dashboard)/  (referent)/      ← groupes de routes par rôle
│   │   ├── admin/
│   │   │   ├── _actions/                  ← Server Actions propres à l'admin
│   │   │   └── <page>/
│   │   │       ├── page.tsx               ← serveur : accès + chargement via service
│   │   │       ├── ClientPage.tsx         ← client : affichage + interactions
│   │   │       └── _components/           ← composants propres à la page
│   │   └── layout.tsx
│   ├── api/                               ← Route Handlers (fichiers, pas d'API interne)
│   ├── error.tsx  not-found.tsx  layout.tsx  providers.tsx
├── actions/<domaine>/<domaine>.actions.ts ← Server Actions partagées
├── services/<domaine>.service.ts          ← logique métier + Prisma (+ .test.ts)
├── lib/                                   ← fonctions pures, auth, prisma, roles (+ .test.ts)
├── components/
│   ├── ui/                                ← briques d'affichage (Button, Card, Input…)
│   ├── admin/                             ← briques partagées de l'admin
│   └── <domaine>/                         ← composants partagés d'un domaine (discussion…)
├── config/                                ← navigation, site, fonts
├── types/                                 ← types partagés (dérivés de Prisma)
└── styles/
prisma/                                    ← schema.prisma, migrations, seed.ts
docs/                                      ← plans de refactor par phases, décisions métier
```

| Besoin | Emplacement | Exemple |
|---|---|---|
| Écriture déclenchée par l'utilisateur | `actions/<domaine>/<domaine>.actions.ts` ou `<segment>/_actions/` | `declarerProgressionPlateforme` |
| Logique métier, accès base | `services/<domaine>.service.ts` | `EtapeService.getProgressForChef` |
| Calcul pur partagé | `lib/` | `niveauMaxDebloque`, `estReferent` |
| Contrôle d'accès | `lib/auth-guards.ts`, `lib/roles.ts` | `authorizeRole`, `canAccessJustification` |
| Composant réutilisé partout | `components/ui/` (exporté par `index.ts`) | `Button`, `Card` |
| Composant propre à une page | `<page>/_components/` | `ProfilForm` |
| Type partagé | `types/index.ts` | `SessionUser`, `AdminEtapeListItem` |
| Constante de navigation | `config/navigation.ts` | `ROUTE_DECONNEXION` |
| Explication d'une décision | `docs/<sujet>.md` | `etape-3-profils.md` |

Règles associées :
- **Lire des données** : dans une page / un layout serveur, via un service. Pas de `useEffect` + `fetch` pour charger, pas de Route Handler interne appelé par l'app elle-même.
- **Écrire des données** : Server Action, puis `revalidatePath` des pages concernées. `router.refresh()` seulement si l'action ne peut pas revalider elle-même.
- **Un composant client ne reçoit jamais plus que ce qu'il affiche** : la page serveur fait un `select` Prisma ciblé (pas d'objet `user` complet avec des champs sensibles).
- **Configuration** : variables d'environnement lues côté serveur, listées dans `.env.example` et vérifiées par `scripts/check-env.mjs`. `NEXT_PUBLIC_…` seulement pour ce qui peut être public.

---

## 5. Conventions Next.js 16 / React 19

- **App Router uniquement.** `params` et `searchParams` d'une page sont des `Promise` : `const { id } = await params`.
- **Server Components par défaut** ; `"use client"` en tête d'un fichier seulement s'il utilise état, effet, événement ou API navigateur.
- **Server Actions** : fichier `"use server"`, fonctions `async` exportées ; toujours `authorizeRole(...)` (ou `getUser()` + garde de `lib/roles.ts`) **puis** `schema.safeParse(...)` en tête ; logique dans `src/services/` ; retour `{ success, error? }` ; `revalidatePath` après écriture ; `redirect()` hors `try`.
- **Auth** : session WordPress (cookie `wordpress_logged_in*`) contrôlée par `src/proxy.ts` puis `getUser()` (`lib/auth-server.ts`, mis en cache par requête avec `cache` de React). Une action ou une page ne se fie **jamais** au seul `proxy` : elle revérifie le rôle.
- **Rôles** : `UserRole` (Prisma) + listes et prédicats de `lib/roles.ts` (`ROLES_ADMIN`, `ROLES_REFERENT`, `estReferent`…) ; jamais une comparaison de chaîne recopiée.
- **Prisma** : un seul client (`lib/prisma.ts`), utilisé seulement dans `services/` et `lib/` côté serveur. `select` ciblé, lectures indépendantes en `Promise.all`. Schéma modifié → migration (`npx prisma migrate dev --name <nom>`), jamais `db push` sur une base partagée.
- **Formulaires** : `react-hook-form` + `zodResolver` + schéma Zod ; la même contrainte est **revalidée côté serveur** dans l'action (le client n'est jamais cru). Enveloppe de modal : `components/admin/FormModal.tsx`.
- **Actions côté client** : `useTransition` (`isPending`, `startTransition(async () => …)`), lecture de `result.success`, message d'erreur affiché.
- **UI** : HeroUI + composants de `@/components/ui` ; Tailwind 4 pour la mise en page ; couleurs via les tokens du thème (`bg-dashboard-panel`, `text-default-500`), pas de couleur en dur. `clsx` / `tailwind-variants` pour les classes conditionnelles.
- **Icônes** : `Icon` de `@/lib/icons` (set Solar, généré par `npm run build:icons`), pas d'import direct d'Iconify.
- **Images** : `next/image` ; `<img>` seulement avec `eslint-disable-next-line @next/next/no-img-element -- <raison>`.
- **Textes** : en français, en dur dans les composants ; métadonnées de page via `export const metadata`.
- **Fichiers** : composants React en `PascalCase.tsx` ; `lib/`, `services/`, `actions/` en `kebab-case` avec suffixe de rôle (`.service.ts`, `.actions.ts`) ; fichiers de routes selon les conventions Next (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`) ; dossiers privés préfixés `_` (`_components`, `_actions`).
- **Tests (Vitest, environnement `node`)** : chaque fonction pure de `lib/` et chaque service a son `.test.ts` à côté du fichier ; Prisma est mocké dans les tests de service (modèle : `services/etape.service.test.ts`).
