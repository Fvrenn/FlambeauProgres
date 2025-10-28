# 🎯 MVP (Minimum Viable Product)

## Objectif Principal

L'objectif du MVP est de valider la **boucle de feedback fondamentale** de l'application :
1.  Un `Chef` peut soumettre une justification.
2.  Un `Referent` peut la recevoir et y répondre (Valider/Refuser).
3.  Le `Chef` reçoit la réponse.

Tout le reste est secondaire.

---

## ✅ Inclus dans le MVP

* **Authentification & Layout :**
    * [✓] Authentification (Better Auth).
    * [✓] Layout principal avec Sidebars conditionnelles par rôle.

* **Mise en place (Admin manuel) :**
    * Pas de Dashboard Admin. La création des données de test (Badges, Troupes, Objectifs, Assignations) se fait manuellement via `Prisma Studio` ou un script de `seed`.

* **Parcours `Chef` (minimal) :**
    * **Dashboard :** Peut voir ses badges (une simple grille 2D suffit, la 3D est pour la V2).
    * **Objectifs :** Peut cliquer sur un badge et voir la liste des `Compétences` et `Réalisations`.
    * **Statut :** Peut voir le statut de ses objectifs (Non fait, Soumis, Validé...).
    * **Justification (Compétence) :** Peut ouvrir la modal "Compétence", remplir le champ `contenu` et l'auto-valider (statut `AUTO_VALIDEE`).
    * **Justification (Réalisation) :** Peut ouvrir la modal "Réalisation", remplir le `contenu`, **uploader un fichier**, et le soumettre (statut `SOUMISE`).
    * **Notifications :** Peut voir un panel/onglet `Notifications` simple qui affiche les réponses du Référent.

* **Parcours `Referent` (minimal) :**
    * **Contexte :** Peut utiliser le "Sélecteur de Contexte" pour passer de son interface `Chef` à son interface `Referent`.
    * **Sélection :** Peut utiliser le "Sélecteur de Badge" dans sa sidebar.
    * **Dashboard (Onglet 1) :** Peut voir la liste des `Realisations` en attente (statut `SOUMISE`) pour le badge sélectionné.
    * **Validation :** Peut cliquer sur une soumission, voir le `contenu` et le `fichier` soumis par le Chef.
    * **Actions :** Dispose des boutons "Valider" et "Refuser".
    * **Feedback :** Cliquer sur "Valider" ou "Refuser" met à jour la `Justification` et crée une `Notification` pour le Chef.

---

## ❌ Exclu du MVP (pour la V2+)

* **Chemise 3D :** Remplacée par une simple grille 2D pour le MVP.
* **Dashboard Admin :** Toute la gestion (CRUD Troupes, Badges, Users...) est hors MVP.
* **Flow Chef de Troupe :** La table `BadgeCommande` et la page `/troupe/commandes` ne sont pas implémentées.
* **Flow "Revue Finale" :** L'onglet 2 du Référent ("Badges complets à réviser") et la page de revue finale sont hors MVP.
* **Statistiques :** L'onglet "Progression" du Chef est hors MVP.
* **Commentaires avancés :** La fonctionnalité "Demander Précision" (qui implique un aller-retour de commentaires) peut être laissée pour la V2, le MVP se concentre sur `Valider` / `Refuser`.