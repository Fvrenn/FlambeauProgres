# Durcissement CSP et suppression des CDN tiers

## Contexte

L'administrateur qui héberge l'application veut un `Content-Security-Policy` strict. Deux ressources
étaient chargées depuis des CDN tiers, ce qui transmet l'IP des visiteurs à des serveurs externes
(problème RGPD) : le décodeur Draco de Google et l'API Iconify. Ces deux points sont prioritaires
sur le CSP lui-même, et doivent être réglés **avant** lui : un CSP posé trop tôt bloquerait des
ressources qu'on est justement en train de rapatrier.

### État des lieux au démarrage

- **Aucun CSP n'existait** dans le projet — ni `next.config.ts`, ni `middleware.ts`, ni ailleurs.
  Il n'y avait donc pas d'`unsafe-inline` à retirer : le CSP est à écrire depuis zéro.
- Les polices ne sont **pas** concernées : `src/config/fonts.ts` utilise `next/font/google`, qui
  télécharge Inter au build et l'auto-héberge (`.next/static/media/*.woff2`). Aucune requête vers
  `fonts.googleapis.com` ou `fonts.gstatic.com` à l'exécution.

## Arbitrages

- **Le CSP vit dans `middleware.ts`**, pas au niveau du reverse proxy : le nonce ne peut être
  généré que là, et deux CSP qui s'intersectent rendraient le diagnostic impossible. L'admin retire
  le sien.
- **Tous les en-têtes de sécurité sont centralisés dans le middleware** : ceux de `next.config.ts`
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`,
  `Permissions-Policy`) y seront déplacés en phase 3. Ils sont laissés en place jusque-là pour ne
  pas ouvrir une fenêtre sans aucun en-tête de sécurité.
- **Icônes : bundle local des icônes utilisées** (option A), pas de SVG statiques. À poids quasi
  identique (10,7 Ko contre 10,6 Ko gzip), c'est le coût de migration qui tranche : les SVG
  statiques imposaient de réécrire une centaine de sites d'appel, dont 17 qui passent un nom
  d'icône dynamique et auraient eu besoin d'une table rechargeant de toute façon tout le jeu.

## Phases

- [x] **Phase 1 — Décodeur Draco auto-hébergé** (RGPD)

      ✅ Fait — `src/app/(app)/(dashboard)/_component/contentChemise/chemiseModel.tsx`.

      Le décodeur était déjà présent dans `public/draco/` et `useGLTF()` pointait dessus, mais
      `useGLTF.preload("/chemise/chemise.glb")` était appelé **sans** second argument. Dans drei
      10.7.6 (`core/Gltf.js`), `dracoLoader` est un singleton de module et
      `extensions(useDraco = true, …)` fait
      `dracoLoader.setDecoderPath(typeof useDraco === 'string' ? useDraco : decoderPath)`, avec
      `decoderPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'`. Comme `preload`
      s'exécute au chargement du module, il partait avant tout rendu, avec le chemin Google.

      Correctif : constante `DRACO_DECODER_PATH = "/draco/"` passée à `useGLTF()` **et** à
      `useGLTF.preload()`, plus `useGLTF.setDecoderPath(DRACO_DECODER_PATH)` au niveau module pour
      écraser le défaut du singleton et couvrir tout futur appel sans argument.

      Vérifications : le décodeur WASM local décode les 41 primitives Draco de `chemise.glb`
      (80 855 sommets, 141 101 triangles) — le GLB exige `KHR_draco_mesh_compression`, donc sans
      décodeur fonctionnel la chemise ne s'afficherait pas du tout. Le bundle produit contient bien
      `setDecoderPath("/draco/")` et `preload("/chemise/chemise.glb", "/draco/")`.

      ⚠️ La chaîne `www.gstatic.com/draco` **reste présente** dans le chunk client : c'est la
      constante par défaut de drei, désormais morte (écrasée au chargement du module). Un `grep` du
      bundle ne prouve donc rien ; seule l'absence de requête réseau compte. Le `connect-src 'self'`
      de la phase 4 la neutralisera définitivement.

