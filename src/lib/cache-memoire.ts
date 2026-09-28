type Entree<V> = { valeur: V; expireA: number };

export type CacheMemoire<V> = {
  get: (cle: string) => V | undefined;
  set: (cle: string, valeur: V) => void;
  delete: (cle: string) => void;
};

export function creerCacheMemoire<V>(options: {
  dureeMs: number;
  tailleMax: number;
  maintenant?: () => number;
}): CacheMemoire<V> {
  const { dureeMs, tailleMax, maintenant = Date.now } = options;
  const entrees = new Map<string, Entree<V>>();

  const retirerExpirees = () => {
    const instant = maintenant();

    for (const [cle, entree] of entrees) {
      if (entree.expireA <= instant) {
        entrees.delete(cle);
      }
    }
  };

  return {
    get(cle) {
      const entree = entrees.get(cle);

      if (!entree) {
        return undefined;
      }

      if (entree.expireA <= maintenant()) {
        entrees.delete(cle);

        return undefined;
      }

      return entree.valeur;
    },

    set(cle, valeur) {
      if (entrees.size >= tailleMax) {
        retirerExpirees();
      }

      if (entrees.size >= tailleMax) {
        const plusAncienne = entrees.keys().next().value;

        if (plusAncienne !== undefined) {
          entrees.delete(plusAncienne);
        }
      }

      entrees.set(cle, { valeur, expireA: maintenant() + dureeMs });
    },

    delete(cle) {
      entrees.delete(cle);
    },
  };
}
