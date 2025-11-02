# [DOCUMENT DE CONCEPTION] Flambeau Progrès

Ce document est la source de vérité pour le projet Flambeau Progrès. Il résume les principes fondateurs, les parcours utilisateurs et les décisions d'architecture.

## 1. Principes Fondamentaux (Le "Pourquoi")

L'objectif de ce projet est de **résoudre un problème de motivation**, pas de créer un outil de "flicage".

* **Motivation > Preuve :** L'application doit être simple, gratifiante et moins "chiante" que l'ancien processus PDF. On fait confiance au Chef pour son auto-validation.
* **100% Privé :** L'application n'est **PAS** un réseau social. Le profil d'un Chef (sa chemise, ses justifications) est privé. L'aspect social se passe dans la "vraie vie", quand le Chef reçoit son etape physique et le coud sur sa chemise.
* **Utilisation "À la maison" :** L'application est conçue pour être utilisée au calme (sur PC ou mobile avec connexion), pour "débriefer" une activité. Elle n'a **PAS** besoin de mode hors-ligne.
* **Simplicité de Justification :** La modal "Quoi, Quand, Avec qui" est **abandonnée**. Elle est remplacée par un unique champ `contenu` (texte) pour les `Compétences`, et `contenu` + `fichier` pour les `Réalisations`.

---

## 2. Les 3 Rôles (Le "Qui")

1.  **🧑‍🎓 Le Chef (Animateur) :** L'utilisateur principal. Il justifie ses `Compétences` et soumet ses `Réalisations`.
2.  **🧑‍🏫 Le Référent :** Le validateur bienveillant. Il valide (tamponne) les `Réalisations` et effectue une "Revue Finale" du etape complet.
3.  **🧑‍💻 L'Admin :** Le gestionnaire du système. Il gère les données (etapes, Troupes, Utilisateurs, Assignations).

---

## 3. Le Workflow Cœur (Le "Comment")

C'est le parcours de validation complet d'une etape.

### A. Parcours du Chef (Justification)

1.  Le Chef se connecte, voit sa chemise 3D sur `/dashboard`.
2.  Il clique sur une etape, le panneau `Objectifs` s'ouvre.
3.  **Cas 1 : Il clique sur une `COMPETENCE`**
    * Une modal s'ouvre avec **un seul champ texte** (`contenu`).
    * Il écrit sa justification (ex: "Lu le Guide du Bois, compris le principe...").
    * Il clique sur "Valider".
    * La `Justification` est créée avec le statut `AUTO_VALIDEE`. **Aucune notification** n'est envoyée.
4.  **Cas 2 : Il clique sur une `REALISATION`**
    * Une modal s'ouvre avec un **champ texte** (`contenu`) et un **upload de fichier**.
    * Il décrit sa réalisation et attache sa preuve (PDF, photo).
    * Il clique sur "Soumettre au Référent".
    * La `Justification` est créée avec le statut `SOUMISE`. Une `Notification` est créée pour le(s) Référent(s) de ce etape.

### B. Parcours du Référent (Validation)

1.  Le Référent se connecte. Il clique sur son profil et utilise le **Sélecteur de Contexte** pour passer sur son "Interface Référent".
2.  Dans sa sidebar, il utilise le **Sélecteur de etape Actif** pour choisir le etape qu'il veut gérer (ex: "Construction").
3.  Il arrive sur la page `/referent/dashboard`. Cette page a **2 onglets** :

    * **Onglet 1 : "Réalisations à valider" (Le micro-travail)**
        * Affiche la liste des `Justification` avec statut `SOUMISE` pour ce etape.
        * Il clique sur une ligne -> une modal s'ouvre -> il voit le `contenu` + `fichier`.
        * Il peut `Valider` (statut -> `VALIDEE`), `Refuser` (statut -> `REFUSEE`) ou `Demander Précision` (statut -> `DEMANDE_PRECISION`). Des `Notification` sont envoyées au Chef en conséquence.

    * **Onglet 2 : "etapes complets à réviser" (La validation finale)**
        * Affiche la liste des **Chefs** qui ont terminé à 100% ce etape (toutes `Competences` en `AUTO_VALIDEE` + toutes `Realisations` en `VALIDEE`).
        * Il clique sur le nom d'un Chef (ex: "Chef Pierre").

4.  Il accède à la page de **"Revue Finale"** pour "Chef Pierre".
5.  Il peut y lire **toutes** les justifications des `Competences` (pour juger du sérieux).
6.  Il clique sur le bouton final **"Valider le etape Complet"**.

---

## 4. Principes d'Architecture

* **Base de Données (Prisma) :** Le schéma est la source de vérité.
    * `Troupe` : Table centrale pour lier les utilisateurs.
    * `User` : Contient `troupeId` (à quelle troupe il appartient).
    * `Justification` : **Simplifiée.** Le champ `contenu` (String) remplace les 8 anciens champs.
* **Navigation (Sidebar) :**
    * Un **bloc profil** en haut gère l'accès à la page `/profil`.
    * Un **Sélecteur de Contexte** (Chef / Référent / Admin) est disponible pour les utilisateurs à rôles multiples.
    * Un **Sélecteur de etape Actif** est présent dans la sidebar Référent.
    * La sidebar `ADMIN` utilise des **menus déroulants (nested)** pour rester propre.