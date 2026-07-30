/**
 * Round avatar for a chef/référent — photo or initials fallback on a dark-ink fill.
 */
export interface AvatarProps {
  src?: string;
  /** Fallback initials shown when no src, e.g. "JD". */
  initials?: string;
  size?: "sm" | "md" | "lg";
  /** Gold ring, e.g. to mark "needs your review". Default false. */
  ring?: boolean;
}
export function Avatar(props: AvatarProps): JSX.Element;
