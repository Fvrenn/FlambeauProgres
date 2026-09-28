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

La bande d'icônes de la chemise (`contentChemise.tsx`) affiche un sélecteur `Étape 2 | Étape 3`
au-dessus des écussons, qui n'apparaît que lorsqu'au moins un profil est déverrouillé. Changer de
niveau désélectionne l'étape courante, pour que le panneau de droite et la surbrillance 3D restent
cohérents avec ce qui est affiché.

`/progression` n'a pas été séparée : les profils y apparaissent à la suite des spécialités.

## Ce qui reste à faire

- [ ] **Profil Expert.** Il se décline par spécialité et le livret précise qu'« il est possible de
      faire plusieurs étapes Expert », ce que `@@unique([chefId, etapeId])` ne permet pas de
      représenter. La plateforme a la même limite : un seul terme `301 Expert`. Piste retenue :
      une seule étape Expert, affichée au même endroit que les deux autres profils, dont le clic
      ouvre la liste des spécialités dans le panneau de droite pour choisir celle que l'on prolonge.
      Tant qu'elle n'existe pas, `301 Expert` reste dans les entrées « non reconnues » de l'import.
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
`authorizeRole` de `admin.actions.ts`, les layouts `/admin` et `(referent)`, la sidebar et le
`ContextSwitcher`.

### Règle d'autorisation

`peutEvaluerEtape(role, niveau, estAssigne)` et `peutValiderEtape(role, niveau, estAssigne)` sont
les deux seules portes :

- **niveau < 3** : inchangé — il faut une ligne `EtapeReferent`.
- **niveau ≥ 3** : l'assignation ne joue plus, c'est le rôle qui décide. La commission évalue, le
  Coordinateur valide, et l'un ne peut pas faire le travail de l'autre.

Ces deux rôles voient donc les profils `3b`/`3c` **sans assignation** : `getSession`
(`src/lib/auth-server.ts`) ajoute les étapes de niveau ≥ 3 à `etapesReferent`, ce qui alimente la
sidebar et le sélecteur de contexte, et `canAccessJustification` les laisse ouvrir les fils.
C'est pourquoi le compteur « étapes sans référent » du tableau de bord admin exclut le niveau 3.

Les notifications suivent : `NotificationService.getEvaluateursEtape` ajoute les membres de la
commission aux destinataires d'une étape de niveau ≥ 3, sans quoi une réalisation soumise sur `3b`
n'aurait alerté personne.

Côté écran, `peutEvaluer` / `peutValider` sont calculés sur le serveur et descendus en props
(`ReferentDashboardClientV2` → `ReferentValidationModal` → `DiscussionThread`, et `RevisionClient`)
pour masquer un bouton que l'action refuserait de toute façon.

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
