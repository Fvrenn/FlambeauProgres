# CLAUDE.md

Flambeau Progrès — app **Next.js 16** (App Router, Turbopack) de suivi de progression scoute (rôles CHEF / REFERENT / ADMIN). Stack : Prisma 6 (MySQL), better-auth, HeroUI, Tailwind 4, react-hook-form + Zod.

## Refactors par phases

Les gros refactors sont planifiés dans `/docs/*.md` avec une checklist de phases.

**Règle : à la fin de chaque phase terminée ET validée, mettre à jour le doc correspondant** — cocher la phase `[x]` et ajouter une courte note **« ✅ Fait — quoi / où (fichiers) / comment »**. Le doc reste la source de vérité de l'avancement.

## Conventions de code

- **Pas de commentaires explicatifs** dans le code : on garde uniquement les directives fonctionnelles (`eslint-disable*`, `@ts-*`, `prettier-ignore`, `turbopackIgnore`). Code auto-documenté.
- **Server Actions** : toujours `auth (auth-guards) + validation Zod` en tête ; la logique métier vit dans `src/services/`, pas dans l'action.
- Avant de conclure une tâche : `npx tsc --noEmit`, `npm run build` et `npm test` doivent passer.

## Commandes

- Dev : `npm run dev`
- Build : `npm run build`
- Tests : `npm test` (vitest)
- DB (Prisma Migrate) : `npx prisma migrate dev --name <nom>` applique le schéma et relance le seed.
  ⚠️ **Stopper `npm run dev` avant**, sinon le client Prisma est verrouillé (EPERM sur le query engine `.dll`).
