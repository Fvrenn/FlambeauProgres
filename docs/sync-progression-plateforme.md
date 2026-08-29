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
validations effectuées _via_ Flambeau Progrès : l'onglet Analyse sert à savoir à qui remettre un
écusson, et un Chef qui a obtenu son badge avant le déploiement de l'app ne doit pas y figurer.

## Modèle

- `ChefEtapeStatut.origine` (`OrigineValidation` : `APP` | `PLATEFORME`).
  Le `statut` reste `VALIDE` dans les deux cas : l'étape compte pour l'affichage, le déblocage des
  niveaux et la chemise. Seule l'origine change.
- `Etape.wpValue` : identifiant de la taxonomie plateforme (`"203"`), modifiable depuis
  `/admin/etapes`. Sert de correspondance de secours et de valeur d'envoi pour le futur POST.
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
- [ ] **Phase 5 — Écriture (POST)** : cocher depuis Flambeau Progrès et mettre à jour le profil de la
      plateforme. Le chemin complet est en place mais désactivé tant que la route n'existe pas :
      `WORDPRESS_PROGRESSION_WRITE=true` active le bouton du profil,
      `pousserProgressionVersWp` (`src/lib/wordpress-progression-client.ts`) envoie
      `POST /wp-json/flbx/v1/user-info` avec `{ "progression": ["101", "203", ...] }`.
      À faire à l'ouverture de la route : confirmer le format attendu (nom du champ, nonce), puis
      basculer la variable d'environnement. Les `wpValue` sont vérifiés, plus rien à contrôler
      de ce côté.

      Les étapes sans `wpValue` (`Allume-feu`, et tout jalon propre à l'app) n'existent pas dans la
      taxonomie de la plateforme : elles sont simplement exclues de l'envoi et signalées dans les
      logs, sans faire échouer l'opération.

      L'envoi part du principe qu'il remplace **toute** la taxonomie `progression` du profil.
      `declarerSurPlateforme` relit donc le profil juste avant d'écrire et réémet les valeurs que
      l'app ne connaît pas (Branche Lumignons, Branche Pionniers, Ma spé, Étape 3) en plus des
      étapes cochées et de celles validées dans l'app ; si cette relecture échoue, rien n'est
      envoyé. Les en-têtes de catégorie (`1`, `2`, `3`) ne sont pas réémis : à confirmer si la
      plateforme les attend explicitement ou les déduit des enfants cochés.
