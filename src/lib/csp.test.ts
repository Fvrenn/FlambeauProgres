import { describe, it, expect } from "vitest";

import { construireCsp, genererNonce } from "@/lib/csp";

function directive(csp: string, nom: string): string | undefined {
  return csp.split("; ").find((valeur) => valeur.startsWith(`${nom} `));
}

describe("construireCsp", () => {
  const URL_RAPPORTS =
    "https://glitchtip.logut.fr/api/3/security/?glitchtip_key=cle";
  const production = construireCsp({
    nonce: "abc123",
    estDeveloppement: false,
    urlRapports: URL_RAPPORTS,
  });

  it("n'autorise que les scripts portant le nonce de la requête", () => {
    const scripts = directive(production, "script-src");

    expect(scripts).toContain("'nonce-abc123'");
    expect(scripts).toContain("'strict-dynamic'");
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(scripts).not.toContain("'unsafe-eval'");
  });

  it("autorise le WASM et les workers blob du décodeur Draco", () => {
    expect(directive(production, "script-src")).toContain("'wasm-unsafe-eval'");
    expect(directive(production, "worker-src")).toBe("worker-src 'self' blob:");
  });

  it("envoie les rapports à l'adresse configurée et autorise son domaine", () => {
    expect(directive(production, "report-uri")).toBe(
      `report-uri ${URL_RAPPORTS}`,
    );
    expect(directive(production, "connect-src")).toBe(
      "connect-src 'self' blob: https://glitchtip.logut.fr",
    );
  });

  it("n'envoie aucun rapport quand l'adresse n'est pas configurée", () => {
    const sansRapports = construireCsp({
      nonce: "abc123",
      estDeveloppement: false,
    });

    expect(directive(sansRapports, "report-uri")).toBeUndefined();
    expect(directive(sansRapports, "connect-src")).toBe(
      "connect-src 'self' blob:",
    );
  });

  it("ajoute unsafe-eval et coupe les rapports en développement", () => {
    const developpement = construireCsp({
      nonce: "abc123",
      estDeveloppement: true,
      urlRapports: URL_RAPPORTS,
    });

    expect(directive(developpement, "script-src")).toContain("'unsafe-eval'");
    expect(directive(developpement, "report-uri")).toBeUndefined();
  });
});

describe("genererNonce", () => {
  it("produit un nonce différent à chaque requête", () => {
    expect(genererNonce()).not.toBe(genererNonce());
  });
});
