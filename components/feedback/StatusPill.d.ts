/**
 * Small rounded status label used at the end of a competency row.
 */
export interface StatusPillProps {
  children?: React.ReactNode;
  /** "neutral" = translucent cream / violet text ("Non fait"). "done" = yellow fill for completed items. */
  tone?: "neutral" | "done";
}
export function StatusPill(props: StatusPillProps): JSX.Element;
