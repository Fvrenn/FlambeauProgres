# Étape 3 « Servir » — profils

Source : `public/livrets/servir/parcours-servir-v03-2021.pdf`.

## Contenu

L'étape 3 se décline en **trois profils** : Leader, Formateur et Expert. Chacun ouvre sur un
prérequis (« Passer une spé au choix »), des compétences et des réalisations.

| Profil    | `number` | `wpValue` | Écusson                           | Statut                         |
| --------- | -------- | --------- | --------------------------------- | ------------------------------ |
| Expert    | `3a`     | `301`     | aucun                             | **non intégré**, voir plus bas |
| Formateur | `3b`     | `302`     | `/etapes/3b-profil_formateur.png` | intégré                        |
| Leader    | `3c`     | `303`     | `/etapes/3c-profil_leader.png`    | intégré                        |

La numérotation suit la règle des lettres déjà établie sur la taxonomie de la plateforme
(`3` + index de la lettre sur deux chiffres), voir [sync-progression-plateforme](./sync-progression-plateforme.md).
Les couleurs (`#26bebc`, `#71b747`) sont échantillonnées directement dans les écussons.

Seuls Leader et Formateur ont un écusson : le livret précise que le badge est remis « uniquement
pour Leader et formateur », l'Expert recevant une étoile à poser sur le badge de la spécialité
correspondante. C'est aussi pourquoi la bande d'icônes affiche un repli avec le numéro de l'étape
quand `image_src` est nul.

### Codes d'objectifs

Les codes du livret sont repris tels quels (`F0`–`F8`, `L0`–`L9`), y compris le **`F6` manquant** :
le livret passe de `F5` à `F7`. Ce n'est pas une omission.

⚠️ Ces codes **entrent en collision** avec ceux de l'étape 2 : `2f Communication` utilise `F1`–`F9`
et `2l Nature` utilise `L1`–`L9`. Il n'y a pas de conflit en base, la contrainte étant
`@@unique([etapeId, code])`, et tous les écrans qui affichent un code le font dans le contexte d'une
étape identifiée. Le seul endroit potentiellement ambigu est la page de révision, qui liste des
justifications de plusieurs étapes. Le livret lui-même préfixe par l'étape dans sa convention de
nommage de fichiers (`3L9-…`) : c'est la piste si l'ambiguïté devient gênante.

### Le prérequis L0 / F0

`TypeObjectif` ne connaît que `COMPETENCE` et `REALISATION`. Le prérequis est modélisé en
`COMPETENCE` avec `texteRequis`, le chef y précisant la spé passée — ce qui correspond au blanc
`(______)` du livret. Un troisième type `PREREQUIS` fausserait les compteurs de complétude du
tableau de bord référent, qui comparent `competencesValidees === totalCompetences`. Le véritable
verrouillage passe par la règle d'accès ci-dessous, pas par le type de l'objectif.

## Règle d'accès

`etapeEstAccessible` (`src/lib/parcours.ts`) prend un `ContexteParcours` et applique, dans l'ordre :
le déblocage par jalons déjà en place, puis pour le niveau 3 **au moins une spécialité de niveau 2
validée**, puis pour les profils **le jalon « Servir » validé**.

Une étape **déjà validée reste toujours accessible**, même si le prérequis n'est pas rempli. Sans
cette garantie, un chef qui coche « Leader » sur la plateforme sans avoir de spé verrait une étape
validée en base mais invisible à l'écran.

### Le jalon « Servir »

Comme l'Allume-feu et l'Étape 1 « Découvrir », l'étape 3 s'ouvre en lisant son livret : l'étape `3`
(`niveau 3`, `type JALON`) affiche le même `JalonBadge` — illustration, PDF, puis « J'ai lu le
livret » qui appelle `validerJalon`.

Le déblocage par niveau **ne peut pas** exprimer ce verrou : `niveauMaxDebloque` renverrait 3, et
`etapeEstDebloquee(3, 3)` est vrai pour les profils comme pour le jalon, qui partagent le niveau. Il
n'existe pas de palier entre les spécialités (2) et les profils (3). D'où `jalonProfilsEstValide`,
une condition explicite qui s'ajoute à `specialiteValidee` — exactement comme cette dernière était
déjà un cas particulier du niveau 3. Le jalon lui-même n'exige que la spécialité, sinon il
s'auto-verrouillerait. `autoValiderJalon` rejoue cette garde côté serveur : sans spécialité validée,
un POST direct sur le jalon `3` est refusé.

