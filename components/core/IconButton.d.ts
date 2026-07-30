/**
 * Small square glyph button used for row actions and menu toggles.
 */
export interface IconButtonProps {
  children?: React.ReactNode;
  /** Visual state when the button represents the current/selected action. */
  active?: boolean;
  /** Square size in px. Default 40. */
  size?: number;
  onClick?: () => void;
  "aria-label"?: string;
}
export function IconButton(props: IconButtonProps): JSX.Element;
