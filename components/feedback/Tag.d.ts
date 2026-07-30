/**
 * Small rounded label for categories/filters (e.g. formation category, badge track name) — distinct from StatusPill, which is reserved for completion state.
 */
export interface TagProps {
  children?: React.ReactNode;
  /** Default "neutral". */
  tone?: "neutral" | "brand" | "gold" | "violet";
}
export function Tag(props: TagProps): JSX.Element;
