# 📋 Plan de refactor — Discussion / Chat

> **Date :** 2026-06-03
> **Statut :** validé, prêt à implémenter (phase par phase)
> **Périmètre :** le système de discussion entre Chef et Référent autour d'une **réalisation**.

## Contexte & objectif

Aujourd'hui le chat est éclaté en **3 chemins de données** (action `getComments`, route REST `/api/justifications/[id]/comments`, prop server-rendered), **2 UI distinctes** (drawer `ChatPanel` côté chef, onglet `DiscussionContent` côté référent), les **fichiers sont hors du fil**, et chaque envoi déclenche un `revalidatePath` (lent). Les deux côtés ne fonctionnent pas pareil, ce qui est illogique.

**Cible :** le chat devient **central** et **symétrique**. Une réalisation = un fil. Le chef envoie (texte + fichier), le référent répond dans le fil ou valide. Les fichiers (y compris les re-uploads) vivent **dans** le fil. Code propre, isolé, facile à trouver.

### Workflow cible (réalisations uniquement — les compétences restent auto-validées, sans fil)

1. Le chef ouvre une réalisation → **formulaire** (description + fichier) → envoie.
2. Dès l'envoi, la réalisation n'affiche plus le formulaire mais **le chat**, avec le fichier comme 1ᵉʳ message. Statut = *en attente référent* (`SOUMISE`).
3. Le référent ouvre la réalisation → **même chat** + bouton **Valider**.
   - Il écrit → statut `DEMANDE_PRECISION` (*en attente chef*).
   - Il **Valide** (+ mot optionnel) → `VALIDEE` ✓ (terminal, fil en lecture seule).
4. Le chef répond / **re-upload un fichier directement dans le chat** → repasse `SOUMISE`.
5. Ping-pong jusqu'à validation. **Pas de bouton « Refuser »** (le chef peut toujours re-téléverser).

---

## 0. Principe directeur : un chat isolé et lisible

Tout le chat vit dans **un seul dossier** `src/components/discussion/`. Règle nette : **l'UI ne sait rien du réseau**, toute la logique (chargement, polling, optimistic, upload) est dans **un hook unique**.

```
src/components/discussion/
├── DiscussionThread.tsx     ← LE composant public (chef + référent, identique)
├── MessageList.tsx          ← liste + auto-scroll + groupement par jour
├── MessageBubble.tsx        ← une bulle : texte / fichier / système
├── FileAttachment.tsx       ← rendu d'une pièce jointe (image/doc) via /api/files/[id]
├── MessageComposer.tsx      ← input texte + bouton pièce jointe + envoi
├── useDiscussionThread.ts   ← TOUTE la logique : load + polling + optimistic + send/validate
└── types.ts                 ← ThreadMessage, ThreadData, ViewerRole
```

Si tu cherches le chat → `components/discussion/`. Point.

---

## 1. Modèle de données (migration Prisma — libre de reset)

### Enums

```prisma
enum StatutJustification {
  BROUILLON
  AUTO_VALIDEE        // compétences
  SOUMISE             // en attente du référent
  DEMANDE_PRECISION   // en attente du chef
  VALIDEE             // terminal
  // ❌ supprimés : EN_COURS, REFUSEE
}

enum MessageType {     // remplace TypeCommentaire
  USER                 // message d'un humain (le rôle de l'auteur décide le côté de la bulle)
  SYSTEM               // event : "réalisation soumise", "✓ validée"
}
```

### Modèles (renommage `Commentaire` → `Message`, fichier rattaché au message)

```prisma
model Justification {
  id         String  @id @default(cuid())
  chefId     String
  objectifId String
  etapeId    String
  contenu    String?                       // description initiale (= 1er message)
  statut     StatutJustification @default(BROUILLON)
  soumiseAt  DateTime?
  valideeAt  DateTime?
  // ❌ supprimé : version
  messages   Message[]
  // ... relations inchangées (chef, objectif, etape, notifications)
  @@unique([chefId, objectifId])
}

model Message {
  id              String      @id @default(cuid())
  justificationId String
  auteurId        String
  contenu         String?                  // null si le message = fichier seul
  type            MessageType @default(USER)
  createdAt       DateTime    @default(now())
  fichier         Fichier?                 // pièce jointe optionnelle (1-1)
  justification   Justification @relation(fields: [justificationId], references: [id], onDelete: Cascade)
  auteur          User          @relation(fields: [auteurId], references: [id], onDelete: Cascade)
}

model Fichier {
  id              String  @id @default(cuid())
  messageId       String  @unique           // ← le fichier vit DANS le fil
  justificationId String                    // gardé (dénormalisé) → /api/files/[id] inchangé
  // ... champs inchangés (nomOriginal, nomStockage, cheminFichier, mimeType, taille, type)
  message         Message @relation(fields: [messageId], references: [id], onDelete: Cascade)
}
```

