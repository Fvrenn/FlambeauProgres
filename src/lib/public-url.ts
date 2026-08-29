export const FORWARDED_HOST_HEADER = "x-forwarded-host";
export const FORWARDED_PROTO_HEADER = "x-forwarded-proto";

const APP_URL_PAR_DEFAUT = "http://localhost:3000";
const HOTE_VALIDE = /^[a-z0-9.-]+(:\d{1,5})?$/i;

type LecteurEntetes = { get(name: string): string | null };

function premiereValeur(valeur: string | null): string | null {
  const premier = valeur?.split(",")[0]?.trim();

  return premier ? premier : null;
}

export function origineConfiguree(): string | null {
  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    return null;
  }

  try {
    return new URL(appUrl).origin;
  } catch {
    return null;
  }
}

export function origineTransmise(entetes: LecteurEntetes): string | null {
  const hote = premiereValeur(entetes.get(FORWARDED_HOST_HEADER));

  if (!hote || !HOTE_VALIDE.test(hote)) {
    return null;
  }

  const protocole = premiereValeur(entetes.get(FORWARDED_PROTO_HEADER));

  if (protocole && protocole !== "http" && protocole !== "https") {
    return null;
  }

  return `${protocole ?? "https"}://${hote}`;
}

export function originePublique(entetes: LecteurEntetes): string | null {
  return origineConfiguree() ?? origineTransmise(entetes);
}

export function urlPublique(url: URL, entetes: LecteurEntetes): string {
  const origine = originePublique(entetes);

  if (!origine) {
    return url.toString();
  }

  return `${origine}${url.pathname}${url.search}`;
}

export function verifierConfigurationUrl(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const appUrl = process.env.APP_URL?.trim();

  if (!appUrl) {
    throw new Error(
      "APP_URL est obligatoire en production : sans elle, les liens des emails pointeraient vers localhost et le retour vers wp-login.php vers l'adresse d'écoute interne. Exemple : APP_URL=https://progres.flambeaux.org",
    );
  }

  if (!origineConfiguree()) {
    throw new Error(
      `APP_URL n'est pas une URL absolue valide : "${appUrl}". Exemple attendu : https://progres.flambeaux.org`,
    );
  }
}

export function origineApplication(): string {
  const origine = origineConfiguree();

  if (origine) {
    return origine;
  }

  verifierConfigurationUrl();

  return APP_URL_PAR_DEFAUT;
}
