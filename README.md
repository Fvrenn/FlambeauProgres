# Flambeaux Progrès

Application de suivi de la formation des Chefs Flambeaux. Les Chefs justifient les compétences et
réalisations de chaque étape de leur parcours (livrets « Allume-feu », « Découvrir », spécialités,
« Servir ») ; les référents, la commission Formation et le Coordinateur National les évaluent et
valident les badges.

**Stack :** Next.js 16 (App Router), React 19, TypeScript, Prisma 6 (MySQL), HeroUI, Tailwind 4,
Vitest.

## Fonctionnement en bref

- **Pas de comptes propres à l'app.** La session vient du WordPress de la plateforme
  (`plateforme.flambeaux.org`) : sans cookie `wordpress_logged_in*`, `src/proxy.ts` renvoie vers la
  connexion WordPress. Le profil (nom, email, branche, progression déclarée) est lu depuis l'API
  WordPress. Les **rôles** (Chef, Référent, Admin, Commission Formation, Coordinateur National) sont
  gérés dans l'app, page Admin → Utilisateurs.
- **Évaluation** : un référent assigné évalue une spécialité (étape 2) ; l'étape 3 est évaluée par
  la commission Formation puis validée par le Coordinateur National, comme le prévoit le livret.
- **Fichiers déposés** : stockés hors de `public/`, dans `UPLOAD_DIR`, et servis uniquement aux
  personnes autorisées.

## Développement

### Prérequis

- Node.js 20.9+
- MySQL 8

### Installation

```bash
npm install
cp .env.example .env        # puis compléter DATABASE_URL, APP_URL, WORDPRESS_URL…
npx prisma migrate deploy   # crée les tables
npx prisma db seed          # étapes, objectifs et quelques utilisateurs
npm run dev
```

> ⚠️ **Le seed vide entièrement la base** avant de la remplir, et `npx prisma migrate dev` le
> relance automatiquement. Sur une base qui contient des données, appliquer les migrations avec
> `npx prisma migrate deploy`.

**Se connecter en local.** Comme l'authentification repose sur les cookies de
`plateforme.flambeaux.org`, le navigateur ne les envoie qu'à un domaine en `.flambeaux.org`, en
HTTPS. L'environnement de dev actuel sert l'app sur `https://dev.flambeaux.org:3000`
(`dev.flambeaux.org` pointé sur la machine locale, `npm run dev:https`), puis on se
connecte avec un compte de la plateforme. Un utilisateur du seed est rattaché à un compte WordPress
qui a le même email.

### Scripts

```bash
npm run dev           # serveur de développement
npm run dev:https     # idem en HTTPS (dev.flambeaux.org, cookies WordPress)
npm run build         # build de production (régénère aussi les icônes)
npm test              # tests (Vitest)
npm run lint          # ESLint + Prettier, avec correction
npm run build:icons   # régénère src/lib/icons.generated.ts depuis les icônes utilisées
npm run glb:optimize  # recompresse public/chemise/chemise.glb (Draco)
```

Avant de conclure une modification : `npx tsc --noEmit`, `npm run build` et `npm test` doivent
passer.

## Configuration

Toutes les variables sont décrites dans `.env.example`. `APP_URL` et `WORDPRESS_URL` sont
obligatoires (vérifiées au démarrage par `scripts/check-env.mjs`) ; sans `SMTP_HOST` ni
`EMAIL_FROM`, l'app fonctionne mais n'envoie aucun email.

## Déploiement

- Une image Docker est construite et publiée sur `ghcr.io/fvrenn/flambeau-progres` à chaque push sur
  `main` et à chaque tag `v*` (`.github/workflows/docker.yml`).
- Au démarrage, le conteneur vérifie la configuration, applique les migrations
  (`prisma migrate deploy`, jamais le seed) puis lance le serveur sur le port `8022`.
- **Monter un volume sur `/app/uploads`** : c'est là que sont stockés les fichiers déposés.
- Derrière un reverse proxy, renseigner `APP_URL` avec l'URL publique, et **ne pas poser de
  `Content-Security-Policy`** au niveau du proxy : l'app envoie la sienne (voir
  `docs/csp-durcissement.md`).

## Documentation

| Fichier | Contenu |
| --- | --- |
| `CLAUDE.md` | Consignes courtes pour travailler sur le projet |
| `GUIDE-CODE-PROPRE.md` | Règles de code, où ranger quoi, conventions Next.js |
| `docs/etape-3-profils.md` | Étape 3 « Servir » : profils, accès, rôles et circuit d'évaluation |
| `docs/sync-progression-plateforme.md` | Synchronisation de la progression avec la plateforme WordPress |
| `docs/csp-durcissement.md` | Content-Security-Policy et suppression des CDN tiers |
| `docs/refacto-code-propre.md` | Refacto et audit de sécurité de septembre 2026 (historique) |
| `docs/nettoyage-code.md` | Nettoyage : code inutile, redondances et composants réutilisables |
