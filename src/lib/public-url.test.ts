import { afterEach, describe, expect, it, vi } from "vitest";

import {
  origineApplication,
  origineConfiguree,
  origineTransmise,
  urlPublique,
  verifierConfigurationUrl,
} from "@/lib/public-url";

const entetes = (valeurs: Record<string, string>) => ({
  get: (name: string) => valeurs[name.toLowerCase()] ?? null,
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("origineConfiguree", () => {
  it("normalise APP_URL en origine", () => {
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org/");
    expect(origineConfiguree()).toBe("https://progres.flambeaux.org");
  });

  it("ignore une APP_URL vide ou invalide", () => {
    vi.stubEnv("APP_URL", "   ");
    expect(origineConfiguree()).toBeNull();
    vi.stubEnv("APP_URL", "pas-une-url");
    expect(origineConfiguree()).toBeNull();
  });
});

describe("origineTransmise", () => {
  it("lit x-forwarded-host et x-forwarded-proto", () => {
    expect(
      origineTransmise(
        entetes({
          "x-forwarded-host": "progres.flambeaux.org",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toBe("https://progres.flambeaux.org");
  });

  it("prend la premiere valeur d'une chaine de proxies", () => {
    expect(
      origineTransmise(
        entetes({
          "x-forwarded-host": "progres.flambeaux.org, interne.local",
          "x-forwarded-proto": "https, http",
        }),
      ),
    ).toBe("https://progres.flambeaux.org");
  });

  it("suppose https quand le protocole est absent", () => {
    expect(
      origineTransmise(
        entetes({ "x-forwarded-host": "progres.flambeaux.org" }),
      ),
    ).toBe("https://progres.flambeaux.org");
  });

  it("rejette un hote malforme", () => {
    expect(
      origineTransmise(entetes({ "x-forwarded-host": "evil.test/../path" })),
    ).toBeNull();
    expect(
      origineTransmise(entetes({ "x-forwarded-host": "hote avec espace" })),
    ).toBeNull();
  });

  it("rejette un protocole inattendu", () => {
    expect(
      origineTransmise(
        entetes({
          "x-forwarded-host": "progres.flambeaux.org",
          "x-forwarded-proto": "javascript",
        }),
      ),
    ).toBeNull();
  });

  it("renvoie null sans en-tete", () => {
    expect(origineTransmise(entetes({}))).toBeNull();
  });
});

describe("urlPublique", () => {
  it("remplace l'adresse d'ecoute interne par APP_URL", () => {
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org");

    expect(urlPublique(new URL("https://0.0.0.0:8032/"), entetes({}))).toBe(
      "https://progres.flambeaux.org/",
    );
  });

  it("conserve le chemin et la query string", () => {
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org");

    expect(
      urlPublique(
        new URL("https://0.0.0.0:8032/referent/dashboard?etapeId=abc&x=1"),
        entetes({}),
      ),
    ).toBe("https://progres.flambeaux.org/referent/dashboard?etapeId=abc&x=1");
  });

  it("retombe sur les en-tetes du proxy sans APP_URL", () => {
    vi.stubEnv("APP_URL", "");

    expect(
      urlPublique(
        new URL("http://0.0.0.0:8032/progression"),
        entetes({
          "x-forwarded-host": "progres.flambeaux.org",
          "x-forwarded-proto": "https",
        }),
      ),
    ).toBe("https://progres.flambeaux.org/progression");
  });

  it("fait primer APP_URL sur les en-tetes", () => {
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org");

    expect(
      urlPublique(
        new URL("http://0.0.0.0:8032/"),
        entetes({ "x-forwarded-host": "usurpateur.test" }),
      ),
    ).toBe("https://progres.flambeaux.org/");
  });

  it("laisse l'URL intacte sans APP_URL ni en-tete", () => {
    vi.stubEnv("APP_URL", "");

    expect(urlPublique(new URL("http://localhost:3000/x"), entetes({}))).toBe(
      "http://localhost:3000/x",
    );
  });
});

describe("origineApplication", () => {
  it("retombe sur localhost sans APP_URL hors production", () => {
    vi.stubEnv("APP_URL", "");
    expect(origineApplication()).toBe("http://localhost:3000");
  });

  it("refuse de fabriquer un lien localhost en production", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => origineApplication()).toThrow(/APP_URL est obligatoire/);
  });
});

describe("verifierConfigurationUrl", () => {
  it("ne dit rien hors production", () => {
    vi.stubEnv("APP_URL", "");
    expect(() => verifierConfigurationUrl()).not.toThrow();
  });

  it("echoue en production sans APP_URL", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => verifierConfigurationUrl()).toThrow(/APP_URL est obligatoire/);
  });

  it("echoue en production sur une APP_URL malformee", () => {
    vi.stubEnv("APP_URL", "progres.flambeaux.org");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => verifierConfigurationUrl()).toThrow(/URL absolue valide/);
  });

  it("accepte une APP_URL valide en production", () => {
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => verifierConfigurationUrl()).not.toThrow();
  });
});