Séquence obtenue : spécialités → le jalon `3` apparaît → livret lu → `3b`/`3c` apparaissent.

Deux conséquences côté écran :

- `currentJalon` (`DashboardClient`) ne retient que les jalons de niveau < 3. Sans ce filtre, le
  jalon « Servir » remplacerait toute la bande d'écussons dès qu'une spécialité est validée, et le
  chef perdrait l'accès à ses spés.
- Le sélecteur `Étape 2 | Étape 3` apparaît dès que l'étape 3 est atteignable — profils déverrouillés
  **ou** livret à lire. Sinon le livret serait inatteignable, puisque c'est lui qui déverrouille les
  profils qui font apparaître le sélecteur. Sur l'onglet « Étape 3 », tant que le livret n'est pas
  validé, c'est le `JalonBadge` (variante `compact`, à la taille des écussons) qui occupe la bande.

L'illustration `public/livrets/servir/illustration.png` est extraite du PDF du livret
(`pdfimages` puis application du masque alpha), pour suivre la convention des deux autres livrets.

## Affichage

La bande d'écussons de la chemise (`contentChemise.tsx`) affiche un sélecteur `Étape 2 | Étape 3`
au-dessus des écussons, dans les conditions décrites plus haut (profils déverrouillés ou livret à
lire). Changer de niveau désélectionne l'étape courante, pour que le panneau de droite et la
surbrillance 3D restent cohérents avec ce qui est affiché. Sur ordinateur, chaque onglet pagine ses
écussons (`GrilleBadges.tsx`, 12 au plus par page selon la hauteur d'écran) ; sur téléphone, ils
défilent sur une ligne.

`/progression` n'a pas été séparée : les profils y apparaissent à la suite des spécialités.

## Ce qui reste à faire

- [ ] **Profil Expert** — voir « Plan : profil Expert » ci-dessous.
- [ ] **Modèle 3D.** Le GLB ne contient que `badge_2B`…`badge_2N` et les passants `Etape 1`,
      `Etape 1.001`, `Etape 2`. Il n'y a **ni `badge_3B`/`badge_3C`, ni passant « Etape 3 »** : le
      3ᵉ passant vert et les écussons de profil ne peuvent pas s'afficher sur la chemise sans un
      ré-export depuis Blender. Rien ne casse en attendant — la sélection compare les noms de nœuds
      et ne trouve simplement rien. `evaluerAvancementBarettes` (`src/lib/chemise-parts.ts`) devra
      alors gérer un `etape3Validee`.
- [x] **Référents.** ✅ Fait — deux rôles (`COMMISSION_FORMATION`, `COORDINATEUR_NATIONAL`)
      remplacent l'assignation `EtapeReferent` sur le niveau 3, voir « Rôles de l'étape 3 » ci-dessous.
      Où : `prisma/schema.prisma` + migration `20260909120000_roles_commission_coordinateur`,
      `src/lib/roles.ts`, `src/lib/auth-guards.ts`, `src/lib/auth-server.ts`,
      `src/services/{etape,discussion,notification}.service.ts`,
      `src/actions/{etape,discussion}/*.actions.ts`, pages `(referent)` et `admin`.
      Comment : `peutEvaluerEtape` / `peutValiderEtape` centralisent la règle, les rôles ouvrent
      l'accès sans ligne `EtapeReferent`.

## Plan : profil Expert

### Décision : une étape Expert par spécialité

Le livret décline l'Expert « pour chaque spécialité » et autorise plusieurs Experts par chef.
`@@unique([chefId, etapeId])` et `@@unique([chefId, objectifId])` interdisent d'en représenter
plusieurs sur une seule étape ; plutôt que d'ajouter une dimension « spécialité » à
`ChefEtapeStatut` et `Justification`, **on crée une étape `BADGE` de niveau 3 par spécialité**
(12 : `2b`, `2c`, `2e`…`2n`), chacune avec les mêmes objectifs `E1`–`E5` du livret (pas de `E0` : la spé correspondante est déjà exigée par la règle d'accès). Le schéma des
justifications, des statuts, des fils et des notifications ne change pas.

- Numérotation : `3a-<numéro de la spé>`, par exemple `3a-2f` (Expert Communication).
- `wpValue` : `null`. La plateforme n'a qu'un terme `301 Expert` et la fonctionnalité n'y est pas
  développée ; les Experts ne sont donc pas synchronisés pour l'instant.
- Écusson : celui de la spécialité, avec une pastille étoile dans la grille ; l'étoile sur la
  chemise 3D relève du ré-export du modèle.

### Ce que cela change dans le code

Le seul point qui n'existe pas : **relier un Expert à sa spécialité**. `etapeEstAccessible` n'exige
aujourd'hui qu'« au moins une spé validée » (`specialiteValidee`, booléen global). Pour l'Expert, la
règle devient « **sa** spé validée ».

- `Etape.specialiteId String?` : auto-relation vers l'étape de niveau 2 correspondante (nulle pour
  tout le reste). Migration écrite à la main, voir `CLAUDE.md`.
- `ContexteParcours` expose les étapes validées (`etapesValidees` y est déjà) ; `etapeEstAccessible`
  ajoute une branche : une étape avec `specialiteId` exige `etapesValidees.has(specialiteId)` et
  `jalonProfilsValide`. Fonction pure, testée dans `parcours.test.ts`.
- Dashboard : l'onglet « Étape 3 » liste Formateur, Leader et seulement les Experts dont la spé est
  validée ; chaque Expert commencé garde sa propre carte avec son icône « en cours ».
- Rien à changer pour les rôles : `peutEvaluerEtape` / `peutValiderEtape` raisonnent déjà par niveau.

### Phases

- [x] **Phase 1 — Données.** ✅ Fait — colonne `Etape.specialiteId` (auto-relation `ExpertSpecialite`,
      `onDelete: SetNull`), 12 étapes `3a-<spé>` (`Expert <nom de la spé>`, couleur de la spé, ordre
      4 à 15, `wpValue` nul) et leurs objectifs `E1`–`E5` (`E4` rappelle l'accord préalable de la
      commission). Où : `prisma/schema.prisma`, migration manuelle
      `20261021120000_profil_expert` (`INSERT IGNORE … SELECT`, rejouable), `prisma/seed.ts`.
      Comment : `migrate deploy` puis `generate`, `migrate diff` vide.
- [x] **Phase 2 — Règle d'accès.** ✅ Fait — une étape avec `specialiteId` n'est accessible que si
      **cette** spé est validée et que le livret « Servir » est lu ; les autres Experts restent
      indépendants, et un Expert déjà validé reste visible. Où : `src/lib/parcours.ts`
      (`etapeEstAccessible`, `EtapeParcours.specialiteId`), `src/services/etape.service.ts`
      (`specialiteId` ajouté aux deux `select` qui alimentent le contexte), 5 tests dans
      `src/lib/parcours.test.ts`. Comment : branche ajoutée en fin de `etapeEstAccessible`, fonction
      pure sans changement de signature.
- [x] **Phase 3 — Affichage.** ✅ Fait — l'onglet « Étape 3 » affiche Formateur, Leader et les seuls
      Experts dont la spé est validée (le filtre `!verrouille` de `contentChemise.tsx` suffit, grâce à
      la règle de la phase 2). L'Expert reprend l'écusson de sa spé (le livret ne lui en donne pas,
      seulement une étoile à poser dessus) et porte une pastille étoile ; le tooltip affiche
      « Expert <spé> ». Où : migration `20261021130000_expert_ecusson` (`image_src` copié depuis la
      spé), `prisma/seed.ts`, `GrilleBadges.tsx` (pastille `Profil Expert`). `/progression` liste les
      Experts à la suite, sans changement.
- [x] **Phase 4 — Page « Experts » pour la commission.** ✅ Fait — une section « Profils Expert » dans
      le sélecteur de contexte ne disait pas où se trouvait une action à faire parmi 12 entrées. La
      commission et le Coordinateur disposent d'une page `/referent/experts` : les mêmes trois listes
      que le dashboard référent (réalisations à valider, en attente du chef, badges complets à
      réviser), **toutes spécialités confondues**, avec une colonne « Étape ». Une entrée « Experts »
      de la sidebar porte le nombre d'actions en attente (réalisations à évaluer pour la commission,
      dossiers à valider pour le Coordinateur). Les Experts ne figurent plus dans le sélecteur de
      contexte. Où : `src/app/(app)/(referent)/referent/experts/page.tsx` (réutilise
      `ReferentDashboardClient`, qui reçoit `titre` et `description`),
      `ReferentService.getDashboardExperts` / `compterActionsExperts` et `chefsAReviserPourEtape`
      (extrait de `getDashboard`) dans `src/services/referent.service.ts`, `ChefAReviser`
      (`src/types`), `referentSidebarItems` + `SidebarItem.compteur`, `ContextSwitcher.tsx`.
      Comment : une seule requête par liste sur les étapes à `specialiteId` non nul ; le badge
      « à réviser » reste calculé par étape. Aucune demande formelle d'Expert (option A) : un chef
      apparaît dès sa première justification soumise.
