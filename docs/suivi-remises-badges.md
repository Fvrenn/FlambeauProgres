# Suivi : en attente, à remettre et remises de badges

## Constat

Retour de terrain (novembre 2026) : référents et commission Formation veulent « faire le point sur
ce qui est validé pour la prochaine remise de badges et ce qui est en attente, pour suivre ». La
remise est aujourd'hui suivie dans un tableur mis à jour une fois par an avant l'AG, ce qui ne
tiendra pas si l'usage se développe.

L'onglet Analyse ne montre que l'historique des validations (indicateurs, classements, journal) :

- rien sur ce qui **reste à traiter** (réalisations à évaluer, en attente du chef, badges
  complets à valider) ;
- rien sur la **remise** : la base ne sait pas si un badge validé a été remis.

## Décisions

- L'onglet **Analyse devient « Suivi »**, en trois onglets :
  - **En attente** : tout ce qui reste à traiter, avec son ancienneté ;
  - **À remettre** : badges validés dans l'app et pas encore remis, par groupe, avec export ;
  - **Historique** : les remises passées, puis les statistiques actuelles de l'Analyse.
- **Visibilité** : Commission, Coordinateur et Admin voient tout (espaces Commission et
  Coordination). Chaque **référent** a son Suivi, limité aux étapes qui lui sont assignées (vue
  Référent).
- **Marquer une remise** : Coordinateur National et Admin, pour tous les badges. Les autres rôles
  voient les listes en lecture seule.
- **Une remise est un événement** (nom + date, ex. « AG 2026 ») auquel on rattache les badges
  remis : l'historique se lit par remise.
- **Badges importés de la plateforme** (origine `PLATEFORME`) : considérés comme déjà remis, ils
  n'entrent pas dans « À remettre ». Seuls les badges (`type BADGE`) validés dans l'app comptent ;
  les jalons (livrets lus) ne se remettent pas.

## Modèle

```prisma
model RemiseBadges {
  id        String   @id @default(cuid())
  nom       String
  date      DateTime
  creeParId String?
  createdAt DateTime @default(now())

  creePar User?             @relation("RemisesCreees", fields: [creeParId], references: [id], onDelete: SetNull)
  badges  ChefEtapeStatut[]

  @@map("remises_badges")
}
```

`ChefEtapeStatut.remiseId String?` (relation `onDelete: SetNull`) : supprimer une remise remet ses
badges dans « À remettre ». Une validation de badge ne peut plus être annulée une fois l'étape
validée, donc un badge remis ne disparaît pas.

## Phases

- [x] **Phase 1 — Modèle.** ✅ Fait — `RemiseBadges` et `ChefEtapeStatut.remiseId` (index sur
      `remiseId` et `creeParId`) dans `prisma/schema.prisma`, migration
      `20261105120000_remises_badges` (ajouts seulement : colonne nullable, table, index, clés
      étrangères `SET NULL`). Comment : SQL produit par `migrate diff` puis relu, `migrate deploy`,
      `generate`, `migrate diff` vide.
- [x] **Phase 2 — Service de suivi.** ✅ Fait — `SuiviService` (`src/services/suivi.service.ts`) :
      `getEnAttente`, `getARemettre`, `getRemises`, `getRemisesExistantes`, `marquerRemis`
      (transaction : crée ou retrouve la remise, n'y rattache que des badges encore à remettre et
      annule tout si l'un ne l'est plus), `retirerDeRemise`, `supprimerRemise`. Périmètre `"tout"`
      ou `{ etapeIds }`. Calculs purs dans `src/lib/suivi.ts` (`syntheseParEtape`,
      `lignesEnAttente` avec des liens qui restent dans l'espace d'où l'on vient, `parGroupe`,
      `joursDepuis`, `versCsvARemettre`) ; export CSV générique extrait dans `src/lib/csv.ts`.
      Tests : `suivi.test.ts`, `suivi.service.test.ts`.
- [x] **Phase 3 — Actions.** ✅ Fait — `marquerBadgesRemis`, `retirerBadgeDeRemise`,
      `supprimerRemise` (`src/actions/suivi/remise.actions.ts`) : `authorizeRole(...ROLES_GESTION_REMISES)`
      (Coordinateur, Admin) puis Zod (1 à 500 badges, nom de 2 à 120 caractères, date `AAAA-MM-JJ`),
      revalidation des trois pages Suivi. `peutGererRemises` dans `src/lib/roles.ts`.
- [x] **Phase 4 — Écran Suivi.** ✅ Fait — `src/components/suivi/` : `SuiviValidations` (serveur :
      charge les données, calcule l'ancienneté côté serveur), `SuiviOnglets` (quatre compteurs,
      onglet gardé dans `?onglet=`), `EnAttente` (synthèse par étape cliquable, détail filtrable
      par statut, groupe et recherche, ancienneté en orange au-delà de 30 jours), `ARemettre`
      (sélection multiple réservée au Coordinateur et à l'Admin, filtre par groupe, export CSV),
      `MarquerRemisModal` (nouvelle remise ou remise existante), `Historique` (remises dépliables
      par groupe, retrait d'un badge et suppression d'une remise avec confirmation, puis les
      statistiques). Comment : styles de tableau (`CLASSES_TABLEAU`) et sélecteur à boutons
      (`FiltreSegmente`) sortis dans `src/components/ui/` et réutilisés par le journal ; tri des
      groupes centralisé (`nomGroupe`, `comparerGroupes`, « Sans groupe » en dernier).
- [x] **Phase 5 — Intégration.** ✅ Fait — `/commission/suivi`, `/coordination/suivi` (tout le
      périmètre, statistiques de l'ancienne Analyse dans l'Historique) et `/referent/suivi`
      (étapes assignées, sans statistiques) ; entrées « Suivi » dans les trois barres
      (`src/config/navigation.ts`) ; `/commission/analyse` et `/coordination/analyse` supprimés,
      `AnalyseValidations` devient une section. Vérifié dans le navigateur : lecture seule pour la
      Commission, remise créée puis complétée par le Coordinateur, retrait d'un badge,
      suppression de la remise, périmètre du référent.