> `Fichier.justificationId` reste pour que la route authentifiée `/api/files/[id]` ne change pas, et `messageId` le place dans la timeline. Le « fichier courant à valider » = dernier `Message` du fil ayant un `fichier`.

**Migration :** régénérer le schéma + `prisma migrate reset` + **mettre à jour `seed.ts`** (créer 1-2 réalisations avec un 1er message + fichier pour tester le fil).

---

## 2. Backend — une seule porte d'entrée

### `src/services/discussion.service.ts` (logique métier + transitions de statut)

```
getThread(viewerId, viewerRole, justificationId)
  → authz (canAccessJustification) ; renvoie { statut, messages[] (auteur+fichier, triés), objectif }

postMessage({ viewerId, viewerRole, justificationId, contenu?, fichier? })
  → authz + crée Message (+ Fichier) + transition statut :
       chef     → SOUMISE
       référent → DEMANDE_PRECISION
  → notifie l'autre partie ; renvoie le Message créé (pour l'optimistic)

validateRealisation({ referentId, justificationId, contenu? })
  → authz référent assigné + statut VALIDEE + message SYSTEM "✓ validée" + notifie le chef
```

`submitRealisation` (1er envoi) est adapté pour créer la `Justification` **et déléguer le 1er message** au même helper que `postMessage` (DRY).

### `src/actions/discussion/discussion.actions.ts` (fines : auth + Zod + délègue)

```ts
getThread(justificationId): Promise<ThreadData>
postMessage(justificationId, contenu: string, file?: File)
validateRealisation(justificationId, contenu?: string)
```

> ⚠️ **Pas de `revalidatePath`** sur les messages (cause de la lenteur actuelle). Le client met à jour via optimistic + polling.

---

## 3. Le composant chat — flux de données

### `useDiscussionThread.ts` (le cerveau, isolé)

- `load()` initial via `getThread`.
- **Polling** `setInterval(7s)` tant que monté **et onglet visible** (`visibilitychange` → pause), merge par `id` (dé-duplication).
- **Optimistic** : à l'envoi, on pousse un message `{ id: "temp-…", pending: true }`, on appelle l'action, on remplace par le vrai au retour (rollback si erreur).
- Upload : validation type/taille **côté client** (miroir de `StorageService`) avant envoi → feedback instantané.
- Renvoie : `{ messages, statut, isLoading, error, sendMessage, validate, readOnly }`.
- `readOnly = statut === "VALIDEE"` → composer désactivé (fil clôturé).

### `DiscussionThread.tsx` (API publique, minimale)

```tsx
<DiscussionThread
  justificationId={...}
  objectif={{ code, description }}   // entête
/>
```

- Lit le rôle via `useSession` (interne), branche le hook, compose `MessageList` + `MessageComposer` + (si référent & non validé) bouton **Valider**.
- `MessageBubble` décide le côté par `message.auteurId === viewer.id`, et le rendu par `type` (texte / fichier / système centré).

---

## 4. Intégration (ce qui change dans l'app)

### Côté CHEF — `ObjectifPanel.tsx` + `ObjectifModal.tsx`
- ❌ Retirer l'onglet **« Discussion »** (onglets = Compétences / Réalisations).
- La modale d'une réalisation devient **état-dépendante** :
  - pas encore soumise → **formulaire actuel** (description + fichier),
  - soumise → **`<DiscussionThread>`** (fichier dans le fil + re-upload + échanges).
- ❌ Plus de `ChatPanel` (drawer séparé).

### Côté RÉFÉRENT — `ReferentValidationModal.tsx`
- ❌ Retirer les 2 onglets (Détails/Discussion) et le formulaire `requestChanges`.
- À la place : **entête (objectif/chef) + `<DiscussionThread>` + bouton Valider**. Le fichier est dans le fil.
- Les listes du dashboard référent (`à valider` = SOUMISE, `discussions` = DEMANDE_PRECISION) restent, recâblées sur les nouveaux statuts.

---

## 5. Suppressions (dead code à retirer)

