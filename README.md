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

---

## 🗄️ Base de données - Architecture détaillée

### 📊 **Schéma de base de données PostgreSQL + Prisma ORM**

Cette section détaille toutes les décisions prises concernant la structure de la base de données, les relations et les choix techniques.

---

### 🎯 **Décisions clés prises**

#### **1. Badges fixes vs dynamiques**
- ✅ **12 badges prédéfinis** : 2b à 2n (codes officiels Flambeaux)
- ✅ **CRUD complet** : Possibilité de modifier/ajouter/supprimer des badges
- ✅ **Extensibilité** : Structure flexible pour futurs badges

#### **2. Compétences vs Réalisations**
- ✅ **Table unique `objectifs`** avec enum `TypeObjectif`
- ✅ **COMPETENCE** : Savoir-faire (ex: B1 Guide du Bois) - fichiers optionnels
- ✅ **REALISATION** : Projets (ex: B8 Concevoir un jeu) - fichiers requis généralement
- ✅ **Différenciation** : Champ `fichiersRequis` pour adapter l'interface

#### **3. Système de justifications**
- ✅ **1 justification = 1 objectif** (granularité fine)
- ✅ **Contrainte unique** : Un chef ne peut justifier qu'une fois par objectif
- ✅ **Workflow complet** : BROUILLON → SOUMISE → EN_COURS → VALIDEE/REFUSEE

#### **4. Gestion des fichiers**
- ✅ **Upload local** pour commencer (extensible vers cloud)
- ✅ **Métadonnées complètes** : nom, taille, type MIME, chemin
- ✅ **Types supportés** : IMAGE, DOCUMENT, AUTRE

#### **5. Assignations référent ↔ badge**
- ✅ **Relation Many-to-Many** : Un référent peut avoir plusieurs badges
- ✅ **Un badge peut avoir plusieurs référents** pour répartir la charge
- ✅ **Traçabilité** : Qui a assigné, quand

#### **6. Système de notifications**
- ✅ **Table dédiée** pour historique et markAsRead
- ✅ **8 types de notifications** couvrant tous les workflows
- ✅ **Notifications persistantes** vs calculs temps réel

#### **7. Calcul de progression**
- ✅ **Formule** : (Objectifs validés / Total objectifs du badge) × 100
- ✅ **Temps réel** : Recalculé à chaque validation

---

### 🏗️ **Modèles de données**

#### **👥 User - Gestion des utilisateurs**
```sql
Table: users
- id: String (CUID)
- email: String (UNIQUE)
- name: String
- role: UserRole (CHEF | REFERENT | ADMIN)
- createdAt/updatedAt: DateTime
```

**Relations :**
- `justifications[]` → Justifications soumises (si CHEF)
- `assignedBadges[]` → Badges assignés (si REFERENT)
- `commentsWritten[]` → Commentaires écrits
- `notificationsReceived[]` → Notifications reçues

#### **🏆 Badge - Badges Flambeaux**
```sql
Table: badges
- id: String (CUID)
- code: String (UNIQUE) // "2b", "2c", "2e"...
- nom: String // "Branche Petits Flambeaux"
- description: String?
- couleur: String? // Pour affichage 3D
- icone: String?
- ordre: Int // Ordre d'affichage
- actif: Boolean // Actif/désactivé
```

**Relations :**
- `objectifs[]` → Compétences + Réalisations
- `referents[]` → Référents assignés (via BadgeReferent)
- `justifications[]` → Justifications pour ce badge

#### **🎯 Objectif - Compétences & Réalisations**
```sql
Table: objectifs
- id: String (CUID)
- badgeId: String (FK → Badge)
- code: String // "B1", "B8", "C1"...
- titre: String // Titre court
- description: String // Description détaillée
- type: TypeObjectif (COMPETENCE | REALISATION)
- ordre: Int
- fichiersRequis: Boolean // TRUE pour réalisations généralement
```

**Contrainte unique :** `(badgeId, code)` - Un code unique par badge

#### **📝 Justification - Soumissions des chefs**
```sql
Table: justifications
- id: String (CUID)
- chefId: String (FK → User)
- objectifId: String (FK → Objectif)
- badgeId: String (FK → Badge)

// Contenu détaillé de la justification
- activiteDescription: String // 🎯 Quoi ?
- dateActivite: DateTime // 📅 Quand ?
- dureeHeures: Float
- contexte: String // Où/Occasion
- nombreJeunes: Int // 👥 Avec qui ?
- trancheAge: String // "8-11 ans", "11-14 ans", "14-17 ans"
- niveau: String // "Débutant", "Intermédiaire", "Expert"
- objectifsAtteints: String // 📊 Résultats ?

// État et workflow
- statut: StatutJustification
- version: Int // Historique modifications
- soumiseAt: DateTime?
- valideeAt: DateTime?
```

**Contrainte unique :** `(chefId, objectifId)` - Une justification par chef par objectif

**États possibles :**
- `BROUILLON` → En cours de rédaction
- `SOUMISE` → Envoyée au référent
- `EN_COURS` → En cours d'examen
- `DEMANDE_PRECISION` → Référent demande des précisions
- `VALIDEE` → Objectif validé ✅
- `REFUSEE` → Objectif refusé ❌

