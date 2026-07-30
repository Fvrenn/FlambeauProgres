/**
 * Linear progress indicator for a chef's étape/badge advancement (e.g. "4/7 compétences").
 */
export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  /** Show the "NN%" value at the end of the label row. Default true. */
  showValue?: boolean;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
