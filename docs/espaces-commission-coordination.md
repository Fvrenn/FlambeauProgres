# Espaces Commission Formation et Coordination nationale

## Constat

Le livret « Servir » (`public/livrets/servir/parcours-servir-v03-2021.pdf`, pages 3 à 5) sépare deux
rôles sur toute l'Étape 3 (Experts, Formateur, Leader) :

- la **Commission Formation évalue** les compétences et les réalisations (fiches de synthèse) ;
- le **Coordinateur National valide** le profil, à partir de cette évaluation, et remet l'étoile.

Les droits d'action le respectent déjà (`peutEvaluerEtape` / `peutValiderEtape`,
`src/lib/roles.ts`), mais pas l'affichage :

- les deux rôles suivent toute l'Étape 3 dans la **vue Référent** (« Étapes suivies » pour
  Formateur et Leader, onglet « Experts » pour les Experts) et y voient les **mêmes trois listes**
  (réalisations à valider, en attente du chef, badges complets à réviser) ;
- l'onglet « Experts » s'affiche dans la barre de la vue Référent, même sur une étape sans rapport
  (ex. Branche Petits Flambeaux).

## Décisions

- Deux espaces séparés, chacun avec uniquement son travail, couvrant **toute l'Étape 3**.
- **Commission Formation** (`/commission`) : onglets « Évaluations » et « Analyse ».
- **Coordination nationale** (`/coordination`) : onglets « Validations » et « Analyse ».
- **Analyse** : Commission, Coordinateur et Admin (présente dans les deux espaces).
- **Admins** : accès aux deux espaces **en lecture seule** (ils ne peuvent ni évaluer ni valider
  l'Étape 3, règle inchangée).
- **Coordinateur** : consulte le dossier évalué (objectifs, fiches, échanges avec la Commission) en
  lecture, sans pouvoir évaluer.
- La **vue Référent** ne garde que les assignations réelles (niveaux 1 et 2) : plus d'Étape 3 dans
  « Étapes suivies », plus d'onglet « Experts ».

| Rôle                  | Commission (Évaluations) | Coordination (Validations) | Analyse |
| --------------------- | ------------------------ | -------------------------- | ------- |
| COMMISSION_FORMATION  | évalue                   | —                          | oui     |
| COORDINATEUR_NATIONAL | —                        | valide, lit les dossiers   | oui     |
| ADMIN                 | lecture seule            | lecture seule              | oui     |

## Phases

- [x] **Phase 1 — Rôles, espaces et navigation.** ✅ Fait — `ROLES_ESPACE_COMMISSION`,
      `ROLES_ESPACE_COORDINATION`, `accedeEspaceCommission`, `accedeEspaceCoordination` et
      `consulteEtape3` (`src/lib/roles.ts`) ; layouts `src/app/(app)/{commission,coordination}/layout.tsx`
      (redirection vers `/` sans le rôle) ; vue `coordination` et `CompteursEncadrement`
      (`src/lib/vue.ts`), `commissionSidebarItems` / `coordinationSidebarItems`
      (`src/config/navigation.ts`) ; entrées « Commission Formation » et « Coordination nationale »
      dans `ContextSwitcher.tsx`. Comment : l'Analyse est extraite dans `src/components/analyse/`
      (`AnalyseValidations`), servie par `/commission/analyse` et `/coordination/analyse` (devenus
      l'onglet Historique de `/…/suivi`, voir [suivi-remises-badges](./suivi-remises-badges.md)) ;
      `FiltresBar` reprend le chemin courant au lieu d'une adresse en dur.
- [x] **Phase 2 — Commission : Évaluations.** ✅ Fait — `/commission/evaluations` (réalisations
      soumises et en attente du chef de toute l'Étape 3, lien direct `?justification=`) et
      `/commission/dossier` (« Voir son étape »). Où : `SuiviEtape3Service`
      (`src/services/suivi-etape3.service.ts`, filtre `FILTRE_ETAPES_NIVEAU_3` : niveau ≥ 3, badge,
      actif), compteur « Évaluations » calculé dans `src/app/(app)/layout.tsx`. Comment :
      `ReferentDashboardClient` et ses sous-composants passent dans
      `src/components/application/referent/` ; chaque liste y devient facultative (onglets et
      cartes n'apparaissent que pour les listes fournies), et un `espace` choisit les liens
      (`src/lib/espaces-suivi.ts`). L'admin a `peutEvaluer` à faux : modale en lecture seule.
- [x] **Phase 3 — Coordination : Validations.** ✅ Fait — `/coordination/validations` (dossiers
      complets de toute l'Étape 3, lien direct `?justification=` pour lire un échange en lecture
      seule) et `/coordination/dossier` (validation finale). Où : `SuiviEtape3Service.getDossiersAValider`
      / `compterValidations` (`chefsAReviserPourEtape` exporté de `referent.service.ts`),
      `DossierEtape3` (`src/components/application/referent/DossierEtape3.tsx`, refuse toute étape
      hors Étape 3), compteur « Validations ». Comment : `canAccessJustification` ouvre l'Étape 3 à
      `consulteEtape3` (Commission, Coordinateur, Admin) ; seule la Commission peut y écrire, seul le
      Coordinateur valide (règles inchangées).
- [x] **Phase 4 — Vue Référent recentrée.** ✅ Fait — plus de suivi automatique de l'Étape 3
      (`src/lib/auth-server.ts`), `suitEtape` refuse le niveau 3 (`src/lib/auth-guards.ts`), page
      `/referent/experts` et `getDashboardExperts` / `compterActionsExperts` supprimés,
      `referentSidebarItems` ne garde que « Justifications à valider ». `suitEtapeSansAssignation`
      est remplacé par `consulteEtape3`.
- [x] **Phase 5 — Liens et notifications.** ✅ Fait — `evaluateurThreadUrl` (référent pour les
      niveaux 1–2, Commission pour l'Étape 3) et `dossierAValiderUrl` (Coordination) dans
      `src/lib/links.ts`, utilisés par `notification.service.ts` ; `validateBadge` renvoie le niveau
      pour que `validateEtape` redirige vers l'espace d'origine et rafraîchisse tout le layout
      (compteurs) ; le journal de l'Analyse ouvre les réalisations de l'Étape 3 dans l'espace où
      l'on se trouve (`ValidationEvent.etapeNiveau`). Vérifié dans le navigateur avec les rôles
      Commission, Coordinateur et Admin.