```
❌ components/application/dashboard-chef/ChatPanel.tsx
❌ components/application/dashboard-chef/chat/  (ChatList, ChatInput, MessageBubble)
❌ .../referent/dashboard/_components/modal/DiscussionContent.tsx
❌ components/application/referent/_components/MessageCard.tsx
❌ actions/comment/comment.actions.ts        (getComments, submitComment)
❌ services/comment.service.ts
❌ app/api/justifications/[id]/comments/route.ts   (le fil passe par l'action)
❌ justification.service : requestChanges, rejectJustification  → remplacés / supprimés
✅ GARDÉS : /api/files/[id], StorageService, NotificationService, auth-guards
```

---

## 6. Statuts & notifications
- `StatusChip` : retirer REFUSEE, libellés clairs (En attente référent / Précisions demandées / Validé).
- Notifications : 1 par message vers l'autre partie (chef → référents assignés, référent → chef) + « validée » au chef. Réutiliser `NotificationService` (types existants : `NOUVEAU_COMMENTAIRE`, `DEMANDE_PRECISION`, `JUSTIFICATION_VALIDEE`).

---

## 7. Ordre d'implémentation (chaque étape compile/teste)

- [x] **Phase 1** — Schéma Prisma + seed. **✅ Fait — 2026-06-03**
  - **Schéma** (`prisma/schema.prisma`, validé via `prisma validate` ✓) : `StatutJustification` sans `EN_COURS`/`REFUSEE` ; `TypeCommentaire` → `MessageType { USER, SYSTEM }` ; `Commentaire` → **`Message`** (table `messages`, `contenu` nullable, relation `fichier Fichier?`) ; `Justification` sans `version`, relation `commentaires` → `messages` ; `Fichier` gagne `messageId String @unique` + relation `message` (garde `justificationId` pour `/api/files/[id]`).
  - **Seed** (`prisma/seed.ts`) : la réalisation G8 crée maintenant un `Message` (1er message du fil) en plus de la justification.
  - **⚠️ À appliquer côté DB (toi)** : stopper `npm run dev`, puis `npx prisma migrate reset --force --skip-seed` (vide la base — les fichiers existants empêchaient l'ajout de `messageId`), puis `npx prisma migrate dev --name discussion_refactor` (crée + applique la migration sur tables vides, régénère le client, relance le seed).
  - **Note** : le code existant qui référence `Commentaire`/`requestChanges`/etc. ne compilera plus jusqu'aux phases 2/5/6/7 (fichiers voués à être remplacés/supprimés). Refactor à faire **sur une branche** dédiée.
- [x] **Phase 2** — Backend : `discussion.service` + `discussion.actions` + adaptation `submitRealisation` + notifs. **✅ Fait — 2026-06-05**
  - **Service** (`src/services/discussion.service.ts`, neuf) : porte d'entrée unique du fil. `ServiceResult<T>` (union discriminée), types exportés `FichierData` / `ThreadMessage` (`Prisma.MessageGetPayload<{auteur, fichier}>`) / `ThreadData`. Méthodes : `addMessage(tx, …)` (helper public — crée `Message` + `Fichier` imbriqué dans une transaction, réutilisé par `submitRealisation`) ; `getThread` (authz `canAccessJustification` → `{statut, objectif, chef, messages triés}`) ; `postMessage` (authz + `$transaction` create message + transition `chef→SOUMISE` / `référent→DEMANDE_PRECISION`, bloqué si `VALIDEE`, notifie l'autre partie) ; `validateRealisation` (référent assigné → `VALIDEE` + message `SYSTEM` « ✓ validée » + mot optionnel + notifie le chef).
  - **Actions** (`src/actions/discussion/discussion.actions.ts`, neuf) : fines (auth `getUser` + Zod + délègue), **sans `revalidatePath`**. `getThread`, `postMessage` (upload via `StorageService`, construit `fichierData`), `validateRealisation` (réservé REFERENT). Renvoient directement le `ServiceResult` du service.
  - **`submitRealisation`** (`src/services/justification.service.ts`) : réécrit pour créer la `Justification` **et** le 1er `Message` (texte + fichier) via `DiscussionService.addMessage` dans une `$transaction` (DRY). `submitCompetence` inchangé. Supprimés : `approveJustification`, `rejectJustification`, `requestChanges`.
  - **Supprimé** : `src/actions/justification/justification.actions.ts` (les 3 actions obsolètes) + dossier vide.
  - **Seed** (`prisma/seed.ts`) : nettoyage `prisma.commentaire.deleteMany()` → `prisma.message.deleteMany()`, réordonné (fichiers → messages → justifications) pour respecter les FK.
  - **État build** : `tsc` des fichiers backend Phase 2 (service/actions/seed) ✓ **propre**. Restent rouges (attendu) les consommateurs UI/commentaires : `comment.service`, `comment/comment.actions`, route `…/comments`, `JustificationModal`, `ReferentValidationModal`, `MessageCard`, `types/index.ts`, `justification.service.test.ts` → corrigés/supprimés en phases 3/5/6/7.
