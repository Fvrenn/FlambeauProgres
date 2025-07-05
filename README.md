# Flambeau Progrès

**Flambeau Progrès** est une application web révolutionnaire qui digitalise et modernise le processus d'acquisition de badges dans le mouvement scout des Flambeaux. Fini les formulaires papier, les emails perdus et les validations téléphoniques ! Notre plateforme transforme l'accompagnement pédagogique en une expérience interactive, motivante et efficace.

---

## 🎯 À quoi sert cette application ?

### **Le problème résolu**
L'obtention de badges scouts nécessitait auparavant :
- ❌ Remplir des documents physiques
- ❌ Envoyer des emails avec justifications
- ❌ Organiser des appels téléphoniques pour validation
- ❌ Suivi difficile de la progression

### **La solution Flambeau Progrès**
✅ **Interface 3D immersive** avec chemise de scout interactive  
✅ **Workflow digital complet** de soumission à validation  
✅ **Communication structurée** entre chefs et référents  
✅ **Suivi temps réel** de la progression des badges  
✅ **Gamification naturelle** pour motiver les scouts  

---

## 🏗️ Architecture de l'application

### � **3 rôles utilisateur**

#### 🧑‍🎓 **Chef (Scout)**
- **Objectif** : Obtenir ses badges en justifiant ses compétences
- **Actions principales** : Soumettre justifications, répondre aux demandes référents, suivre progression

#### 🧑‍� **Référent** 
- **Objectif** : Valider les compétences des chefs de ses badges assignés
- **Actions principales** : Examiner justifications, demander précisions, valider/refuser

#### 🧑‍💻 **Administrateur**
- **Objectif** : Gérer le système global (badges, utilisateurs, assignations)
- **Actions principales** : Créer badges, assigner référents, superviser le système

### 🏆 **Structure des badges**
Chaque badge contient :
- **Compétences** : Savoir-faire à acquérir (ex: "Maîtriser les nœuds")
- **Réalisations** : Projets à accomplir (ex: "Organiser un camp")
- **Validation** : Processus référent → chef avec échanges

---

### 🎯 **Navigation par tabs**

#### **Tab 1: 📊 Progression (par défaut)**
**Contenu affiché au chargement de la page**
- Vue d'ensemble de tous les badges
- Pourcentage global de progression
- Statistiques personnelles
- Badges récemment mis à jour

#### **Tab 2: 🎯 Objectifs**
**Accessible en cliquant sur un badge**
- Liste des compétences du badge sélectionné
- Liste des réalisations du badge
- Bouton "Justifier" pour chaque objectif

#### **Tab 3: 🔔 Notifications**
- Demandes de précisions des référents
- Validations récentes
- Rappels et alertes

### 🔄 **Interactions principales**

#### **Clic sur un badge**
1. 🎮 **Animation 3D** : La chemise tourne vers le badge
2. 🔄 **Redirection automatique** : Passage au tab "Objectifs"
3. 📋 **Affichage du contenu** : Compétences + réalisations du badge

#### **Clic sur "Justifier un objectif"**
**Ouverture d'une modal avec 3 sections :**

---

## 📝 Modal de justification - Interface détaillée

### **Navigation de la modal**
```
┌─ Ma justification │ Commentaires │ Statut ─┐
```

### **Section 1: 📝 Ma justification**

#### **🎯 Quoi ?** (Activité organisée)
```
Description de l'activité organisée
[Input texte multiligne]
```

#### **📅 Quand ?**
```
Date: [Sélecteur de date]
Durée: [Input numérique] heures
Contexte: [Input texte] (Où/Occasion)
```

#### **👥 Avec qui ?**
```
Nombre de jeunes: [Select: 1-50]
Tranche d'âge: [Select: 8-11 ans, 11-14 ans, 14-17 ans]
Niveau: [Select: Débutant, Intermédiaire, Expert]
```

#### **📊 Résultats ?**
```
Objectifs atteints:
[Input texte multiligne]
```

#### **📎 Fichiers joints**
```
[Zone de drag & drop pour photos/documents]
```

### **Section 2: 💬 Commentaires**
**Historique des échanges avec le référent**
- Messages du référent (demandes de précisions)
- Réponses du chef
- Chronologie complète des interactions

### **Section 3: 📊 Statut**
**Suivi détaillé de la progression**

#### **Barre de progression globale du badge**
```
Badge Construction: ████████░░ 80%
```

