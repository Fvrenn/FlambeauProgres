# Flambeau Progrès 🏕️✨

**Révolutionner le suivi pédagogique des Chefs Flambeaux.**

Flambeau Progrès est une application web privée et motivante conçue pour remplacer l'ancien processus PDF "chiant" de validation des étapes (badges) par un workflow digital simple et efficace.

L'objectif n'est pas de "fliquer", mais d'**encourager** et de **motiver** les chefs animateurs à suivre leur formation personnelle pour, à terme, recevoir leur vrai badge physique à coudre sur leur chemise.

![Maquette de l'application](lien/vers/ton/image_183206.jpg)

---

## 🎯 À quoi sert cette application ?

* **Le Problème :** La validation des badges nécessitait de remplir des PDF complexes, de les envoyer par email, et de multiples échanges avec un référent, un processus long et démotivant.
* **La Solution :** Une interface web claire avec une chemise 3D personnelle, un formulaire de justification simplifié, et un dashboard clair pour les référents.

## 🧑‍🎓 Pour qui ?

Ce projet s'articule autour de 4 rôles clés :

1.  **🧑‍🎓 Le Chef (Animateur) :** L'utilisateur principal. Il se connecte pour justifier ses `Compétences` (auto-validation) et soumettre ses `Réalisations` (validation par un référent).
2.  **🧑‍🏫 Le Référent :** Le validateur bienveillant. Il reçoit les soumissions de `Réalisations`, les examine, et donne son "tampon" (validation) ou son feedback.
3.  **🫡 Le Chef de Troupe :** Le gestionnaire de terrain. Il est notifié (via un dashboard dédié) lorsque les chefs de sa troupe ont complété un badge, afin qu'il puisse commander le badge physique.
4.  **🧑‍💻 L'Admin :** Le gestionnaire du système. Il crée les badges, les objectifs, gère les troupes et assigne les rôles.

## ✨ Fonctionnalités Clés

* **Chemise 3D Personnelle :** Un dashboard visuel et privé pour suivre sa progression de badges.
* **Workflow Simplifié :**
    * **Compétences :** Auto-validation via un simple champ de justification textuel.
    * **Réalisations :** Soumission simple (texte + 1 fichier) pour validation par un Référent.
* **100% Privé :** Ceci n'est **pas** un réseau social. Les profils ne sont pas publics. L'aspect social se passe dans la "vraie vie" quand le Chef montre son vrai badge cousu.
* **Pas de Mode Hors-Ligne :** Conçu pour être utilisé "au calme chez soi" (PC ou mobile) pour débriefer ses activités, pas sur le terrain.
* **Dashboards par Rôle :** Des interfaces dédiées et épurées pour les Référents, les Chefs de Troupe et les Admins.

## 🛠️ Stack Technique

* **Framework :** Next.js (Full-Stack)
* **Base de Données :** PostgreSQL
* **ORM :** Prisma
* **Authentification :** Better Auth
* **UI :** Tailwind CSS
* **3D :** Three.js / React Three Fiber

## 🚀 Démarrage Rapide

Instructions pour lancer le projet en local.

1.  **Cloner le dépôt**
    ```bash
    git clone [https://github.com/ton-nom/flambeau-progres.git](https://github.com/ton-nom/flambeau-progres.git)
    cd flambeau-progres
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement**
    * Copiez `.env.example` en `.env`
    * Remplissez la variable `DATABASE_URL` (PostgreSQL).
    ```bash
    cp .env.example .env
    ```

4.  **Lancer la migration de la base de données**
    ```bash
    npx prisma migrate dev
    ```

5.  **Démarrer le serveur de développement**
    ```bash
    npm run dev
    ```

Le projet est maintenant accessible sur `http://localhost:3000`.

## 🏛️ Documentation Approfondie

Ce README est un résumé. Pour une compréhension complète de l'architecture, des parcours utilisateurs et du schéma de base de données, veuillez consulter notre documentation détaillée :

* **[📁 Dossier de Documentation Principal](./docs/README.md)**
* **[🗺️ Parcours Utilisateurs & Workflows](./docs/WORKFLOWS.md)**
* **[💾 Architecture & Schéma de BDD](./docs/ARCHITECTURE.md)**