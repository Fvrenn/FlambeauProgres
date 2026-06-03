import type { KeyboardEvent } from "react";

/**
 * Rend un élément non-interactif (div, li…) activable au clavier ET à la souris.
 * À spread sur l'élément : <li {...clickable(() => doX())}>.
 * Ajoute role="button", tabIndex, onClick et onKeyDown (Entrée + Espace).
 */
export function clickable(onActivate: () => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onActivate();
      }
    },
  };
}