#### **Checklist de validation**
- ☑️ **Justification rédigée** (cochée si formulaire rempli)
- ☑️ **Soumission effectuée** (cochée si envoyée au référent)  
- ☑️ **Fichiers joints** (cochée si documents ajoutés)
- ⏳ **Validation référent** (en cours/validée/refusée)

---

## 🧑‍🏫 Interface Référent - À développer

### 📊 **Dashboard de validation**

Le référent dispose d'un tableau de bord principal qui lui permet de voir :

#### **Vue d'ensemble**
- **Badges assignés** : Cards affichant chaque badge dont il est responsable avec le nombre de chefs actifs et les validations en attente
- **File d'attente prioritaire** : Liste des justifications urgentes (>48h) avec alertes visuelles pour traitement rapide
- **Actions rapides** : Boutons pour valider, refuser ou demander des précisions directement depuis la vue d'ensemble

### 👥 **Suivi des chefs par badge**

Pour chaque badge assigné, le référent peut voir :

#### **Liste des chefs**
- **Progression individuelle** : Pourcentage d'avancement de chaque chef sur le badge
- **Objectifs en attente** : Quelles justifications nécessitent une validation avec l'ancienneté de la demande
- **Filtres** : Possibilité de filtrer par statut (en attente, validés, refusés)
- **Historique** : Dernières activités soumises par chaque chef
- **Commentaires** : Option d'ajouter des notes générales sur la progression du chef

### 📝 **Validation des objectifs**

Quand le référent examine une justification, il a accès à :

#### **Informations complètes**
- **Justification détaillée** : Toutes les informations saisies par le chef (Quoi, Quand, Avec qui, Résultats)
- **Fichiers joints** : Photos et documents téléchargés par le chef
- **Historique des échanges** : Conversation complète entre le référent et le chef

#### **Outils de communication**
- **Zone de commentaire** : Espace pour rédiger des retours personnalisés
- **Templates rapides** : Messages prédéfinis pour les demandes courantes
- **Conversation** : Échange en temps réel avec le chef pour clarifications

### 🔄 **Actions de validation**

Le référent dispose de 3 actions principales pour chaque objectif soumis :

#### **✅ Valider un objectif**
- Confirme que l'objectif est atteint selon les critères du badge
- Permet d'ajouter un commentaire de félicitations et d'encouragement
- Déclenche une notification automatique au chef
- Met à jour la barre de progression du badge

#### **❌ Refuser un objectif**
- Indique que l'objectif n'est pas suffisamment justifié ou réalisé
- Exige une explication détaillée du refus avec suggestions d'amélioration
- Offre au chef la possibilité de soumettre une nouvelle justification
- Maintient l'historique des tentatives pour suivi pédagogique

#### **⚠️ Demander des précisions**
- Permet de demander des informations complémentaires sans valider ni refuser
- Propose des templates de questions courantes (durée, participants, méthodes, etc.)
- Laisse une zone libre pour des demandes personnalisées
- Notifie le chef avec un délai de réponse

### 💬 **Système de commentaires et suivi**

#### **Communication structurée**
- **Historique complet** : Conservation de tous les échanges entre référent et chef pour chaque objectif
- **Horodatage** : Chaque message est daté pour suivre l'évolution des discussions
- **Commentaires généraux** : Possibilité d'ajouter des notes sur la progression globale du chef
- **Templates** : Messages prédéfinis pour les retours les plus fréquents

#### **Notifications et alertes**
- **Nouvelles soumissions** : Alerte quand un chef soumet une nouvelle justification
- **Réponses reçues** : Notification quand un chef répond à une demande de précisions
- **Urgences** : Mise en évidence des justifications en attente depuis plus de 48h
- **Badges complets** : Alerte quand tous les objectifs d'un badge sont validés

### 📊 **Suivi et statistiques**

#### **Métriques de performance**
- **Nombre de validations** : Suivi hebdomadaire et mensuel des traitements
- **Temps de réponse moyen** : Délai entre soumission et validation
- **Taux d'acceptation** : Pourcentage de justifications validées directement
- **Chefs les plus actifs** : Identification des scouts les plus engagés

#### **Tableau de bord personnel**
- **File d'attente en temps réel** : Nombre de justifications en attente de traitement
- **Répartition par badge** : Vue d'ensemble des chefs actifs sur chaque badge assigné
- **Alertes prioritaires** : Mise en avant des validations urgentes ou des problèmes
- **Historique d'activité** : Journal des dernières actions de validation effectuées

---

## 🧑‍💻 Interface Admin - À développer  

### **Gestion du système**

#### **CRUD Badges**
- Créer de nouveaux badges
- Modifier les compétences et réalisations