- [x] **Phase 3** — Tests vitest du service (transitions chef/référent/validate + authz + fichier). **✅ Fait — 2026-06-06**
  - **`discussion.service.test.ts`** (neuf, 16 tests) : `addMessage` (Fichier imbriqué quand pièce jointe / `fichier` undefined sinon) ; `getThread` (authz `canAccessJustification` refusé → pas de requête / introuvable / succès trié `{justificationId, statut, objectif, chef, messages}`) ; `postMessage` (vide rejeté **avant** authz, authz refusé, **VALIDEE → bloqué lecture seule**, chef → `SOUMISE` + `soumiseAt` + notif référents via `notification.createMany`, référent → `DEMANDE_PRECISION` sans `soumiseAt` + notif chef via `notification.create`, message fichier-seul sans texte → `contenu: null`) ; `validateRealisation` (introuvable, non-assigné à l'étape, déjà `VALIDEE`, succès → `VALIDEE` + `valideeAt` + message `SYSTEM` « ✓ Réalisation validée » + notif chef, mot optionnel concaténé « — Bravo »).
  - **`justification.service.test.ts`** (réparé) : bloc `approveJustification` retiré (méthode supprimée en Phase 2), mock `commentaire` → `message` + ajout `$transaction`, `submitRealisation` recâblé sur le flux transactionnel (create/update `SOUMISE` + 1er `Message` via `addMessage` + `notifyReferents`), nouveau cas re-soumission (update sans create en double). `submitCompetence` inchangé.
  - **Outillage** : `npm install` (vitest `^4.1.8` était déclaré mais pas installé). Patron de mock : `$transaction` = `cb(db)` (exécute la transaction sur le mock, `tx` = le client mocké) ; `canAccessJustification` mocké pour piloter l'authz côté `DiscussionService`.
  - **État** : `npm test` ✓ **34/34** (auth-guards 10 + discussion 16 + justification 8). `tsc` des fichiers Phase 3 ✓ propre (les ex-erreurs `vitest`/`approveJustification` ont disparu). Restent rouges (attendu) **uniquement** les consommateurs UI/commentaires des phases 5/6/7 : `comment.service`, `comment/comment.actions`, route `…/comments`, `JustificationModal`, `ReferentValidationModal`, `referent/dashboard/page.tsx`, `MessageCard`, `types/index.ts`. `npm run build` reste donc rouge jusqu'à ces phases.
- [x] **Phase 4** — Composant `components/discussion/*` (en isolation). **✅ Fait — 2026-06-06**
  - **`types.ts`** : types UI isolés du réseau — `ViewerRole`, `ThreadAuthor`, `ThreadFile`, `UiMessage` (forme allégée + `pending?`), `ThreadObjectif`. L'UI ne dépend plus des types Prisma : le hook mappe `ThreadMessage` (serveur) → `UiMessage`.
  - **`useDiscussionThread.ts`** (le cerveau) : `refresh()` via `getThread` ; **polling 7 s** pausé quand l'onglet est caché (`document.visibilityState` + écoute `visibilitychange`) ; **optimistic** à l'envoi (message `temp-…` + `pending`, remplacé par le vrai au retour, retiré en cas d'erreur, fusion par `id` en gardant les `pending`) ; **validation fichier côté client** `validateFileClient` (miroir exact de `StorageService` : mêmes MIME + 8 Mo, exportée pour le composer) ; `validate()` pour la validation référent. `viewer` stocké en `ref` → callbacks stables. Renvoie `{messages, statut, isLoading, error, readOnly, sendMessage, validate}`, `readOnly = statut === "VALIDEE"`.
  - **Présentationnels** : `FileAttachment` (image inline / doc téléchargeable via la route authentifiée `/api/files/[id]` — `<img>` + directive eslint fonctionnelle justifiée ; placeholder `pending`) ; `MessageBubble` (côté par `auteurId === viewerId`, `SYSTEM` centré en pastille verte, fichier + texte + spinner `pending`) ; `MessageList` (auto-scroll bas, **groupement par jour**, états vide/chargement/erreur) ; `MessageComposer` (textarea + pièce jointe avec chip/retrait + bouton **Envoyer** ; bouton **Valider** affiché si `canValidate`, le texte courant devient le mot optionnel).
  - **`DiscussionThread.tsx`** (API publique `{ justificationId, objectif }`) : lit la session en interne (`useSession` → `viewerId`/`viewerRole`/`author`), branche le hook, compose header objectif + `MessageList` + footer (`MessageComposer` ou notice « fil clôturé » si `readOnly`). `Valider` visible seulement pour `REFERENT`.
  - **État build** : `tsc` ✓ **0 erreur** dans `components/discussion/*` ; `eslint --fix` ✓ ; `npm test` ✓ 34/34. Composant en **isolation** (encore importé nulle part) → le total `tsc` reste à 19 erreurs, inchangé = uniquement les consommateurs des phases 5/6/7. Branchement chef/référent en phases 5/6.
- [x] **Phase 5** — Intégration chef (ObjectifPanel / ObjectifModal). **✅ Fait — 2026-06-06**
  - **`ObjectifModal`** : rendu **état-dépendant** pour les réalisations. `showThread = !competence && justification soumise && statut !== "BROUILLON" && id non temporaire` → la modale affiche **`<DiscussionThread>`** (`ModalBody h-[70vh] p-0`, fichier + échanges dans le fil) ; sinon le **formulaire** (description + fichier) inchangé. Compétences toujours en formulaire auto-validé. Le garde « id non `temp-` » évite d'ouvrir le fil sur une justification optimiste avant le `router.refresh`.
  - **`ObjectifPanel`** : onglet **« Discussion » retiré** (onglets = Compétences / Réalisations) ; supprimés `ChatPanel`, `clickable`, l'état de chat (`useDisclosure`/`selectedChatObjectif`/`handleOpenChat`) et le filtre `discussions`.
  - **`StatusChip`** (§6) : retrait de `EN_COURS`/`REFUSEE` (valeurs hors enum) ; typé `Record<StatutJustification, …>` ; libellés clairs « En attente référent » (SOUMISE) / « Précisions demandées » (DEMANDE_PRECISION) / « Validé ».
  - **`DashboardClient`** : `ObjectifAvecJustification` repose sur `Justification` simple (plus de relation `commentaires` — le fil charge ses données via `getThread`) ; `updateJustification` sans `commentaires` ; notifications précision/commentaire → `targetSubTab "realisations"` (le fil vit dans la modale réalisation).
  - **`@/types`** : retrait de l'import cassé `Commentaire` + des types comment-era `CommentaireAvecAuteur` / `JustificationAvecCommentaires`.
  - **Décision** : à la 1ʳᵉ soumission, la modale se ferme (+`router.refresh`) puis se rouvre en mode chat (plutôt que de muter instantanément) — plus robuste vis-à-vis de l'id optimiste. Re-uploads/échanges se font ensuite **dans le fil** (optimistic + polling, sans `revalidatePath`).
  - **État build** : chemin chef **tsc propre** (aucun fichier `(dashboard)` en erreur), `eslint --fix` ✓ (1 warning `no-console` préexistant), `npm test` ✓ 34/34. Total `tsc` 19 → **25** : le retrait des types comment-era de `@/types` rend explicitement rouges des fichiers qui s'y appuyaient — tous **phase 6** (référent : `ReferentValidationModal`, `referent/dashboard/page.tsx`, `ReferentDashboardClientV2`, `DiscussionContent`) ou **phase 7** (dead code : `comment.*`, route `…/comments`, `ChatPanel`, `chat/*`, `MessageCard`, + dossier **`justifications-table/`** confirmé non importé → à supprimer).
- [x] **Phase 6** — Intégration référent (ReferentValidationModal). **✅ Fait — 2026-06-06**
  - **`ReferentValidationModal`** (réécrit) : ❌ retirés les 2 onglets (Détails/Discussion), le formulaire `requestChanges`, les imports `approveJustification`/`requestChanges` (actions supprimées en Phase 2), et l'état `useOptimistic`/`reloadCommentaires`/`fetch …/comments`. À la place : **entête chef** (`<User>`) + **`<DiscussionThread>`** (`ModalBody h-[70vh] p-0`, `scrollBehavior="outside"` — symétrique du chef). Le bouton **Valider** vit déjà dans le `MessageComposer` (`canValidate = viewerRole === "REFERENT"`) → rien à recâbler. `markNotificationsAsReadForJustification` conservé (au `useEffect` d'ouverture). Type public `JustificationAvecRelations` → **`ReferentThreadJustification`** (`{ id, chef{name,email,image}, objectif{code,description} }`).
  - **`ReferentDashboardClientV2`** : retrait `CommentaireAvecAuteur` + état `modalDefaultTab`/`defaultTab` (plus d'onglets) ; `handleJustificationClick(justification)` sans le param `tab` ; `selectedJustification` typé `ReferentThreadJustification` (cast `as unknown as` supprimé — assignable structurellement) ; **`router.refresh()` à la fermeture** de la modale (les actions du fil n'ont pas de `revalidatePath` → propage validate/précision aux listes).
  - **`page.tsx`** : `include { commentaires }` retiré (relation renommée `messages` — l'include invalide cassait l'inférence → `fichiers` « introuvable ») **et** `include { fichiers }` + les 2 `.map` d'URL retirés (les panels n'utilisent que `chef`/`objectif`/`_count` ; le fil charge ses fichiers via `getThread`). Listes inchangées : à valider = `SOUMISE`, discussions = `DEMANDE_PRECISION` + badge `_count` notifs `NOUVEAU_COMMENTAIRE` non lues.
  - **Supprimé** : dossier `…/dashboard/_components/modal/` (`DiscussionContent`, `JustificationContent`, `ModalHeaderContent` — orphelins après la réécriture).
  - **État build** : chemin référent **tsc propre** (0 erreur en `(referent)`), `eslint --fix` ✓, `npm test` ✓ 34/34. Total `tsc` 25 → **12**, restantes **uniquement** le dead code Phase 7 : `comment.service`, `comment/comment.actions`, route `…/comments`, `MessageCard` (devenu orphelin), `ChatPanel`, `chat/*` (`ChatList`/`MessageBubble`), `justifications-table/JustificationModal`. `npm run build` reste rouge jusqu'à la Phase 7.
