# 🔍 Rapport d'audit — Flambeau Progrès (Next.js)

> **Date :** 2026-06-02
> **Périmètre :** intégralité de `src/` (actions, services, lib, app, components), `prisma/schema.prisma`, `middleware.ts`, configuration (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`).
> **Stack :** Next.js 16 (App Router, Turbopack), React 19, Prisma 6 (MySQL), better-auth, HeroUI, Tailwind 4, react-hook-form + Zod, Three.js / R3F.

---

## 📊 RÉSUMÉ EXÉCUTIF

**Application :** *Flambeau Progrès* — suivi de progression scoute (rôles CHEF / REFERENT / ADMIN).

**Score global estimé : 5 / 10**

Les fondations sont modernes et plutôt saines (App Router bien organisé en route groups, amorce de couche `services`, Server Components pour le fetch, `next/font`, Zod côté formulaires, modèle Prisma propre). **Mais une faille de sécurité critique d'élévation de privilèges** et **un système de stockage de fichiers cassé en production** plombent la note. Ce sont des problèmes de *trust boundary*, pas de cosmétique : ils sont exploitables.

| Sévérité | Nombre |
|---|---|
| 🔴 Critique | 3 |
| 🟠 Important | 8 |
| 🟡 Mineur | 10 |

**Verdict en une phrase :** architecture prometteuse mais la frontière de confiance (Server Actions / upload) n'est pas sécurisée — à traiter **avant** toute autre chose.

---

## 🔴 PROBLÈMES CRITIQUES

### C1 — Les Server Actions admin n'ont AUCUN contrôle d'autorisation (élévation de privilèges)

**Section grille : 🔒 Sécurité / 🏗️ Architecture**

`src/app/(app)/admin/_actions/admin.actions.ts` — **aucune** des 12 actions ne vérifie l'identité ni le rôle de l'appelant. Exemple :

```ts
// admin.actions.ts:9
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await prisma.user.update({ where: { id: userId }, data: { role } }); // ⛔ zéro contrôle
    revalidatePath("/admin/users");
    return { success: true };
  } ...
}
```

**Pourquoi c'est grave.** Une Server Action `"use server"` est compilée en **endpoint HTTP POST public**. La protection par rôle se trouve uniquement dans `admin/layout.tsx` (le rendu de la *page*), mais le layout ne protège **pas** l'action. Le `middleware.ts` n'exige qu'un cookie de session présent. Donc **n'importe quel CHEF connecté** peut appeler l'action directement et :

```ts
updateUserRole("<mon-propre-id>", "ADMIN")   // → je deviens ADMIN
deleteObjectif(...), createEtape(...), assignReferentToEtape(...) // → manipulation totale des données
```

C'est une élévation de privilèges complète + manipulation arbitraire de la base.

**Solution.** Centraliser un garde réutilisable et l'appeler en **première ligne** de chaque action sensible (et valider les entrées avec Zod, cf. C3) :

```ts
// src/lib/auth-guards.ts
import { getUser } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export async function requireRole(...roles: UserRole[]) {
  const user = await getUser();
  if (!user || !("role" in user) || !roles.includes(user.role as UserRole)) {
    throw new Error("UNAUTHORIZED"); // capté par error.tsx, ne fuite rien
  }
  return user;
}
```

```ts
// admin.actions.ts — chaque action
export async function updateUserRole(userId: string, role: UserRole) {
  await requireRole("ADMIN");                       // ✅ garde
  const data = UpdateUserRoleSchema.parse({ userId, role }); // ✅ validation (C3)
  await prisma.user.update({ where: { id: data.userId }, data: { role: data.role } });
  revalidatePath("/admin/users");
  return { success: true };
}
```

> **Ne jamais** se fier au layout ni au middleware pour autoriser une mutation. La règle Next.js : *chaque Server Action et chaque Route Handler ré-authentifie et ré-autorise*, comme s'il était appelé par un attaquant — c'est exactement le cas.

---

### C2 — Stockage des fichiers écrit dans `public/` au runtime (cassé en prod + risque XSS)

**Section grille : 🔒 Sécurité / 🏗️ Architecture / 📦 Dépendances**

`src/services/storage.service.ts` écrit les uploads sur le disque local :

```ts
// storage.service.ts:28
const uploadDir = path.join(process.cwd(), "public", folder);
await mkdir(uploadDir, { recursive: true });
await writeFile(finalPath, buffer);
return { url: `/${folder}/${uniqueFilename}`, pathname: finalPath };
```

**Trois problèmes cumulés :**

1. **Cassé sur Vercel/serverless.** Le FS y est en lecture seule / éphémère. Or `@vercel/blob` est installé (`package.json`) mais **jamais utilisé** dans `src/` → migration inachevée. Les fichiers déjà écrits dans `public/` après le build ne sont de toute façon pas resservis, et tout disparaît au redéploiement.
2. **Aucune validation de type/taille côté serveur.** `submitRealisation` accepte n'importe quel `File` (la seule limite est `bodySizeLimit: '10mb'`). Un utilisateur authentifié peut uploader un `.html`/`.svg` malveillant, **servi depuis l'origine de l'app** → **XSS stocké**.
3. Architecture : un service nommé « storage » couplé en dur au FS local, alors que le projet vise Vercel.

**Solution — utiliser `@vercel/blob` (déjà installé) + whitelist stricte :**

```ts
import { put } from "@vercel/blob";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const MAX = 5 * 1024 * 1024;

