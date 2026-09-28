import { describe, it, expect } from "vitest";

import { creerCacheMemoire } from "@/lib/cache-memoire";

function horloge(depart = 0) {
  let instant = depart;

  return {
    maintenant: () => instant,
    avancer: (ms: number) => {
      instant += ms;
    },
  };
}

describe("creerCacheMemoire", () => {
  it("rend la valeur tant qu'elle n'a pas expiré", () => {
    const temps = horloge();
    const cache = creerCacheMemoire<string>({
      dureeMs: 1000,
      tailleMax: 10,
      maintenant: temps.maintenant,
    });

    cache.set("a", "valeur");
    temps.avancer(999);

    expect(cache.get("a")).toBe("valeur");
  });

  it("oublie la valeur une fois la durée écoulée", () => {
    const temps = horloge();
    const cache = creerCacheMemoire<string>({
      dureeMs: 1000,
      tailleMax: 10,
      maintenant: temps.maintenant,
    });

    cache.set("a", "valeur");
    temps.avancer(1000);

    expect(cache.get("a")).toBeUndefined();
  });

  it("supprime une entrée à la demande", () => {
    const cache = creerCacheMemoire<string>({ dureeMs: 1000, tailleMax: 10 });

    cache.set("a", "valeur");
    cache.delete("a");

    expect(cache.get("a")).toBeUndefined();
  });

  it("ne dépasse jamais la taille maximum en évinçant la plus ancienne", () => {
    const cache = creerCacheMemoire<number>({ dureeMs: 60_000, tailleMax: 2 });

    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("libère d'abord les entrées expirées avant d'évincer une entrée valide", () => {
    const temps = horloge();
    const cache = creerCacheMemoire<number>({
      dureeMs: 1000,
      tailleMax: 2,
      maintenant: temps.maintenant,
    });

    cache.set("expiree", 1);
    temps.avancer(500);
    cache.set("valide", 2);
    temps.avancer(600);
    cache.set("nouvelle", 3);

    expect(cache.get("valide")).toBe(2);
    expect(cache.get("nouvelle")).toBe(3);
  });
});