- [x] **Phase 7** — Nettoyage (suppressions §5) + `tsc` + `vitest`. **✅ Fait — 2026-06-06** _(build + run manuel : après migration DB, cf. ⚠️)_
  - **Supprimé (dead code §5, 12 fichiers)** : `components/application/dashboard-chef/` entier (`ChatPanel` + `chat/` : `ChatInput`/`ChatList`/`MessageBubble`) ; `app/api/justifications/[id]/comments/route.ts` (dossier `api/justifications/` devenu vide → retiré) ; `components/application/referent/_components/MessageCard.tsx` ; `actions/comment/comment.actions.ts` ; `services/comment.service.ts` ; `components/application/justifications-table/` entier (`JustificationModal`/`JustificationsTable`/`…Actions`/`…Columns` — dernières références à `approveJustification`/`rejectJustification`). Cluster auto-contenu, **aucun importeur vivant** (vérifié par grep avant chaque suppression). `DiscussionContent`/`JustificationContent`/`ModalHeaderContent` déjà retirés en Phase 6.
  - **Gardés** (§5) : `/api/files/[id]`, `StorageService`, `NotificationService`, auth-guards.
  - **État** : `tsc` **source 0 erreur** ; `npm test` ✓ **34/34**. (3 erreurs `.next/types/**` résiduelles = artefacts périmés du dev server encore lancé, pointant l'ex-route `/comments` → disparaissent au prochain build/recompile.)
  - **⚠️ Reste côté DB (toi)** — la migration Phase 1 n'est toujours pas appliquée (table `messages` absente → `P2021` à la soumission). Stopper `npm run dev`, `npx prisma migrate reset --force` (applique les 2 migrations + seed), relancer. Puis `npm run build` + run manuel (chef + référent) pour clôturer la validation.

---

## 8. Tests

Étendre la suite vitest existante : `discussion.service.test.ts` couvrant la machine à états (chef poste → SOUMISE, référent poste → DEMANDE_PRECISION, validate → VALIDEE, lecture seule après VALIDEE), l'authz, et le rattachement fichier ↔ message.

---

## 9. Décisions par défaut (ajustables)

- **Surface** : modale (cohérent avec l'existant) plutôt que drawer.
- **Valider** : bouton qui poste un message SYSTEM « ✓ validée » + petit mot optionnel.
- **Compétences** : inchangées (auto-validées, sans fil).
- **Fil clôturé** après `VALIDEE` (lecture seule).
- **Temps réel** : optimistic à l'envoi (instantané) + polling 5–10 s quand le fil est ouvert. Pas de websocket, pas de lib de chat.