- [ ] **Phase 5 — Import plateforme.** Sans objet tant que `301 Expert` n'est pas développé côté
      plateforme ; à rouvrir alors (un chef avec plusieurs Experts pour un seul terme).

## Rôles de l'étape 3

Le livret confie l'**évaluation à la commission Formation** puis la **validation au Coordinateur
National** (« La commission formation transmet au Coordinateur National pour validation »). Deux
rôles `UserRole` traduisent ce circuit :

| Rôle                    | Droits Admin | En plus                                          |
| ----------------------- | ------------ | ------------------------------------------------ |
| `COMMISSION_FORMATION`  | oui          | évalue les réalisations des étapes de niveau ≥ 3 |
| `COORDINATEUR_NATIONAL` | oui          | valide le badge des étapes de niveau ≥ 3         |

Tout ce que fait `ADMIN`, ces deux rôles le font : `ROLES_ADMIN` et `ROLES_REFERENT`
(`src/lib/roles.ts`) remplacent partout les comparaisons littérales `=== "ADMIN"`, y compris les
gardes des actions admin (`admin/_actions/*.actions.ts`), les pages et layouts `/admin` et
`(referent)`, la sidebar et le `ContextSwitcher`.

### Règle d'autorisation

`peutEvaluerEtape(role, niveau, estAssigne)` et `peutValiderEtape(role, niveau, estAssigne)` sont
les deux seules portes :

