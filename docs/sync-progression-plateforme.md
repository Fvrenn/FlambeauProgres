# Synchronisation de la progression avec la plateforme

## Contexte

Le profil de la plateforme (`GET /wp-json/flbx/v1/user-info`) renvoie une taxonomie `progression`
où le Chef coche lui-même les étapes déjà obtenues :

```json
"progression": [
  { "value": "1",   "label": "<b>Étape 1</b>" },
  { "value": "101", "label": "--- Étape 1" },
  { "value": "2",   "label": "<b>Étape 2</b>" },
  { "value": "203", "label": "--- Branche Flambeaux" },
  { "value": "206", "label": "--- Communication" },
  { "value": "208", "label": "--- Cuisine" }
]
```

Ces étapes doivent apparaître comme **validées** dans l'app, sans jamais être comptées comme des
validations effectuées _via_ Flambeaux Progrès : l'onglet Analyse sert à savoir à qui remettre un
écusson, et un Chef qui a obtenu son badge avant le déploiement de l'app ne doit pas y figurer.

## API de la plateforme (documentation de l'admin, 28/09/2026)

Base : `https://plateforme.flambeaux.org/wp-json/flbx/v1`, appelée **côté serveur** en relayant le
cookie `wordpress_logged_in_*` de l'utilisateur.

- Toute requête envoie `X-WP-Nonce` avec n'importe quelle valeur, sans quoi WordPress ignore le
  cookie. Les écritures ne doivent **pas** envoyer d'en-tête `Origin` (le `fetch` de Node n'en met
  pas). Un seul point d'appel dans l'app : `appelerProfilWp` (`src/lib/wordpress-auth.ts`), qui ne
  suit pas les redirections.
- Réponses : cookie absent ou invalide → `302` vers la connexion (traité comme « pas de session ») ;
  connecté mais non membre du site → `401 flbx_not_member` (l'app renvoie vers `/non-membre` au
  lieu de boucler avec la page de connexion).
- `GET /user-info` : profil, dont `group` / `group_value` et `progression`.
- `GET /user-info/choices` : valeurs possibles de `groupe` et `progression`, dans l'ordre de l'admin.
- `POST /user-info` : `{ "groupe": 29, "progression": [1, 101, 2, 203] }`, au moins un des deux ;
  `progression` **remplace** la liste. Valeur inconnue → `400 rest_invalid_param`, rien n'est
  modifié.

## Modèle

- `ChefEtapeStatut.origine` (`OrigineValidation` : `APP` | `PLATEFORME`).
  Le `statut` reste `VALIDE` dans les deux cas : l'étape compte pour l'affichage, le déblocage des
  niveaux et la chemise. Seule l'origine change.
- `Etape.wpValue` : identifiant de la taxonomie plateforme (`"203"`), modifiable depuis
  `/admin/etapes`. Sert de correspondance de secours et de valeur d'envoi pour l'écriture (phase 5).
- `User.wpProgressionSyncAt` : dernière synchronisation (throttle de 5 min).

### Correspondance étape ↔ entrée plateforme

`src/lib/wordpress-progression.ts` : le libellé normalisé (`normalizeWpLabel`) est comparé au nom de
l'étape ; si aucun nom ne correspond, on retombe sur `Etape.wpValue`. Les en-têtes de catégorie
(`<b>Étape 2</b>`) sont écartés en amont par `parseWpProfile`. Les entrées non reconnues sont
loguées (`console.warn`), jamais devinées.

### Taxonomie de référence (relevée le 2026-08-29, profil complet coché)

| Valeur  | Libellé plateforme          | Étape de l'app                 |
| ------- | --------------------------- | ------------------------------ |
| 101     | Étape 1                     | `1` Découvrir                  |
| 201     | Branche Lumignons           | _absente de l'app_             |
| 202     | Branche Petits Flambeaux    | `2b`                           |
| 203     | Branche Flambeaux           | `2c`                           |
| 204     | Branche Pionniers           | _absente de l'app_             |
| 205     | Animation                   | `2e`                           |
| 206     | Communication               | `2f`                           |
| 207     | Construction                | `2g`                           |
| 208     | Cuisine                     | `2h`                           |
| 209     | Exploration                 | `2i`                           |
| 210     | Intendance                  | `2j`                           |
| 211     | Matériel                    | `2k`                           |
| 212     | Nature                      | `2l`                           |
| 213     | Santé                       | `2m`                           |
| 214     | **Vie Spi**                 | `2n` Vie **Spirituelle**       |
| 215     | Ma spé                      | _absente de l'app_             |
| 301–303 | Expert / Formateur / Leader | _Étape 3, pas encore intégrée_ |