#### **Gestion des utilisateurs**
- Assigner les rôles (Chef/Référent/Admin)
- Gérer les inscriptions
- Vue d'ensemble des progressions

#### **Assignation Référent ↔ Badge**
- Alertes pour badges sans référent
- Répartition de charge équilibrée

#### **Statistiques globales**
- Tableau de bord avec métriques système
- Rapports de progression par troupe
- Analytics d'utilisation

---

## 🚀 Stack technique

- **Frontend & Backend** : Next.js 15 (Full-Stack)
- **Base de données** : PostgreSQL + Prisma ORM
- **3D** : Three.js pour la chemise interactive
- **UI** : Tailwind CSS + Headless UI + HeroUi
- **Authentification** : NextAuth.js avec JWT
- **Stockage fichiers** : Local (extensible vers cloud)

---

## 🎯 Workflow complet

### **Parcours Chef**
```
1. Connexion → Dashboard (tab Progression)
2. Clic badge → Animation 3D → Tab Objectifs  
3. Clic "Justifier" → Modal (Ma justification)
4. Remplissage formulaire → Soumission référent
5. Reception notification → Tab Notifications
6. Réponse demandes → Modal (Commentaires)
7. Validation finale → Badge complété ✅
```

### **Parcours Référent**
```
1. Connexion → Dashboard validation
2. File d'attente → Sélection justification
3. Examen → Validation/Refus/Demande précisions
4. Communication → Échange avec chef
5. Validation finale → Badge validé ✅
```

### **Parcours Admin**
```
1. Gestion badges → Création/Modification
2. Assignation référents → Badges
3. Supervision → Statistiques globales
4. Support → Résolution problèmes
```

---

## 📅 Roadmap de développement détaillée

### 🎯 **Phase 1 : Interface Chef (4-6 semaines)**

#### **Semaine 1-2 : Setup & Authentification**
- [ ] **Setup projet** : Next.js 15 + TypeScript + Tailwind CSS
- [ ] **Base de données** : Schéma Prisma (User, Badge, Competence, Realisation)
- [ ] **Authentification** : NextAuth.js avec rôles (CHEF, REFERENT, ADMIN)
- [ ] **Layout principal** : Header, navigation, structure responsive

#### **Semaine 3-4 : Dashboard Chef**
- [ ] **Page tableau de bord** : Layout avec sidebar chemise 3D + zone principale
- [ ] **Chemise 3D** : Intégration Three.js avec badges positionnés
- [ ] **Grid badges** : Affichage des 12 badges avec statuts et progression
- [ ] **Système de tabs** : Progression (défaut), Objectifs, Notifications

#### **Semaine 4-5 : Système de justification**
- [ ] **Tab Objectifs** : Liste des compétences et réalisations par badge
- [ ] **Modal justification** : 3 sections (Ma justification, Commentaires, Statut)
- [ ] **Formulaire détaillé** : Champs Quoi/Quand/Avec qui/Résultats
- [ ] **Upload fichiers** : Drag & drop pour photos/documents
- [ ] **Sauvegarde brouillon** : Auto-save et reprise de saisie

#### **Semaine 6 : Interactions & Animation**
- [ ] **Animation 3D** : Rotation chemise vers badge cliqué
- [ ] **Redirection automatique** : Badge → Tab Objectifs
- [ ] **States visuels** : Progression, notifications, alertes
- [ ] **Responsive mobile** : Adaptation interface tactile

### 🎯 **Phase 2 : Interface Référent (3-4 semaines)**

#### **Semaine 7-8 : Dashboard Référent**
- [ ] **Page principale** : Vue d'ensemble badges assignés
- [ ] **File d'attente** : Liste priorisée des validations en attente
- [ ] **Filtres et recherche** : Par badge, chef, statut, urgence
- [ ] **Vue détaillée badge** : Liste des chefs avec progression

#### **Semaine 9-10 : Système de validation**
- [ ] **Interface validation** : Examen justifications complètes
- [ ] **Actions référent** : Valider/Refuser/Demander précisions
- [ ] **Système commentaires** : Templates + zone libre + historique
- [ ] **Notifications** : Alertes urgences + nouvelles soumissions

#### **Semaine 10 : Statistiques & Suivi**
- [ ] **Métriques référent** : Performance, temps traitement, taux validation
- [ ] **Tableau de bord personnel** : File attente temps réel + alertes
- [ ] **Communication chef** : Interface d'échange structurée

### 🎯 **Phase 3 : Interface Admin (2-3 semaines)**

