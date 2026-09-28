# CLAUDE.md

Flambeaux Progrès — app **Next.js 16** (App Router, Turbopack) de suivi de progression scoute (rôles CHEF / REFERENT / ADMIN). Stack : Prisma 6 (MySQL), HeroUI, Tailwind 4, react-hook-form + Zod. Rôles d'encadrement en plus : COMMISSION_FORMATION, COORDINATEUR_NATIONAL (`src/lib/roles.ts`).

Auth : pas de compte propre à l'app. La session vient du WordPress de la plateforme (cookie `wordpress_logged_in*`) : `src/proxy.ts` redirige vers la connexion WordPress sans cookie, puis `getUser()` (`src/lib/auth-server.ts`) valide la session auprès de l'API WordPress (réponse gardée 60 s en mémoire par session, `getSessionWp` dans `src/lib/wordpress-auth.ts`). Chaque page et action revérifie le rôle (`exigerRole` / `authorizeRole` de `src/lib/auth-guards.ts`).

## Documentation

Index dans `README.md` (section « Documentation ») ; les décisions métier et plans de refactor vivent dans `docs/*.md`.

## Refactors par phases

Les gros refactors sont planifiés dans `/docs/*.md` avec une checklist de phases.

**Règle : à la fin de chaque phase terminée ET validée, mettre à jour le doc correspondant** — cocher la phase `[x]` et ajouter une courte note **« ✅ Fait — quoi / où (fichiers) / comment »**. Le doc reste la source de vérité de l'avancement.

## Conventions de code

Les règles complètes sont dans `GUIDE-CODE-PROPRE.md` ; l'essentiel :

- **Pas de commentaires explicatifs** dans le code : on garde uniquement les directives fonctionnelles (`eslint-disable*`, `@ts-*`, `prettier-ignore`, `turbopackIgnore`). Code auto-documenté.
- **Server Actions** : toujours `auth (auth-guards) + validation Zod` en tête ; la logique métier vit dans `src/services/`, pas dans l'action.
- Avant de conclure une tâche : `npx tsc --noEmit`, `npm run build` et `npm test` doivent passer.

## Commandes

- Dev : `npm run dev`
- Build : `npm run build`
- Tests : `npm test` (vitest)
- DB (Prisma Migrate) : `npx prisma migrate dev --name <nom>` applique le schéma et relance le seed.
  ⚠️ **Le seed vide toute la base** avant de la remplir : sur une base qui contient des données, préférer une migration écrite à la main (`prisma/migrations/<horodatage>_<nom>/migration.sql`), appliquée avec `npx prisma migrate deploy` puis `npx prisma generate`. Vérifier l'absence d'écart avec `npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script` (doit répondre « empty migration »).
  ⚠️ **Stopper `npm run dev` avant**, sinon le client Prisma est verrouillé (EPERM sur le query engine `.dll`).
Ne jamais ajouter de trailer Co-Authored-By dans les messages de commit.