/**
 * Sidebar role/context switcher shown above the main nav (e.g. "Admin" / "Mon Progrès (Chef)").
 */
export interface RoleMenuProps {
  role?: string;
  context?: string;
}
export function RoleMenu(props: RoleMenuProps): JSX.Element;
