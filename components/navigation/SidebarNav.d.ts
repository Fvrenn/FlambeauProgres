/**
 * Primary sidebar navigation list (Tableau de bord / Progression / Formation).
 */
export interface SidebarNavItem { label: string; icon?: React.ReactNode; }
export interface SidebarNavProps {
  items: SidebarNavItem[];
  defaultIndex?: number;
}
export function SidebarNav(props: SidebarNavProps): JSX.Element;
