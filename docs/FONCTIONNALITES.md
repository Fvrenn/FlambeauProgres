# Cartographie des Fonctionnalités : Flambeau Progrès

Ce document dresse l'inventaire exhaustif de **toutes les actions et fonctionnalités** qu'il est possible de réaliser sur la plateforme, classé par Rôle (Profil Utilisateur). Il sert de manuel ou de feuille de route fonctionnelle afin de comprendre toutes les mécaniques du métier.

---

## 🏕️ 1. L'Espace "CHEF" (L'Animateur)

C'est l'utilisateur final qui suit son parcours d'évolution.

### Authentification & Profil
- **Se connecter / Se déconnecter :** Accès sécurisé à son espace personnel.
- **Visualiser son profil :** Voir ses informations de base et sa `groupe` d'appartenance.

### Suivi de Parcours (Dashboard)
- **Visualiser son parcours global :** Voir sous forme de grille/liste toutes les "Étapes" du programme Flambeau.
- **Suivre sa progression :** Consulter son pourcentage d'avancement pour chaque étape (ex: Étape "Construction" complétée à 45%).
- **Explorer une Étape :** Cliquer sur une étape pour en dévoiler le détail (la liste de tous les "Objectifs" à accomplir).

### Validation des "Compétences" (Confiance / Auto-validation)
- **Saisir une compétence :** Ouvrir le panneau d'une compétence spécifique.
- **Justifier par texte :** Écrire un message confirmant l'acquisition de la compétence (ex: "J'ai lu le manuel concernant les nœuds").
- **Auto-valider :** Enregistrer la déclaration. *L'objectif passe instantanément au statut `AUTO_VALIDEE`.*

### Soumission des "Réalisations" (Preuves avec validation tierce)
- **Entamer une réalisation :** Ouvrir une réalisation qui réclame une preuve tangible.
- **Rédiger un argumentaire :** Décrire succinctement son action ("Voici les plans de ma table à feu").
- **Uploader une Preuve :** Téléverser un fichier (Photo, PDF, Document) avec sa soumission.
- **Soumettre au Référent :** Valider l'envoi. *Le statut de l'objectif passe en `SOUMISE` et le système notifie automatiquement le Référent concerné.*

### Feedback et Interactions (Fil de commentaires)
- **Consulter le verdict :** Voir instantanément si sa soumission a été `VALIDEE` par le référent (badge vert) ou `DEMANDE_PRECISION` (badge orange).
- **Consulter une Demande de Précision :** Voir si le référent a bloqué la validation (statut `DEMANDE_PRECISION`) pour exiger plus de détails.
- **Répondre au Référent :** Poster un message dans le fil de commentaires rattaché à sa réalisation pour s'expliquer ou fournir le complément attendu.
- **Centre de Notifications :** Recevoir une alerte (Pastille/Popup) dès qu'un Référent a traité un dossier ou envoyé un message.

---

## 🔍 2. L'Espace "RÉFÉRENT" (Le Validateur)

C'est l'expert chargé d'évaluer les dossiers des Chefs.

### Navigation et Contexte
- **Switch de Contexte :** S'il a plusieurs casquettes, il peut basculer l'interface de l'App du mode "Chef" au mode "Référent".
- **Sélecteur d'Étape Active :** Un référent est rattaché à une ou plusieurs étapes. Il peut sélectionner l'étape qu'il souhaite traiter 

### Validation au jour le jour (Micro-travail)
- **Consulter la file d'attente (Inbox) :** Survoler toutes les réalisations "SOUMISES" en attente de traitement pour l'étape sélectionnée.
- **Analyser le dossier d'un Chef :** Ouvrir la soumission pour lire le texte justificatif et visionner/télécharger la preuve (le fichier uploadé).
- 🎬 **Action "VALIDER" :** Accepter définitivement la preuve. *Le compte du Chef s'incrémente et il reçoit une notification de succès.*
- 🎬 **Action "DEMANDER UNE PRÉCISION" :**  ouvrir un chat avec le Chef (Commentaire de type `REFERENT_QUESTION`) pour lui demander de modifer ou préciser sa soumission. *Le statut de l'objectif passe à `DEMANDE_PRECISION`.*

### La Revue Finale (Validation globale de l'étape)
- **Panneau des Étapes Complètes :** Accéder à un onglet spécial listant tous les Chefs ayant validé 100% des objectifs (toutes les compétences auto-validées + toutes les réalisations approuvées).
- **Contrôle d'Intégrité :** Relire en diagonale toutes les descriptions textes des "Compétences" auto-validées par le Chef pour s'assurer du sérieux de son parcours.
- 🎬 **Validation Ultime de l'Étape :** Décerner officiellement l'Étape complète au Chef. *(Permet de clôturer le parcours en base de données).*

---

## ⚙️ 3. L'Espace "ADMIN" (Le Gestionnaire MVC)

Il est le maître de cérémonie, chargé du paramétrage de l'outil associatif.

### Gestion Administrative des Utilisateurs
- **Annuaire central :** Lister absolument tous les comptes inscrits sur la plateforme.
- **Assigne-Rôle :** Promouvoir, rétrograder ou modifier les accès d'un utilisateur (`CHEF`, `REFERENT`, `ADMIN`).
- **Gestion des Groupes :** Assigner manuellement des Chefs à leur groupe locale.

### Gestion de la Topologie / Des groupes
- **Créer/Éditer un groupe :** Ajouter une nouvelle unité (ex: "groupe Paris grand est").

### Engineering Pédagogique (Les Étapes et Objectifs)
- **Créer des Étapes :** Organiser le parcours pédagogique dans le système  et leur ordre.
- **Créer/Modifier les Objectifs :** Lier les "cases" à l'intérieur d'une étape. L'Admin décide qui est une simple `COMPETENCE` (auto-validation requise) et qui est une `REALISATION` (soumission de fichier / validation par un tiers).

### Le Routing des Validations (Assignations)
- **Assigner un referent (`EtapeReferent`) :** Déclarer quel `User` (Référent) obtient les droits de supervision sur quelle `Étape` précise. 

---