#### **📎 Fichier - Documents joints**
```sql
Table: fichiers
- id: String (CUID)
- justificationId: String (FK → Justification)
- nomOriginal: String // Nom du fichier utilisateur
- nomStockage: String // Nom sur serveur
- cheminFichier: String // Chemin complet
- type: TypeFichier (IMAGE | DOCUMENT | AUTRE)
- mimeType: String // "image/jpeg", "application/pdf"
- taille: Int // Taille en bytes
```

#### **💬 Commentaire - Échanges référent ↔ chef**
```sql
Table: commentaires
- id: String (CUID)
- justificationId: String (FK → Justification)
- auteurId: String (FK → User)
- contenu: String
- type: TypeCommentaire
- createdAt: DateTime
```

**Types de commentaires :**
- `CHEF_REPONSE` → Réponse du chef
- `REFERENT_QUESTION` → Question/demande de précision du référent
- `REFERENT_FEEDBACK` → Feedback de validation/refus
- `SYSTEM` → Messages automatiques du système

#### **🔗 BadgeReferent - Assignations Many-to-Many**
```sql
Table: badge_referents
- id: String (CUID)
- referentId: String (FK → User)
- badgeId: String (FK → Badge)
- assigneAt: DateTime
- assignePar: String? // ID admin qui a fait l'assignation
```

**Contrainte unique :** `(referentId, badgeId)` - Un référent ne peut être assigné qu'une fois par badge

#### **🔔 Notification - Système de notifications**
```sql
Table: notifications
- id: String (CUID)
- destinataireId: String (FK → User)
- justificationId: String? (FK → Justification)
- type: TypeNotification
- titre: String // Titre court
- message: String // Message détaillé
- lue: Boolean
- createdAt: DateTime
- lueAt: DateTime?
```

**Types de notifications :**
- `NOUVELLE_JUSTIFICATION` → Nouvelle justification soumise (→ Référent)
- `JUSTIFICATION_VALIDEE` → Justification validée (→ Chef)
- `JUSTIFICATION_REFUSEE` → Justification refusée (→ Chef)
- `DEMANDE_PRECISION` → Demande de précision (→ Chef)
- `REPONSE_PRECISION` → Réponse à demande de précision (→ Référent)
- `BADGE_COMPLETE` → Tous objectifs d'un badge validés (→ Chef)
- `JUSTIFICATION_URGENTE` → Justification en attente >48h (→ Référent)
- `NOUVEAU_COMMENTAIRE` → Nouveau commentaire ajouté (→ Chef/Référent)

---

### 🔄 **Relations et workflows**

#### **Workflow de justification complet :**
```
1. Chef crée justification (BROUILLON)
2. Chef soumet → statut SOUMISE → notification référent
3. Référent examine → statut EN_COURS
4. Référent peut :
   - Valider → VALIDEE + notification chef
   - Refuser → REFUSEE + commentaire obligatoire
   - Demander précisions → DEMANDE_PRECISION + commentaire
5. Si demande précisions → chef répond → retour EN_COURS
6. Validation finale → mise à jour progression badge
```

#### **Calculs de progression :**
```typescript
// Progression d'un badge pour un chef
const progression = (objectifsValides / totalObjectifsBadge) * 100

// Progression globale d'un chef
const progressionGlobale = moyennePondérée(progressionParBadge)

// Statistiques référent
const enAttente = justifications.filter(j => 
  ['SOUMISE', 'EN_COURS', 'DEMANDE_PRECISION'].includes(j.statut)
).length
```

---

### 🚀 **Configuration et accès**

#### **Connexion à la base :**
- **Type :** PostgreSQL locale via Prisma Dev
- **Host :** `localhost:51214`
- **Database :** `template1`
- **Interface graphique :** `npx prisma studio` → `http://localhost:5555`

#### **Scripts utiles :**
```bash
npm run db:generate  # Génère le client Prisma
npm run db:migrate   # Crée une nouvelle migration
npm run db:reset     # Remet à zéro la BDD
npm run db:studio    # Ouvre Prisma Studio
```

#### **Utilisation dans le code :**
```typescript
import { prisma } from '@/lib/prisma'

// Exemple : récupérer badges avec progression
const badges = await prisma.badge.findMany({
  include: {
    objectifs: {
      include: {
        justifications: {
          where: { chefId: userId, statut: 'VALIDEE' }
        }
      }
    }
  }
})
```

---

### 🎯 **Avantages de cette architecture**

✅ **Flexibilité** : Badges et objectifs modifiables par les admins  
✅ **Scalabilité** : Relations Many-to-Many pour gérer la croissance  
✅ **Traçabilité** : Historique complet des actions et modifications  
✅ **Performance** : Index sur les clés étrangères et contraintes uniques  
✅ **Sécurité** : Contraintes de données et relations strictes  
✅ **Extensibilité** : Structure prête pour futures fonctionnalités  

Cette architecture permet de gérer efficacement tous les aspects du système Flambeau Progrès, des justifications individuelles aux statistiques globales ! 🏕️✨

---
