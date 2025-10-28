# 🚀 Roadmap de Développement Séquentielle

Voici les tâches de développement, classées dans un ordre logique pour construire l'application de manière incrémentale.

## ✅ Phase 0 : Setup (Terminé)

* [✓] Initialisation du projet Next.js
* [✓] Configuration de l'Authentification (Better Auth)
* [✓] Configuration de la UI (Tailwind, HeroUI)
* [✓] Création du Layout principal (Sidebar)

## Phase 1 : Fondation des Données (Backend Core)

*Objectif : Mettre en place la base de données et les données de test.*

1.  **Schéma Prisma :** Finaliser et valider le `schema.prisma` (avec `Troupe`, `Justification` simplifiée, `etapeCommande`, etc.).
2.  **Migration Initiale :** Lancer `npx prisma migrate dev`.
3.  **Script de Seed :** (Tâche cruciale) Créer un script `prisma/seed.ts` qui peuple la base de données avec des données de test réalistes :
    * 1 `User` (Admin)
    * 1 `Troupe`
    * 2 `User` (Chef) assignés à la Troupe
    * 1 `User` (Referent)
    * 2 `etape` (ex: "Construction", "Cuisine")
    * ~5 `Objectif` par etape (mélange `COMPETENCE` / `REALISATION`)
    * 1 `etapeReferent` (lier le Référent au etape "Construction")
4.  **Lancer le Seeding :** Configurer `package.json` pour lancer le seed.

## Phase 2 : Parcours Chef (MVP - Frontend)

*Objectif : Permettre au Chef de voir et de justifier ses objectifs.*

5.  **Dashboard Chef (`/dashboard`) :**
    * Afficher la grille 2D des `etape`.
    * (Placeholder pour la 3D).
6.  **Panneau `Objectifs` (Client Component) :**
    * Au clic sur une etape, fetch et afficher les `Objectif` (avec onglets `Compétences` / `Réalisations`).
7.  **Logique d'État Visuel :**
    * Fetch les `Justification` du Chef connecté.
    * Afficher le statut de chaque objectif (Non fait, Soumis, Validé...).
8.  **Modale & Action (Compétence) :**
    * Créer le formulaire (1 champ `contenu`).
    * Créer la Server Action `submitCompetence(objectifId, contenu)` qui crée la `Justification` avec `statut: 'AUTO_VALIDEE'`.
9.  **Modale & Action (Réalisation) :**
    * Gérer l'upload de fichier (ex: Vercel Blob, S3, ou upload local simple pour le dev).
    * Créer le formulaire (`contenu` + `file`).
    * Créer la Server Action `submitRealisation(objectifId, contenu, fileUrl)` qui crée la `Justification` (`SOUMISE`) et la `Notification` pour le Référent.
10. **Panneau `Notifications` (Chef) :**
    * Créer le composant qui fetch et affiche les `Notification` de l'utilisateur.

## Phase 3 : Parcours Référent (MVP - Boucle)

*Objectif : Permettre au Référent de fermer la boucle de validation.*

11. **Logique de Sidebar (Référent) :**
    * Implémenter le "Sélecteur de Contexte" (basé sur `session.user.role`).
    * Implémenter le "Sélecteur de etape Actif" (fetch `etapeReferent`).
12. **Dashboard Référent (`/referent/dashboard`) :**
    * Créer l'**Onglet 1 : "Réalisations à valider"**.
    * Fetch et afficher la liste des `Justification` (`statut: 'SOUMISE'`, `etapeId: activeetapeId`).
13. **Modale & Actions (Validation) :**
    * Au clic, afficher le `contenu` et le `fichier` soumis.
    * Créer les 3 boutons (MVP: "Valider", "Refuser").
    * Créer la Server Action `approveJustification(justificationId)` (change statut -> `VALIDEE`, crée `Notification`).
    * Créer la Server Action `rejectJustification(justificationId, motif)` (change statut -> `REFUSEE`, crée `Notification`, crée `Commentaire`).
14. **Test de la Boucle :** Valider qu'un Chef voit bien la notification et le changement de statut.

**--- FIN DU MVP ---**

## Phase 4 : Finalisation des Workflows (V2)

*Objectif : Construire les parcours des autres rôles et la "Revue Finale".*

15. **Flow "Revue Finale" (Référent) :**
    * Créer l'**Onglet 2 : "etapes complets à réviser"** (fetch les Chefs 100% complets).
    * Créer la page/vue de "Revue Finale" (qui liste toutes les justifications des `Competences`).
    * Créer la Server Action `validateetape(chefId, etapeId)` qui crée la `etapeCommande`.
16. **Flow "Chef de Troupe" :**
    * Implémenter la logique d'affichage conditionnel du lien "Ma Troupe" dans la sidebar Chef.
    * Créer la page `/troupe/commandes` (fetch `etapeCommande`).
    * Créer la Server Action `markAsOrdered(commandeId)`.
17. **Système de Commentaires :**
    * Implémenter la Server Action `requestChanges` (Référent) et `submitComment` (Chef/Référent).
    * Afficher le fil de `Commentaire` dans la modal de justification.

## Phase 5 : Dashboard Admin (V2)

*Objectif : Remplacer le "seeding" par une vraie interface de gestion.*

18. **CRUD `Troupes` :** Page `/admin/troupes` (Créer, Editer, Assigner `chefDeTroupeId`).
19. **CRUD `Utilisateurs` :** Page `/admin/users` (Editer `role`, assigner `troupeId`).
20. **CRUD `etapes` & `Objectifs` :** Page `/admin/etapes` et `/admin/objectifs`.
21. **CRUD `Assignations` :** Page `/admin/assignations` (lier `Referent` à `etape`).

## Phase 6 : Polissage (V3)

*Objectif : Ajouter les fonctionnalités de "wow-effect" et de motivation.*

22. **Intégration 3D :** Remplacer la grille 2D par le composant `Chemise3D` (React Three Fiber).
23. **Dashboard "Progression" (Chef) :** Créer l'onglet avec les statistiques de progression (charts, barres de progrès...).
24. **Tests & Optimisations.**