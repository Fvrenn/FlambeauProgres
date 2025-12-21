# Flambeau Progrès

Application web de suivi pédagogique pour les Chefs Flambeaux. Permet aux animateurs de valider leurs compétences et réalisations pour obtenir leurs badges, avec un système de validation par référents.

**Stack :** Next.js 15, MySQL, Prisma, TypeScript

---

## Installation

### Prérequis
- Node.js 20+
- MySQL 8.0+ (XAMPP recommandé)
- Git

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/Fvrenn/FlambeauProgres.git
cd FlambeauProgres

# 2. Installer les dépendances
npm install

# 3. Configurer MySQL
# Avec XAMPP : Démarrez MySQL et créez la base "flambeau_progres" dans phpMyAdmin
# Ou en CLI : mysql -u root -p puis CREATE DATABASE flambeau_progres;


# 5. Initialiser la base de données
npx prisma migrate dev

# 6. (Optionnel) Ajouter des données de test
npx prisma db seed

# 7. Lancer le serveur
npm run dev
```

**Accès :** http://localhost:3000

**Comptes de test :**
- Chef : `chef1@example.com` / `password123`
- Référent : `referent1@example.com` / `password123`
- Admin : `admin@example.com` / `password123`

---

## Scripts

```bash
npm run dev    # Développement
npm run build  # Build production
npm start      # Lancer en production
```
