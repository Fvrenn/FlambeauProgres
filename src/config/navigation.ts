import type { SessionUser } from "@/types";
import type {
  SidebarItem,
  SidebarNavItemClassNames,
} from "@/components/application/sidebar/sidebar";

export const chefSidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    href: "/",
    icon: "solar:home-2-linear",
    title: "Tableau de bord",
  },
  {
    key: "progression",
    href: "/progression",
    icon: "solar:chart-2-linear",
    title: "Progression",
  },
  {
    key: "formation",
    href: "/formation",
    icon: "solar:book-bookmark-linear",
    title: "Formation",
  },
];

export function referentSidebarItems(user: SessionUser): SidebarItem[] {
  const premiereEtape = user.etapesReferent?.[0];

  return [
    {
      key: "referent",
      href: premiereEtape
        ? `/referent/dashboard?etapeId=${premiereEtape.id}`
        : "/referent/dashboard",
      icon: "solar:checklist-minimalistic-linear",
      title: "Justifications à valider",
    },
    {
      key: "analyse",
      href: "/referent/analyse",
      icon: "solar:chart-square-linear",
      title: "Analyse",
    },
  ];
}

export const adminSidebarItems: SidebarItem[] = [
  {
    key: "admin-dashboard",
    href: "/admin/dashboard",
    icon: "solar:home-2-linear",
    title: "Tableau de bord",
  },
  {
    key: "admin-users",
    href: "/admin/users",
    icon: "solar:user-linear",
    title: "Utilisateurs",
  },
  {
    key: "admin-etapes",
    href: "/admin/etapes",
    icon: "solar:flag-linear",
    title: "Etapes",
  },
  {
    key: "admin-assignations",
    href: "/admin/assignations",
    icon: "solar:link-linear",
    title: "Assignations",
  },
  {
    key: "admin-formations",
    href: "/admin/formations",
    icon: "solar:book-bookmark-linear",
    title: "Formation",
  },
];

export function allSidebarItemsForUser(user: SessionUser): SidebarItem[] {
  const isReferent = user.role === "REFERENT" || user.role === "ADMIN";
  const isAdmin = user.role === "ADMIN";

  if (!isReferent && !isAdmin) {
    return chefSidebarItems;
  }

  const sections: SidebarItem[] = [
    { key: "section-chef", title: "Mon progrès", items: chefSidebarItems },
  ];

  if (isReferent) {
    sections.push({
      key: "section-referent",
      title: "Référent",
      items: referentSidebarItems(user),
    });
  }

  if (isAdmin) {
    sections.push({
      key: "section-admin",
      title: "Administration",
      items: adminSidebarItems,
    });
  }

  return sections;
}

export const appShellClassNames: {
  contextSwitcherClassName: string;
  mainClassName: string;
  navItemClassNames: SidebarNavItemClassNames;
  sidebarClassName: string;
} = {
  contextSwitcherClassName: "bg-dashboard-card",
  mainClassName: "bg-dashboard",
  navItemClassNames: {
    base: "data-[selected=true]:bg-nav-active data-[selected=true]:data-[hover=true]:bg-nav-hover data-[focus=true]:!bg-transparent data-[selected=true]:data-[focus=true]:!bg-nav-active",
    title:
      "text-small font-medium text-default-500 group-data-[selected=true]:text-white",
    icon: "text-default-500 group-data-[selected=true]:text-white",
  },
  sidebarClassName: "bg-sidebar border-r border-r-dashboard-border",
};
