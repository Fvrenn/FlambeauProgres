/**
 * Pill-shaped button, the base action control for the app. Five visual variants share one rounded-full shape family.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Leading glyph, e.g. a small SVG icon. */
  icon?: React.ReactNode;
  /** Trailing glyph (e.g. a chevron or external-link mark). */
  trailingIcon?: React.ReactNode;
  /** Optional short keyboard-shortcut badge shown at the end, e.g. "M" or "S". */
  kbd?: string;
  /** "primary" = ink-900 fill (main CTA). "secondary" = muted cream fill. "outline" = hairline border, transparent fill. "ghost" = no fill/border. "accent" = yellow-highlight fill (matches active-tab pill). Default "primary". */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  /** Default "md". */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}
export function Button(props: ButtonProps): JSX.Element;
