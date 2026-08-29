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

`etapeEstAccessible` (`src/lib/parcours.ts`) : une étape de niveau 3 n'est accessible que si le chef
a **au moins une spécialité de niveau 2 validée**, en plus du déblocage par jalons déjà en place.

Une étape **déjà validée reste toujours accessible**, même si le prérequis n'est pas rempli. Sans
cette garantie, un chef qui coche « Leader » sur la plateforme sans avoir de spé verrait une étape
validée en base mais invisible à l'écran.

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
- [ ] **Référents.** L'étape 3 est validée par la commission Formation puis le Coordinateur
      National, alors que l'app assigne des référents par étape (`EtapeReferent`). Sans assignation
      sur `3b` et `3c`, aucun validateur ne verra ces étapes dans son tableau de bord.

## Note de migration

`20260829160000_etape_3_profils` élargit `etapes.description` et `objectifs.description` de
`VARCHAR(191)` à `TEXT`. Les textes du livret dépassaient la limite — c'est d'ailleurs pourquoi les
descriptions d'étape 2 existantes finissent toutes par « … ». Au passage, cela corrige une
incohérence : `admin.actions.ts` validait déjà `description` jusqu'à 2000 caractères, donc une
description longue saisie depuis l'admin échouait à l'écriture.
