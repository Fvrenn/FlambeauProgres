const DEBUT_DE_FORMULE = /^[=+\-@\t\r]/;

export function tableauCsv(entetes: string[], lignes: string[][]): string {
  return [entetes, ...lignes]
    .map((ligne) => ligne.map(celluleCsv).join(";"))
    .join("\r\n");
}

export function telechargerCsv(contenu: string, nomFichier: string): void {
  const blob = new Blob(["﻿", contenu], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");

  lien.href = url;
  lien.download = nomFichier;
  lien.click();
  URL.revokeObjectURL(url);
}

function celluleCsv(valeur: string): string {
  const texte = DEBUT_DE_FORMULE.test(valeur) ? `'${valeur}` : valeur;

  return `"${texte.replace(/"/g, '""')}"`;
}