- **niveau < 3** : inchangé — il faut une ligne `EtapeReferent`.
- **niveau ≥ 3** : l'assignation ne joue plus, c'est le rôle qui décide. La commission évalue, le
  Coordinateur valide, et l'un ne peut pas faire le travail de l'autre.

Ces deux rôles voient donc les profils `3b`/`3c` **sans assignation** : `getUser`
(`src/lib/auth-server.ts`) ajoute les étapes de niveau ≥ 3 à `etapesReferent`, ce qui alimente la
sidebar et le sélecteur de contexte, et `canAccessJustification` / `suitEtape` les laissent ouvrir
les fils et les tableaux de bord. C'est pourquoi le compteur « étapes sans référent » du tableau de
bord admin ne compte que les badges gérés par assignation (niveaux 1 et 2).

Les notifications suivent : `NotificationService.getEvaluateursEtape` ajoute les membres de la
commission aux destinataires d'une étape de niveau ≥ 3, sans quoi une réalisation soumise sur `3b`
n'aurait alerté personne.

Côté écran, `peutEvaluer` / `peutValider` sont calculés sur le serveur et descendus en props
(`ReferentDashboardClient` → `ReferentValidationModal` → `DiscussionThread`, et `RevisionClient`)
pour masquer un bouton que l'action refuserait de toute façon.

### Circuit d'évaluation (conforme au livret, p. 3 et 5)

Le livret : « adresse-toi à la commission Formation pour l'évaluation de tes **compétences et des
réalisations** », puis « la commission formation transmet au Coordinateur National pour
validation ». Dans l'app, pour une étape de niveau ≥ 3 :