export class StorageService {
  static async uploadFile(file: File, folder = "uploads") {
    if (!file) throw new Error("Aucun fichier fourni");
    if (!ALLOWED.includes(file.type)) throw new Error("Type de fichier non autorisé");
    if (file.size > MAX) throw new Error("Fichier trop volumineux (max 5 Mo)");

    const safeName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase();
    const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { url: blob.url, pathname: blob.pathname };
  }
}
```

Si vous restez sur un VPS, écrivez **hors de `public/`** (ex. `/var/data/uploads`) et servez via une Route Handler authentifiée — jamais directement depuis l'origine.

---

### C3 — Aucune validation serveur des entrées (Zod uniquement côté client)

**Section grille : 🔒 Sécurité / 🧹 Qualité**

Zod est utilisé dans **6 formulaires** (`login-form`, `signup-form`, modales admin) mais dans **0 Server Action**. Toutes les actions font confiance à leurs arguments :

```ts
// admin.actions.ts:127 — la forme de `data` n'est jamais validée à l'exécution
export async function createEtape(data: { number: string; name: string; /* … */
  objectifs: { code: string; type: "COMPETENCE" | "REALISATION"; ... }[] }) {
  await prisma.etape.create({ data: { ...data, objectifs: { create: data.objectifs } } });
}
```

La validation client est une UX, **pas** une sécurité : elle est contournable (appel direct de l'action). Couplé à C1, un attaquant envoie des payloads arbitraires.

**Solution — un schéma Zod par action, partagé avec le formulaire :**

```ts
// src/actions/etape/etape.schema.ts
export const CreateEtapeSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(2000),
  ordre: z.number().int().nonnegative(),
  objectifs: z.array(z.object({
    code: z.string().min(1),
    description: z.string().min(1),
    type: z.enum(["COMPETENCE", "REALISATION"]),
    fichiersRequis: z.boolean(),
  })).max(50),
});