- [x] **Phase 2 — Icônes Iconify hors ligne** (RGPD)

      ✅ Fait — `scripts/build-icons.mjs`, `src/lib/icons.generated.ts`, `src/lib/icons.ts`,
      `@iconify-json/solar` en devDependency, scripts `build:icons` et `prebuild`.

      `scripts/build-icons.mjs` scanne `src/`, relève les noms `solar:*`, résout les alias de la
      collection et écrit un sous-ensemble typé dans `src/lib/icons.generated.ts` (généré, à ne pas
      modifier à la main). Il **échoue avec un code de sortie non nul** si un nom est introuvable,
      en indiquant le fichier fautif — indispensable puisqu'il n'y a plus de repli CDN pour masquer
      une faute de frappe. Branché en `prebuild`, il tourne donc à chaque `npm run build`.

      `src/lib/icons.ts` enregistre la collection puis réexporte `Icon`. Les 33 fichiers
      consommateurs importent désormais `@/lib/icons` au lieu de `@iconify/react`.

      L'import vient de **`@iconify/react/offline`**, l'entrée officielle sans module réseau :
      c'est une garantie matérielle (le code de requête n'est pas embarqué), pas une simple
      politique. Vérifié : plus aucune occurrence de `iconify.design` dans `.next/static` ni
      `.next/server`.

      `src/lib/icons.ts` porte `"use client"` : `@iconify/react/offline` est un module client, et
      `addCollection()` ne peut pas être appelé depuis le graphe serveur (le build échoue sinon avec
      « Attempted to call addCollection() from the server »). Les 5 composants serveur qui affichent
      une icône continuent de fonctionner : ils rendent un composant client, dont le module — et
      donc l'enregistrement de la collection — est évalué pendant le SSR.

      Bilan de poids : +10,7 Ko gzip pour les 57 icônes, −6,9 Ko gzip en passant de `iconify.js`
      (13,8 Ko) à `offline.js` (6,9 Ko), soit **≈ +3,8 Ko gzip net**. La devDependency
      `@iconify-json/solar` pèse 10,5 Mo mais ne part jamais dans le bundle. Importer la collection
      entière aurait coûté 1,82 Mo gzip.

      Corrigé au passage : `solar:send-linear` (`ObjectifModal.tsx`) n'existe pas dans la collection
      Solar et ne rendait donc **rien en production**. Remplacée par `solar:plain-linear`, déjà
      utilisée comme icône d'envoi dans `MessageComposer.tsx`. C'est le nouveau garde-fou qui l'a
      détectée dès sa première exécution. À noter aussi : `solar:magnifer-linear` (2 usages) est un
      alias vers `magnifier-linear` — le générateur résout les chaînes d'alias, sans quoi ces icônes
      disparaîtraient.

- [ ] **Phase 3 — Centralisation des en-têtes et CSP en `Report-Only`**

      Déplacer les cinq en-têtes de `next.config.ts` vers `middleware.ts`, puis y ajouter le CSP en
      `Content-Security-Policy-Report-Only` pour collecter les violations sans rien casser.

      Nonce : le middleware en génère un par requête, le pose sur les en-têtes de la *requête* et
      sur le CSP de la *réponse* ; Next le relit depuis le CSP de la requête et l'applique à ses
      propres balises `<script>`. Ajouter `'strict-dynamic'` pour autoriser les chunks chargés par
      le runtime Next sans énumérer d'URL.

      Impact sur le rendu : **nul ici**. Le nonce force le rendu dynamique, mais 18 des 19 routes
      sont déjà `ƒ` (dynamiques) à cause du middleware d'authentification qui lit les cookies
      WordPress à chaque requête. Seule `/_not-found` est statique.

      Attention au périmètre : le `matcher` du middleware exclut `_next/static` et les fichiers
      statiques. Ce n'est pas un problème — le CSP ne s'applique qu'au document HTML, pas à chaque
      ressource.

- [ ] **Phase 4 — CSP appliqué**

      Bascule de `Report-Only` vers `Content-Security-Policy` après observation.

      **`script-src` sans `unsafe-inline`, `style-src` avec.** Côté scripts, la seule chose qui
      exigerait `unsafe-inline` est Next lui-même, qui émet des `<script>` inline
      `self.__next_f.push(…)` pour streamer la charge utile RSC — le nonce les couvre. Ni HeroUI, ni
      framer-motion, ni react-three-fiber n'injectent de script inline.

      En revanche HeroUI et framer-motion produisent des **attributs** `style="…"`, qui relèvent de
      `style-src` / `style-src-attr` et **ne sont pas couverts par un nonce** (les nonces ne
      s'appliquent qu'aux éléments `<style>` et `<script>`). S'en passer imposerait
      `'unsafe-hashes'` et un hash par valeur d'attribut, ingérable avec framer-motion qui recalcule
      les styles à chaque frame. `style-src 'unsafe-inline'` est donc assumé : il n'autorise aucune
      exécution de code, ce qui répond à la demande de l'admin.

      Trois directives sans lesquelles la chemise 3D casse :

      | Directive | Raison |
      | --- | --- |
      | `worker-src blob:` | `DRACOLoader` crée son worker via `URL.createObjectURL(new Blob([…]))` |
      | `'wasm-unsafe-eval'` dans `script-src` | Chrome bloque `WebAssembly.instantiate` sous CSP sans elle, et le décodeur Draco est en WASM |
      | `img-src blob:` | `GLTFLoader` crée des `blob:` pour les textures embarquées dans le GLB |

      À prévoir également : `img-src` doit inclure `https://plateforme.flambeaux.org` (les avatars
      WordPress passent par un `<img>` HeroUI, pas par `next/image`), `font-src 'self'` suffit
      puisque les polices sont auto-hébergées, et `'unsafe-eval'` est nécessaire **en développement
      uniquement** (Next dev utilise `eval`) — donc CSP conditionné à `NODE_ENV`.

## Maintenance

Ajouter une icône : utiliser un nom existant de la collection Solar
(<https://icon-sets.iconify.design/solar/>), puis `npm run build:icons` — ou simplement `npm run
build`, qui le fait via `prebuild`. Si le nom n'existe pas, le build échoue en nommant le fichier
fautif.

Mettre à jour le modèle 3D : `npm run glb:optimize` continue de produire un GLB compressé en Draco,
décodé par `public/draco/`. Ne pas retirer le second argument de `useGLTF.preload`.