1. **Compétences et réalisations sont soumises à la commission.** Contrairement à l'étape 2, une
   compétence n'est plus auto-validée : `competenceSoumiseAEvaluation` (`src/lib/roles.ts`) la fait
   passer par le même circuit qu'une réalisation (`SOUMISE`, fil de discussion, notification de la
   commission), via `soumettreAEvaluation` dans `JustificationService`.
2. **Seule la commission intervient dans les fils** : valider, mais aussi demander des précisions.
   Le Coordinateur National, et tout référent assigné par erreur, les lisent sans pouvoir écrire
   (`estEvaluateur` dans `DiscussionService.postMessage`, `peutEcrire` côté écran).
3. **Le Coordinateur National est prévenu** (notification `DOSSIER_A_VALIDER` et email) dès que la
   commission valide la dernière pièce d'un dossier (`NotificationService.notifierDossierAValider`).
4. **Il ne peut valider qu'un dossier complet** : `EtapeService.validateBadge` refuse tant que
   toutes les compétences et réalisations ne sont pas validées (`estDossierComplet`). La règle vaut
   aussi pour l'étape 2, où le référent validait jusqu'ici sans contrôle serveur.
5. **Personne ne valide son propre travail** : une réalisation, une compétence ou une étape.

Ce qui « compte » comme validé dépend du niveau : `statutValidant` / `filtreJustificationsValidantes`
(`src/lib/justification.ts`) — compétence d'étape 2 `AUTO_VALIDEE`, compétence d'étape 3 et toute
réalisation `VALIDEE`. Le tableau de bord référent, la page de révision et `estDossierComplet`
partagent ce filtre.

**Pas d'assignation sur l'étape 3 ni sur les jalons** : `etapeSeGereParAssignation` et
`FILTRE_ETAPES_PAR_ASSIGNATION` (`src/lib/roles.ts`) limitent la page Assignations, le refus serveur
d'`AssignationService.assign` et le compteur « étapes sans référent » aux badges des niveaux 1 et 2.

### Écarts restants avec le livret

- **Badge et étoile.** Le livret remet le badge Leader / Formateur **au début** d'une réalisation,
  puis une **étoile** et le 3ᵉ passant vert à la validation. L'app n'affiche l'écusson qu'une fois
  l'étape validée et ne connaît pas l'étoile.
- **Accord préalable pour E4** (« à valider avec la commission si possible en amont ») : sans
  objet tant que le profil Expert n'est pas intégré.
- **Règle du Formateur** (ne former que dans ses spécialités) : règle de conduite, non vérifiable.

## Note de migration

`20260909150000_jalon_servir` insère l'étape jalon `3 Servir`. Comme pour les profils, la ligne est
créée en SQL (`INSERT IGNORE`, la contrainte d'unicité sur `number` rend le rejeu inoffensif) et
ajoutée en parallèle au seed.

`20260909120000_roles_commission_coordinateur` ajoute `COMMISSION_FORMATION` et
`COORDINATEUR_NATIONAL` à l'énumération `users.role`. Migration écrite à la main (un `ALTER TABLE …
MODIFY` de l'ENUM) puis appliquée avec `migrate deploy`.

`20260829160000_etape_3_profils` élargit `etapes.description` et `objectifs.description` de
`VARCHAR(191)` à `TEXT`. Les textes du livret dépassaient la limite — c'est d'ailleurs pourquoi les
descriptions d'étape 2 existantes finissent toutes par « … ». Au passage, cela corrige une
incohérence : `admin.actions.ts` validait déjà `description` jusqu'à 2000 caractères, donc une
description longue saisie depuis l'admin échouait à l'écriture.

`20260928160000_etape3_evaluation_commission` ajoute `DOSSIER_A_VALIDER` à `TypeNotification`,
supprime les assignations existantes sur les jalons et l'étape 3, et renvoie en évaluation les
compétences d'étape 3 déjà `AUTO_VALIDEE` (statut `SOUMISE`, avec le texte du chef en premier
message du fil) pour qu'elles passent par la commission comme les autres.
