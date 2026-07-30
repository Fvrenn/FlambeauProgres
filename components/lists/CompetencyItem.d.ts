/**
 * One row in the competency checklist: numbered circle, description, status pill and an action button.
 */
export interface CompetencyItemProps {
  code?: string;
  text: string;
  status?: string;
  tone?: "neutral" | "done";
  last?: boolean;
}
export function CompetencyItem(props: CompetencyItemProps): JSX.Element;
