/**
 * Hexagonal badge tile used to pick a training étape/skill badge from a grid.
 */
export interface BadgeSelectorProps {
  /** Badge artwork URL. */
  image: string;
  selected?: boolean;
  onClick?: () => void;
  label: string;
}
export function BadgeSelector(props: BadgeSelectorProps): JSX.Element;
