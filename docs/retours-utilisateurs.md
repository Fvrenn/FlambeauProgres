# Retours utilisateurs — octobre 2026

Retours des premiers utilisateurs (chefs et référents) et ce qui a été fait pour chacun.

**Règle commune** : tout retour en arrière (compétence, réalisation, validation) reste possible **tant que l'étape du chef n'est pas validée** (`ChefEtapeStatut.statut = VALIDE`). Une fois l'étape validée, on bloque pour ne pas désynchroniser la progression avec la plateforme WordPress (`MESSAGE_ETAPE_DEJA_VALIDEE`).

Le refus d'une réalisation n'a pas de statut dédié : le validateur écrit au chef, ce qui passe la réalisation en `DEMANDE_PRECISION` (onglet « En attente du chef »). Une aide l'indique sous le bouton de validation.

## Phases

- [x] **Phase 1 — Chat mobile**
  ✅ Fait — `src/components/discussion/` : la modale de discussion passe en plein écran sur mobile (`CLASSES_MODALE_DISCUSSION` dans `types.ts`, `100dvh`, utilisée par `ObjectifModal` et `ReferentValidationModal`) ; `MessageList` fait défiler son propre conteneur, et seulement quand un nouveau message arrive (avant : `scrollIntoView` à chaque rafraîchissement de 7 s, qui faisait sauter la page) ; `MessageComposer` passe en 16 px sur mobile (plus de zoom iOS au focus) et Entrée n'envoie plus le message sur écran tactile ; le pied du fil respecte la zone sûre (`safe-area-inset-bottom`).

- [x] **Phase 2 — Notifications**
  ✅ Fait — `NotificationService` : ouvrir un fil marque comme lues **toutes** les notifications de la réalisation (avant : seulement les messages) ; côté chef aussi (`ObjectifModal`). Valider ou répondre marque comme traitées les notifications de **tous** les évaluateurs (`marquerTraiteePourEvaluateurs`). Les notifications lues disparaissent de la liste 3 jours après lecture (`DUREE_AFFICHAGE_NOTIFICATION_LUE_MS`, filtre dans `getForUser`).

- [x] **Phase 3 — Retours en arrière côté chef**
  ✅ Fait — `JustificationService.annuler` + action `annulerJustification` (`src/actions/dashboard/justification.actions.ts`). Compétence auto-validée : bouton « Annuler la validation » dans `ObjectifModal`, elle repasse en `BROUILLON` avec son texte. Réalisation (ou compétence d'étape 3) en attente : bouton « Retirer ma soumission » dans le fil (`DiscussionThread`, prop `onRetirer`), message système dans le fil, notifications des évaluateurs supprimées.

- [x] **Phase 4 — Retour en arrière côté validateur**
  ✅ Fait — `DiscussionService.annulerValidation` + action `annulerValidationRealisation` : bouton « Revenir sur la validation » dans un fil validé ; la réalisation repasse en `SOUMISE` avec un message système. `getThread` renvoie `etapeValidee` pour masquer le bouton une fois l'étape validée.

- [x] **Phase 5 — Navigation référent**
  ✅ Fait — Lien depuis l'analyse : `referent/dashboard/page.tsx` charge la réalisation ciblée (`ReferentService.getJustificationSuivie`), quel que soit son statut, et ouvre la modale. Étape du chef : bouton « Voir son étape » dans `ReferentValidationModal`, vers `/referent/revision`, qui affiche maintenant tous les objectifs de l'étape avec leur statut (`StatusChip` déplacé dans `src/components/ui/`) et un lien vers chaque discussion ; la validation finale y reste réservée aux dossiers complets et non encore validés.