#### **Semaine 11-12 : Gestion système**
- [ ] **CRUD Badges** : Création, modification, suppression badges
- [ ] **Gestion utilisateurs** : Attribution rôles, gestion comptes
- [ ] **Assignation référents** : Interface glisser-déposer badges ↔ référents
- [ ] **Alertes système** : Badges sans référent, surcharges

#### **Semaine 13 : Analytics & Administration**
- [ ] **Dashboard admin** : Vue d'ensemble système + métriques globales
- [ ] **Statistiques avancées** : Rapports progression, performance référents
- [ ] **Gestion paramètres** : Configuration système, maintenance
- [ ] **Export données** : Rapports Excel/PDF pour troupes

### 🎯 **Phase 4 : Optimisations & Fonctionnalités avancées (2-3 semaines)**

#### **Semaine 14 : Notifications temps réel**
- [ ] **WebSockets** : Notifications live pour validations/commentaires
- [ ] **Email notifications** : Alertes importantes par email
- [ ] **Push notifications** : PWA pour notifications mobiles
- [ ] **Système d'alertes** : Urgences, rappels, deadlines

#### **Semaine 15-16 : Finitions & Tests**
- [ ] **Tests unitaires** : Composants critiques et API
- [ ] **Tests d'intégration** : Workflows complets chef → référent
- [ ] **Optimisation performance** : Lazy loading, cache, optimisation 3D
- [ ] **Documentation** : Guide utilisateur par rôle

#### **Semaine 16 : Déploiement & Formation**
- [ ] **Déploiement production** : Configuration serveur + domaine
- [ ] **Formation référents** : Sessions d'onboarding interface
- [ ] **Support utilisateur** : FAQ, aide contextuelle, hotline
- [ ] **Feedback initial** : Collecte retours premiers utilisateurs

---

### � **Livrables par phase**

#### **Phase 1 - Interface Chef**
✅ Application fonctionnelle pour les scouts  
✅ Système complet de justification des objectifs  
✅ Visualisation 3D interactive des badges  
✅ Interface responsive mobile/desktop  

#### **Phase 2 - Interface Référent**
✅ Workflow complet de validation  
✅ Communication structurée chef ↔ référent  
✅ Dashboard de suivi et statistiques  
✅ Système d'alertes et notifications  

#### **Phase 3 - Interface Admin**
✅ Gestion complète du système  
✅ Administration badges et utilisateurs  
✅ Analytics et rapports  
✅ Configuration et maintenance  

#### **Phase 4 - Finalisation**
✅ Notifications temps réel  
✅ Optimisations performance  
✅ Tests et documentation  
✅ Déploiement et formation  

---

### 📊 **Métriques de succès**

#### **Objectifs techniques**
- [ ] **Performance** : Temps de chargement < 2s
- [ ] **Fiabilité** : Uptime > 99%
- [ ] **Sécurité** : Authentification robuste + protection données
- [ ] **Scalabilité** : Support 500+ utilisateurs simultanés

#### **Objectifs fonctionnels**
- [ ] **Adoption** : 90% des chefs utilisent l'interface
- [ ] **Efficacité** : Réduction 70% du temps de validation
- [ ] **Satisfaction** : Note utilisateur > 4/5
- [ ] **Engagement** : Augmentation 50% des badges complétés

---

### 🛠️ **Stack technique par phase**

#### **Phase 1 - Base solide**
```
Frontend: Next.js 15 + TypeScript + Tailwind CSS
3D: Three.js + React Three Fiber
Base de données: PostgreSQL + Prisma ORM
Authentification: NextAuth.js
```

#### **Phase 2 - Communication**
```
État global: Zustand ou Context API
Formulaires: React Hook Form + Zod validation
Notifications: React Toast
Temps réel: Socket.io (préparation)
```

#### **Phase 3 - Administration**
```
Charts: Recharts pour analytics
Export: react-to-pdf pour rapports
Tables: TanStack Table pour données complexes
Drag & Drop: dnd-kit pour assignations
```

#### **Phase 4 - Production**
```
Temps réel: Socket.io + Redis
PWA: Next PWA plugin
Tests: Jest + Testing Library
Monitoring: Sentry + Analytics
Déploiement: Vercel ou Docker
```

Cette roadmap priorise l'expérience utilisateur chef en premier, puis construit progressivement les outils de validation et d'administration ! 🎯

---

Cette application révolutionne l'accompagnement scout en transformant un processus papier complexe en une expérience digitale immersive et motivante ! 🏕️✨
