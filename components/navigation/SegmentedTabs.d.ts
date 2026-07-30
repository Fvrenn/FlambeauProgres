/**
 * Pill-shaped segmented control used to switch between two sub-views (e.g. Objectif / Notifications, Compétences / Réalisations).
 */
export interface SegmentedTabsProps {
  tabs: string[];
  defaultIndex?: number;
  /** "inverse" = dark track with white active pill (page header). "light" = cream track with yellow active pill (panel header). Default "inverse". */
  variant?: "inverse" | "light";
}
export function SegmentedTabs(props: SegmentedTabsProps): JSX.Element;
