export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      type: "link",
      label: "Tableau de bord",
      href: "/",
      icon: "Home",
    },
    {
      type: "link",
      label: "Mon profil",
      href: "/docs",
      icon: "User",
    },
    {
      type: "accordion",
      label: "Administration",
      icon: "ShieldUp",
      items: [
        { label: "Badges", href: "/admin/badges" },
        { label: "Utilisateurs", href: "/admin/utilisateurs" },
        { label: "Référents", href: "/admin/assignation" },
        { label: "Statistiques", href: "/admin/statistiques" },
      ],
    },
    {
      type: "accordion",
      label: "Référent",
      icon: null,
      items: [
        { label: "Etapes assignés", href: "/referent/badges" },
        { label: "File d’attente", href: "/referent/file" },
        // { label: "Statistiques personnelles", href: "/referent/statistiques" },
      ],
    },
  ],
};