import { describe, it, expect } from "vitest";

import { construireCsp, genererNonce } from "@/lib/csp";

function directive(csp: string, nom: string): string | undefined {
  return csp.split("; ").find((valeur) => valeur.startsWith(`${nom} `));
}

describe("construireCsp", () => {
  const production = construireCsp("abc123", false);

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

  it("garde les valeurs imposées par l'admin", () => {
    expect(directive(production, "connect-src")).toBe(
      "connect-src 'self' blob: https://glitchtip.logut.fr",
    );
    expect(directive(production, "report-uri")).toContain(
      "https://glitchtip.logut.fr/api/2/security/",
    );
  });

  it("ajoute unsafe-eval et coupe les rapports en développement", () => {
    const developpement = construireCsp("abc123", true);

    expect(directive(developpement, "script-src")).toContain("'unsafe-eval'");
    expect(directive(developpement, "report-uri")).toBeUndefined();
  });
});

describe("genererNonce", () => {
  it("produit un nonce différent à chaque requête", () => {
    expect(genererNonce()).not.toBe(genererNonce());
  });
});
