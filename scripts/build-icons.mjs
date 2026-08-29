import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const collection = require("@iconify-json/solar/icons.json");

const PREFIX = "solar";
const SOURCE_DIR = "src";
const OUTPUT = "src/lib/icons.generated.ts";
const PATTERN = new RegExp(`["'\`]${PREFIX}:([a-z0-9]+(?:-[a-z0-9]+)*)["'\`]`, "g");

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.tsx?$/.test(entry.name)) return [];
    if (full === OUTPUT) return [];

    return [full];
  });
}

const utilises = new Map();

for (const file of sourceFiles(SOURCE_DIR)) {
  const contenu = fs.readFileSync(file, "utf8");

  for (const match of contenu.matchAll(PATTERN)) {
    const nom = match[1];

    if (!utilises.has(nom)) utilises.set(nom, new Set());
    utilises.get(nom).add(file);
  }
}

const sousEnsemble = {
  prefix: collection.prefix,
  icons: {},
  aliases: {},
  width: collection.width,
  height: collection.height,
};
const inconnues = [];

for (const nom of [...utilises.keys()].sort()) {
  if (collection.icons[nom]) {
    sousEnsemble.icons[nom] = collection.icons[nom];
    continue;
  }

  let courant = nom;
  const chaine = [];

  while (collection.aliases?.[courant]) {
    chaine.push(courant);
    courant = collection.aliases[courant].parent;
  }

  if (chaine.length === 0 || !collection.icons[courant]) {
    inconnues.push(nom);
    continue;
  }

  for (const alias of chaine) sousEnsemble.aliases[alias] = collection.aliases[alias];
  sousEnsemble.icons[courant] = collection.icons[courant];
}

if (inconnues.length > 0) {
  console.error(
    `\n✗ ${inconnues.length} icône(s) absente(s) de la collection "${PREFIX}" :\n`,
  );

  for (const nom of inconnues) {
    console.error(`  ${PREFIX}:${nom}`);
    for (const file of utilises.get(nom)) console.error(`      ${file}`);
  }

  console.error(
    `\nCorrigez le nom ou choisissez une icône existante : https://icon-sets.iconify.design/${PREFIX}/\n`,
  );
  process.exit(1);
}

const entete = `// Généré par scripts/build-icons.mjs — ne pas modifier à la main.
// Sous-ensemble de @iconify-json/solar limité aux icônes réellement utilisées.
// Régénérer avec : npm run build:icons

import type { IconifyJSON } from "@iconify/types";

export const solarIcons: IconifyJSON = `;

fs.writeFileSync(OUTPUT, `${entete}${JSON.stringify(sousEnsemble, null, 2)};\n`);
execFileSync("npx", ["prettier", "--write", OUTPUT], { stdio: "ignore" });

const poids = fs.statSync(OUTPUT).size;
const nbAlias = Object.keys(sousEnsemble.aliases).length;

console.log(
  `✓ ${utilises.size} icônes (${Object.keys(sousEnsemble.icons).length} définitions + ${nbAlias} alias) → ${OUTPUT} (${(poids / 1024).toFixed(1)} Ko)`,
);