// action
export async function createEtape(input: unknown) {
  await requireRole("ADMIN");
  const data = CreateEtapeSchema.parse(input); // lève si invalide
  await prisma.etape.create({ data: { ...data, objectifs: { create: data.objectifs } } });
  revalidatePath("/admin/etapes");
  return { success: true };
}
```

Le même schéma alimente `zodResolver` côté formulaire → **une seule source de vérité**, validée des deux côtés.

---

## 🟠 PROBLÈMES IMPORTANTS

### I1 — IDOR sur les commentaires : `getComments` / `submitComment` sans contrôle d'accès

**Section grille : 🔒 Sécurité / ♻️ Redondance**

Incohérence frappante : la **Route API** `api/justifications/[id]/comments/route.ts` vérifie correctement que l'utilisateur est le chef propriétaire **ou** un référent assigné à l'étape (lignes 51–73). Mais la **Server Action** équivalente ne fait qu'un contrôle d'authentification :

```ts
// comment.actions.ts:13 — getComments
const user = await getUser();
if (!user) return { success: false, error: "Non authentifié" };
const commentaires = await prisma.commentaire.findMany({ where: { justificationId }, ... });
// ⛔ aucun contrôle que l'utilisateur a le droit de LIRE cette justification
```

→ N'importe quel utilisateur connecté peut lire/écrire les commentaires de **n'importe quelle** justification en passant un `justificationId` arbitraire (IDOR). En prime, c'est de la **redondance** : deux chemins (action + route API) pour la même donnée, avec des règles d'accès divergentes.

**Solution.** Extraire l'autorisation dans une fonction unique (`canAccessJustification(user, justificationId)`) appelée par les deux, **ou** supprimer un des deux chemins. `getComments` doit refuser si l'utilisateur n'est ni le chef, ni un référent assigné à `justification.etapeId`.

### I2 — IDOR sur `markNotificationAsRead`

`notification.actions.ts:39` met à jour une notification par son id **sans vérifier le destinataire** — alors que `NotificationService.markAsRead` (qui n'est pas appelé ici) le fait, lui. Un utilisateur peut marquer « lue » la notif d'autrui.

```ts
// Correctif : scoper la mutation au propriétaire
const user = await getUser();
if (!user) return { success: false, error: "Non autorisé" };
await prisma.notification.updateMany({               // updateMany + filtre = pas de fuite
  where: { id: notificationId, destinataireId: user.id },
  data: { lue: true, lueAt: new Date() },
});
```

### I3 — Architecture des Server Actions incohérente (services contournés)

**Section grille : 🏗️ Architecture / ♻️ Redondance**

Deux styles cohabitent :
- `justification.actions.ts` et `comment.actions.ts` **délèguent** à une couche `services/` (bien) ;
- `admin.actions.ts`, `competence.actions.ts`, `realisation.actions.ts`, `notification.actions.ts`, `etape.actions.ts` tapent **directement** dans `prisma`.

Pire, `etape.actions.ts:validateEtape` **duplique** la logique de `services/etape.service.ts:validateBadge` (upsert du statut + notification) — l'un des deux est du **code mort**. Décidez d'une règle : *« action = auth + validation + revalidate ; toute la logique métier + accès Prisma vit dans `services/` »*, puis alignez tout dessus. Supprimez `EtapeService.validateBadge` **ou** faites pointer l'action dessus.

### I4 — `useState(props)` : l'état client ne se resynchronise pas avec le serveur

**Section grille : 🔄 State / ⚡ Performance**

```ts
// DashboardClient.tsx:27
const [etapes, setEtapes] = useState<EtapeAvecObjectifs[]>(initialEtapes);
```

`useState(initialProps)` ne capture la prop qu'au **montage**. Après un `revalidatePath`, le Server Component renvoie de nouvelles `etapes`, mais le state local les **ignore** → données potentiellement périmées. Le code compense par des updates optimistes manuelles (`updateJustification`), ce qui est fragile et duplique la logique serveur.

**Solution :** soit dériver l'affichage directement des props (état serveur = source de vérité) et utiliser `router.refresh()` ; soit, si l'on garde un cache local, le resynchroniser via `key={...}` sur le composant ou un `useEffect` de sync explicite. Le plus simple et robuste ici : s'appuyer sur les props serveur + `useOptimistic` (déjà maîtrisé dans `ChatPanel`).

### I5 — Fetch dans `useEffect` sans `AbortController` (race condition)

`ChatPanel.tsx:49` charge les commentaires à l'ouverture du drawer. Si `justificationId` change vite, une réponse lente peut écraser une réponse récente. De plus l'état est géré en triple (`comments` + `useOptimistic` + ré-append manuel) — convoluté.

```ts
useEffect(() => {
  if (!isOpen || !justificationId) return;
  const ac = new AbortController();
  (async () => {
    setIsLoading(true);
    const result = await getComments(justificationId /*, ac.signal */);
    if (ac.signal.aborted) return;
    result.success ? setComments(result.data!) : setError(result.error!);
    setIsLoading(false);
  })();
  return () => ac.abort();
}, [isOpen, justificationId]);
```

### I6 — `react-hooks/exhaustive-deps` désactivé globalement

`eslint.config.mjs:93` : `"react-hooks/exhaustive-deps": "off"`. Cette règle attrape une grande partie des bugs de hooks (effets qui ne se relancent pas, closures périmées). La désactiver masque exactement le type de bug de I4/I5. Repassez-la en `"warn"` et corrigez les avertissements au fil de l'eau (souvent il suffit d'ajouter la dépendance ou d'extraire la fonction).

### I7 — Prolifération de `any` (~40 occurrences) sur des données Prisma typées

**Section grille : 🧹 Qualité / 🧱 Composants**

Les pages admin typent leurs props en `any[]` alors que Prisma **génère déjà les types** :

```ts
// users/ClientPage.tsx:13 / etapes/ClientPage.tsx:11 / troupes/ClientPage.tsx:9 …
troupes: any[];
etapes: any[];
const handleEdit = (user: any) => { ... }
// AppClientLayout.tsx:12, SidebarContent.tsx:8, ContextSwitcher.tsx:139 : user: any
```

On perd l'autocomplétion, la détection d'erreurs et la sécurité au refactor — sur la partie la plus sensible (admin). Remplacez par les types Prisma + `Prisma.<Model>GetPayload<...>` pour les relations :

```ts
import { Prisma } from "@prisma/client";
type EtapeWithObjectifs = Prisma.EtapeGetPayload<{ include: { objectifs: true } }>;
// props: { etapes: EtapeWithObjectifs[] }
```

### I8 — `<html lang="en">` sur une application 100 % francophone

**Section grille : ♿ Accessibilité**

`app/layout.tsx:32` déclare `lang="en"` alors que toute l'UI est en français. Impact réel pour les lecteurs d'écran (prononciation) et le SEO. Corrigez en `lang="fr"`. (Bonne nouvelle : les 2 `<img>` bruts — `JustificationContent.tsx:51`, `ObjectifModal.tsx:230` — ont bien un `alt` ; voir section mineure pour le passage à `next/image`.)

---

## 🟡 AMÉLIORATIONS MINEURES

- **🟡 `target: "es5"` dans `tsconfig.json`.** Anachronique pour React 19 / Next 16 : transpilation plus lourde et bundle plus gros (helpers, regenerator). Passez à `"ES2022"`. *(C'est le seul changement non encore commité — votre diff de `tsconfig` modernise déjà `moduleResolution`/`jsx`, autant finir le travail.)*
- **🟡 `next.config.ts` minimaliste.** Aucun header de sécurité ni config images. Ajoutez `headers()` (CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, HSTS) et, si vous passez à Vercel Blob, `images.remotePatterns`.
- **🟡 `<img>` au lieu de `next/image`** dans `JustificationContent.tsx:51` et `ObjectifModal.tsx:230` → pas d'optimisation/lazy/responsive. Sur `contentChemise.tsx:68`, `next/image` est utilisé mais sans `sizes` et avec `src={etape.image_src || ""}` (un src vide lève une erreur — préférez un placeholder ou un rendu conditionnel).
- **🟡 Dépendances inutilisées.** `@vercel/blob` (installé, jamais importé — cf. C2), `next-themes` (installé, **aucun** `ThemeProvider` dans `providers.tsx` ni `useTheme` → fonctionnalité de thème non câblée malgré `suppressHydrationWarning`). Vérifiez aussi `intl-messageformat`. Lancez `npx depcheck`.
- **🟡 Stratégie d'import HeroUI mixte.** Le barrel `@heroui/react` est importé dans **40 fichiers**, *et* ~40 paquets granulaires `@heroui/*` sont déclarés. Choisissez une approche (le barrel + `optimizePackageImports` suffit généralement) et retirez les paquets granulaires redondants.
- **🟡 42 `console.*`** dans `src/` (dont 12 dans `admin.actions.ts`). Acceptables en `catch`, mais introduisez un vrai logger (ou au moins ne loggez pas en prod) ; la règle ESLint `no-console: warn` les signale déjà.
- **🟡 `error.tsx` indigent.** Unique boundary, non stylé, en anglais (« Something went wrong! »). Aucun `loading.tsx` ni `not-found.tsx` par segment → pas d'état de chargement (Suspense) ni de 404 personnalisée. Ajoutez-en au moins sur `(dashboard)` et `(referent)`.
- **🟡 Types dupliqués.** `types/index.ts` : `JustificationAvecCommentaires` vs `JustificationWithComments` (FR/EN) se recouvrent. Fusionnez.
- **🟡 Nommage FR/EN incohérent.** Modèle/champs en français (`nom`, `contenu`, `etape`), messages d'erreur admin en anglais (`"Failed to update user role"`) vs français ailleurs. Choisissez **une** langue pour le code (l'anglais est la convention) et gardez le français pour l'UI uniquement.
- **🟡 `include: {}` vide** dans `(dashboard)/page.tsx:25` (no-op à supprimer) ; et la recherche de `AdminDataTable` fait `Object.values(item)` qui stringifie les objets imbriqués (`[object Object]`) — filtrez sur des champs explicites.

---

## ✅ CE QUI EST BIEN FAIT

- **Organisation App Router exemplaire** : route groups `(auth)`, `(app)`, `(dashboard)`, `(referent)`, `admin` ; colocation via `_components` / `_actions`. Lisible et idiomatique.
- **Amorce de couche `services/`** (justification, comment, notification, etape, storage) avec un type `ServiceResult` cohérent — bonne intuition de séparation logique métier / accès données. Le `JustificationService` fait correctement le contrôle « référent assigné à l'étape ».
- **Server Components pour le fetch** avec `Promise.all` (`(dashboard)/page.tsx`, `referent/dashboard/page.tsx`) — le bon endroit pour aller chercher les données.
- **Code-splitting du module 3D** : `chemiseModel` est chargé via `dynamic(..., { ssr: false })` avec fallback — exactement ce qu'il faut pour une dépendance Three.js lourde. 👏
- **`next/font`** (Inter + Fira_Code) bien configuré.
- **Formulaires** : `react-hook-form` + `zodResolver` + états d'erreur propres (`login-form`, `signup-form`, modales).
- **`useOptimistic`** maîtrisé dans le chat ; abstraction générique réutilisable `AdminDataTable<T>`.
- **Schéma Prisma soigné** : relations explicites, `onDelete` cohérents, contraintes `@@unique` pertinentes (`[chefId, objectifId]`…), enums métier clairs, soft-flag `actif`.
- **Hygiène repo** : `.env*` bien gitignoré (aucun secret committé — vérifié via `git ls-files`), ESLint avec `jsx-a11y`, `unused-imports`, `import/order`, Prettier.

---

## 🗺️ PLAN DE REFACTORISATION

Ordonné par **impact ↓ / risque ↓** : on sécurise d'abord (fort impact, risque faible car additif), puis on fiabilise, puis on polit. Chaque étape est livrable indépendamment, **sans changer le comportement métier**.

### Étape 1 — Colmater la sécurité (🔴 C1, C3, I1, I2) — *priorité absolue, ~1–2 j*
1. Créer `src/lib/auth-guards.ts` (`requireRole`, `canAccessJustification`).
2. Ajouter `await requireRole("ADMIN")` en tête de **chaque** action de `admin.actions.ts`.
3. Ajouter un schéma Zod par action mutative et `Schema.parse(input)`.
4. Ajouter l'autorisation manquante à `getComments`/`submitComment` et scoper `markNotificationAsRead` au destinataire.

> Risque faible : on ajoute des gardes, on ne touche pas à la logique. **Testez chaque rôle après coup** (un CHEF ne doit plus pouvoir appeler une action admin).

### Étape 2 — Réparer le stockage (🔴 C2) — *~0,5–1 j*
Basculer `StorageService` sur `@vercel/blob` (déjà installé) + whitelist type/taille. Migrer les fichiers existants si besoin. Supprimer la dépendance au FS `public/`.

### Étape 3 — Fiabiliser l'état & les hooks (🟠 I4, I5, I6) — *~1 j*
Réactiver `exhaustive-deps` en `warn`. Corriger `DashboardClient` (props serveur comme source de vérité). Ajouter `AbortController` à `ChatPanel` et simplifier sa triple gestion d'état.

### Étape 4 — Unifier l'architecture des actions (🟠 I3) — *~1 j*
Adopter la règle « action = auth + Zod + revalidate ; métier dans `services/` ». Migrer `competence/realisation/notification/etape` vers des services. Supprimer le doublon `validateEtape` vs `EtapeService.validateBadge`.

### Étape 5 — Restaurer le typage (🟠 I7) — *progressif, faible risque*
Remplacer les `any` des pages admin et des layouts par les types Prisma (`Prisma.<Model>GetPayload`). À faire fichier par fichier.

### Étape 6 — Polish & config (🟡) — *au fil de l'eau*
`lang="fr"` ; `tsconfig target: ES2022` ; headers de sécurité dans `next.config` ; `next/image` partout ; `error.tsx`/`loading.tsx`/`not-found.tsx` par segment ; `npx depcheck` (retirer `@vercel/blob` si non migré, `next-themes` ou le câbler) ; fusionner les types dupliqués.

### Étape 7 — Tests (🧪 transverse, actuellement **0 test**)
La couche `services/` (logique pure, peu couplée à React) est le **point d'entrée idéal** pour des tests unitaires (Vitest). Commencez par `JustificationService` et les gardes d'auth de l'étape 1 — ce sont vos invariants de sécurité, ceux qu'il faut verrouiller contre les régressions.
