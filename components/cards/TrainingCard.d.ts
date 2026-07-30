/**
 * External-link card for a formation catalog page — image, category tag, title, blurb and duration, the whole card opens an external training resource in a new tab.
 */
export interface TrainingCardProps {
  image?: string;
  /** Small uppercase category label, e.g. "Formation Bois". */
  category?: string;
  title: string;
  description?: string;
  /** e.g. "45 min", "3 séances". */
  duration?: string;
  href?: string;
  /** Opens href in a new tab with rel="noreferrer". Default true. */
  external?: boolean;
}
export function TrainingCard(props: TrainingCardProps): JSX.Element;
