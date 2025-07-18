export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Tableau de bord",
      href: "/",
      icon: "Home",
    },
    {
      label: "Mon profil",
      href: "/docs",
      icon: "User",
    }
  ],
};