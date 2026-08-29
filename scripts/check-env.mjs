const erreurs = [];

function urlAbsolue(nom, valeur, exemple) {
  if (!valeur) {
    erreurs.push(`${nom} n'est pas définie. Exemple : ${nom}=${exemple}`);

    return;
  }

  try {
    new URL(valeur);
  } catch {
    erreurs.push(
      `${nom} n'est pas une URL absolue valide : "${valeur}". Exemple : ${nom}=${exemple}`,
    );
  }
}

urlAbsolue(
  "APP_URL",
  process.env.APP_URL?.trim(),
  "https://progres.flambeaux.org",
);
urlAbsolue(
  "WORDPRESS_URL",
  process.env.WORDPRESS_URL?.trim(),
  "https://plateforme.flambeaux.org",
);

if (erreurs.length > 0) {
  console.error("\nDémarrage interrompu, configuration incomplète :\n");

  for (const erreur of erreurs) {
    console.error(`  - ${erreur}`);
  }

  console.error(
    "\nAPP_URL doit être l'URL publique vue par le navigateur, jamais l'adresse d'écoute interne du conteneur.\n",
  );
  process.exit(1);
}