Les `wpValue` en base correspondent exactement à cette liste (verrouillé par
`src/lib/wordpress-progression.test.ts`). Deux cas méritent attention :

- `214 Vie Spi` ≠ `Vie Spirituelle` : la correspondance par libellé échoue, c'est le `wpValue` qui
  fait le lien. Ne pas supprimer l'identifiant de cette étape.
- `201`, `204`, `215` et `301`–`303` n'ont pas d'étape correspondante : elles sont simplement
  ignorées et loguées. À l'intégration de l'Étape 3 (Expert, Formateur, Leader), renseigner leur
  « Identifiant plateforme » dans `/admin/etapes`.

## Règles de synchronisation (import)

À chaque requête authentifiée, au plus une fois toutes les 5 minutes :

| Situation                                      | Effet                            |
| ---------------------------------------------- | -------------------------------- |
| Cochée sur la plateforme, absente en base      | Création `VALIDE` / `PLATEFORME` |
| Cochée sur la plateforme, statut ≠ `VALIDE`    | Passage `VALIDE` / `PLATEFORME`  |
| Décochée sur la plateforme, ligne `PLATEFORME` | Suppression                      |
| Décochée sur la plateforme, ligne `APP`        | **Inchangée** (l'app fait foi)   |

Une validation faite dans l'app (`EtapeService.validateBadge` / `autoValiderJalon`) repasse toujours
l'origine à `APP`. Un échec de synchronisation n'empêche jamais la connexion.

## Statistiques

`AnalyticsService.getAnalytics` filtre les badges sur `origine: "APP"` : les étapes importées de la
plateforme n'apparaissent ni dans les KPI, ni dans le journal, ni dans les compteurs par référent.

## Phases

- [x] **Phase 1 — Modèle** : `OrigineValidation`, `ChefEtapeStatut.origine`, `Etape.wpValue`,
      `User.wpProgressionSyncAt`.
      ✅ Fait — `prisma/schema.prisma`, migrations `20260829120000_sync_progression_plateforme` et
      `20260829123000_wp_value_etapes_niveau2`, `prisma/seed.ts`.
- [x] **Phase 2 — Import (GET)** : correspondance + service de synchronisation branché sur l'auth.
      ✅ Fait — `src/lib/wordpress-progression.ts`, `src/services/wp-progression.service.ts`,
      `src/lib/wordpress-profile.ts` (`progressionEntries`), `src/lib/wordpress-auth.ts`.
      Tests : `src/lib/wordpress-progression.test.ts`.
- [x] **Phase 3 — Écusson** : exclusion des validations plateforme des statistiques.
      ✅ Fait — `src/services/analytics.service.ts` (`origine: "APP"`).
- [x] **Phase 4 — Restitution** : origine remontée jusqu'aux écrans Chef.
      ✅ Fait — `EtapeService` (`origineValidation`), carte `/progression`, `/profil`
      (`ProgressionPlateforme`), champ « Identifiant plateforme » dans `/admin/etapes`.
- [x] **Phase 5 — Écriture (POST)** : cocher depuis Flambeaux Progrès et mettre à jour le profil de la
      plateforme.
      ✅ Fait — route `POST /wp-json/flbx/v1/user-info` ouverte (doc « Flbx User Info API » : cookie
      `wordpress_logged_in_*`, `X-WP-Nonce: x`, pas d'en-tête `Origin`, `progression` **remplace** la
      liste). Activée par `WORDPRESS_PROGRESSION_WRITE=true`. Les en-têtes de catégorie sont désormais
      réémis : `avecCategories` (`src/lib/wordpress-progression.ts`) ajoute le parent de chaque valeur
      (`101` → `1`, `207` → `2`, `302` → `3`), comme dans l'exemple de la doc (`[1, 101, 2, 203]`).
      Notes d'origine :
      `WORDPRESS_PROGRESSION_WRITE=true` active le bouton du profil,
      `pousserProgressionVersWp` (`src/lib/wordpress-progression-client.ts`) envoie
      `POST /wp-json/flbx/v1/user-info` avec `{ "progression": ["101", "203", ...] }`.
      À faire à l'ouverture de la route : confirmer le format attendu (nom du champ, nonce), puis
      basculer la variable d'environnement. Les `wpValue` sont vérifiés, plus rien à contrôler
      de ce côté.

      Les étapes sans `wpValue` (`Allume-feu`, et tout jalon propre à l'app) n'existent pas dans la
      taxonomie de la plateforme : elles sont simplement exclues de l'envoi et signalées dans les
      logs, sans faire échouer l'opération.

      La lecture du profil WordPress est gardée 60 s en mémoire (`getSessionWp`), mais
      `declarerSurPlateforme` relit **toujours** en direct avant d'écrire (`fetchWpProgression`),
      et le cache de la session est vidé après une écriture réussie.

      L'envoi part du principe qu'il remplace **toute** la taxonomie `progression` du profil.
      `declarerSurPlateforme` relit donc le profil juste avant d'écrire et réémet les valeurs que
      l'app ne connaît pas (Branche Lumignons, Branche Pionniers, Ma spé, Étape 3) en plus des
      étapes cochées et de celles validées dans l'app ; si cette relecture échoue, rien n'est
      envoyé.
- [x] **Phase 6 — Envoi automatique des validations de l'app** : une étape validée par un référent
      arrive sur la plateforme sans action du chef.
      ✅ Fait — `WpProgressionService.envoyerValidationsManquantes`, appelée par `synchroniser` (donc à
      la connexion du chef, au plus toutes les 5 min). L'API n'écrit que le profil de l'utilisateur
      connecté : l'envoi ne peut pas partir au moment où le référent valide, il part à la visite
      suivante du chef, avec son cookie. On envoie les entrées actuelles du profil + les étapes
      `VALIDE`/`APP` absentes de la plateforme ; en cas d'échec, simple log et nouvel essai à la
      synchro suivante. L'origine reste `APP` en base : la relecture suivante voit l'étape déjà
      validée et n'y touche pas, donc le décompte des badges à remettre (`origine: "APP"`) est
      inchangé. Tests : `src/services/wp-progression.service.test.ts`.
- [ ] **Phase 7 — Groupe du membre** : le groupe (`group` de `GET /user-info`) est enregistré dans
      `User.groupe` à chaque connexion (`getSessionWp`, `src/lib/wordpress-auth.ts`) ; l'API ne lit
      que le profil de la personne connectée, un membre reste donc « Sans groupe » tant qu'il ne
      s'est pas reconnecté. Migration `20261012120000_groupe_utilisateur`.
      Affichage : `/profil` (ligne « Groupe »), `/admin/users` (colonne + filtre avec l'effectif de
      chaque groupe), `/referent/analyse` (carte « Étapes validées par groupe », filtre
      Toutes / Flambeaux Progrès / Plateforme). Calculs purs dans `src/lib/groupes.ts`,
      requête dans `AnalyticsService.getValidationsParGroupe` : validations `APP` signées par un
      référent (période et référent appliqués) + validations `PLATEFORME` des étapes qui ont un
      `wpValue` (pas les jalons implicites ; sans date réelle, elles ignorent la période et sont
      exclues quand un référent est filtré).
- [ ] **Phase 8 — Modal de première connexion** : à sa prochaine visite, chaque utilisateur voit une
      fois une modal en 2 étapes : les étapes déjà obtenues avant Flambeaux Progrès (icônes
      cliquables), puis son groupe (pré-rempli avec celui de la plateforme, pour pouvoir le changer
      facilement). « Passer » ou « Enregistrer » renseigne `User.accueilTermineAt` (migration
      `20261013120000_accueil_profil`) et la modal ne revient plus ; elle reste accessible depuis
      `/profil` (lien « Modifier » à côté du groupe).
      Code : `AccueilService` (`src/services/accueil.service.ts`), actions
      `src/actions/profil/accueil.actions.ts`, composants `src/components/application/accueil/`.
      Plateforme : liste des groupes lue sur `GET /user-info/choices` (gardée 10 min en mémoire,
      `fetchWpChoix`), groupe actuel lu dans `group_value`, envoi par `POST /user-info`
      `{ "groupe": 7 }` (`pousserGroupeVersWp`) ; les étapes passent par `declarerSurPlateforme`.
      Seul ce qui a changé est envoyé. Sans `WORDPRESS_PROGRESSION_WRITE=true` ou si la liste des
      groupes est illisible, la modal ne s'affiche pas.
      **Branche (F / PF) non proposée** : elle vient du champ `fonction` (`102` PF, `103` F), que le
      `POST` n'accepte pas, et l'app ne la stocke pas (relue sur la plateforme à chaque requête). À
      ajouter si l'admin de la plateforme ouvre `fonction` à l'écriture.
