import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildWpLoginUrl,
  buildWpLogoutUrl,
  buildWpProfileUrl,
} from "@/lib/wp-redirect";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildWpLoginUrl", () => {
  it("renvoie vers la page demandée après connexion", () => {
    vi.stubEnv("WORDPRESS_URL", "https://plateforme.flambeaux.org");

    const url = new URL(
      buildWpLoginUrl("https://progres.flambeaux.org/profil"),
    );

    expect(url.origin + url.pathname).toBe(
      "https://plateforme.flambeaux.org/wp-login.php",
    );
    expect(url.searchParams.get("redirect_to")).toBe(
      "https://progres.flambeaux.org/profil",
    );
  });

  it("échoue sans WORDPRESS_URL", () => {
    vi.stubEnv("WORDPRESS_URL", "");
    expect(() => buildWpLoginUrl()).toThrow("WORDPRESS_URL is not set");
  });
});

describe("buildWpLogoutUrl", () => {
  it("déconnecte puis renvoie vers l'accueil de l'app", () => {
    vi.stubEnv("WORDPRESS_URL", "https://plateforme.flambeaux.org");
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org/");

    const url = new URL(buildWpLogoutUrl());

    expect(url.origin + url.pathname).toBe(
      "https://plateforme.flambeaux.org/wp-login.php",
    );
    expect(url.searchParams.get("action")).toBe("logout");
    expect(url.searchParams.get("redirect_to")).toBe(
      "https://progres.flambeaux.org/",
    );
  });

  it("joint le jeton de déconnexion fourni par WordPress", () => {
    vi.stubEnv("WORDPRESS_URL", "https://plateforme.flambeaux.org");
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org/");

    const url = new URL(buildWpLogoutUrl("302984e1dd"));

    expect(url.searchParams.get("_wpnonce")).toBe("302984e1dd");
    expect(url.searchParams.get("action")).toBe("logout");
  });

  it("n'ajoute pas de jeton vide", () => {
    vi.stubEnv("WORDPRESS_URL", "https://plateforme.flambeaux.org");
    vi.stubEnv("APP_URL", "https://progres.flambeaux.org/");

    expect(new URL(buildWpLogoutUrl(null)).searchParams.has("_wpnonce")).toBe(
      false,
    );
  });

  it("échoue sans WORDPRESS_URL", () => {
    vi.stubEnv("WORDPRESS_URL", "");
    expect(() => buildWpLogoutUrl()).toThrow("WORDPRESS_URL is not set");
  });
});

describe("buildWpProfileUrl", () => {
  it("pointe vers le profil WordPress", () => {
    vi.stubEnv("WORDPRESS_URL", "https://plateforme.flambeaux.org");
    expect(buildWpProfileUrl()).toBe(
      "https://plateforme.flambeaux.org/wp-admin/profile.php",
    );
  });
});
