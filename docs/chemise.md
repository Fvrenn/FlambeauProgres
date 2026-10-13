# Chemise 3D : modèle et aperçus

Le tableau de bord du Chef affiche une chemise en 3D (`chemiseModel.tsx`, React Three Fiber). Pendant
le chargement de la 3D, une image statique (« aperçu ») est affichée à sa place, puis s'efface.

| Fichier                                   | Rôle                                                      |
| ----------------------------------------- | --------------------------------------------------------- |
| `public/chemise/chemise.glb`              | Modèle chargé par l'app (compressé, Draco + textures WebP) |
| `public/chemise/apercu-*.webp`            | 18 aperçus statiques                                      |
| `scripts/optimize-glb.sh`                 | Compression du modèle exporté de Blender                  |
| `scripts/apercus-chemise/`                | Génération des aperçus (`generer.mjs` + `index.html`)     |
| `src/lib/chemise-parts.ts`                | Objets affichés selon la branche et les étapes validées   |
| `src/lib/apercu-chemise.ts`               | Choix de l'aperçu (`cheminApercuChemise`)                 |

## 1. Exporter depuis Blender

Exporter en `.glb` (glTF binaire). **Ne pas garder le fichier exporté dans `public/`** : il pèse
plusieurs Mo et serait servi en ligne. Le ranger hors du projet (ou à la racine, sans le commiter).

### Noms d'objets attendus par le code

Le code retrouve les objets **par leur nom** : un objet renommé ne réagit plus.

| Nom dans Blender                                          | Utilisation                                       |
| --------------------------------------------------------- | ------------------------------------------------- |
| `Epaulette branche F gauche` / `droite`                   | Visibles si le Chef est de la branche Flambeaux   |
| `Epaulette branche PF gauche` / `droite`                  | Visibles si le Chef est de la branche Petits Flambeaux |
| `Etape 1`                                                 | Barrette visible quand l'étape 1 est validée      |
| `Etape 2`                                                 | Barrette visible quand l'étape 1 et un badge d'étape 2 sont validés |
| `Etape 1.001`                                             | Doublon, toujours masqué                          |
| `badge_<numéro>` (`badge_2B` … `badge_2N`, `badge_3B`, `badge_3C`) | Badge mis en avant quand l'étape `<numéro>` est sélectionnée, grisé sinon |

- Le `<numéro>` d'un badge est le `number` de l'étape en base (`2b`, `3c`…), sans tenir compte de la
  casse.
- Chaque badge doit garder **son propre matériau** : la couleur est modifiée à l'exécution.
- Une nouvelle barrette (ex. `Etape 3`) ne s'affichera qu'après ajout de sa condition dans
  `chemise-parts.ts` (et dans `scripts/apercus-chemise/index.html`).

## 2. Optimiser le modèle

```bash
bash scripts/optimize-glb.sh <export.glb> public/chemise/chemise.glb
```

Le script enchaîne `dedup`, `weld`, conversion des textures en WebP et compression Draco, sans
toucher aux noms ni à la hiérarchie des objets (≈ 4,5 Mo → ≈ 0,9 Mo). Un 3ᵉ argument optionnel
(`0.5`…) simplifie la géométrie ; par défaut, aucune simplification.

`npm run glb:optimize` recompresse directement `public/chemise/chemise.glb`.

⚠️ **Ne jamais utiliser `gltf-transform optimize`** : il fusionne les matériaux et casse la coloration
des badges. Draco est préféré à Meshopt, qui crée des bandes sur les surfaces planes (poches).

Vérification rapide : `npx gltf-transform inspect public/chemise/chemise.glb` (les noms des objets
doivent être ceux du tableau ci-dessus).

## 3. Régénérer les aperçus

À refaire quand l'apparence de la chemise change (géométrie, textures, couleurs). Un simple
renommage d'objets ne demande pas de nouveaux aperçus.

```bash
npm run chemise:apercus
```

- Rend la chemise avec three.js dans Chrome headless (rendu logiciel SwiftShader), puis écrit les
  images WebP 800 × 800 transparentes dans `public/chemise/`. Durée : quelques secondes.
- Chrome est cherché dans `C:/Program Files/Google/Chrome/Application/chrome.exe` ; sinon, définir
  `CHROME_PATH`.
- 18 images : `apercu-{ordinateur|telephone}-{f|pf|sans-branche}[-etape1|-etape2].webp`
  (format × branche × barrettes). Sans suffixe : aucune barrette.

La page de rendu (`scripts/apercus-chemise/index.html`) reprend la caméra, les lumières, les
positions et les matériaux de `chemiseModel.tsx`. **Toute modification de ces réglages dans l'app
doit être reportée dans la page**, sinon l'aperçu et la 3D ne se superposent plus et la chemise
« saute » à la fin du chargement.

Vérifier ensuite sur le tableau de bord (ordinateur et téléphone) que l'aperçu et la 3D se
superposent exactement.
