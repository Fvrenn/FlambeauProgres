"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Logout2 } from "@solar-icons/react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/icons";
import { useLogout } from "@/lib/logout";
import { Home, User, Dollar, SquareAltArrowRight } from "@solar-icons/react";
import { usePathname } from "next/navigation";
const icons = {
  Home,
  User,
  Dollar,
};

export const Navbar = () => {
  const { handleSignOut } = useLogout();
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-divider p-6 flex flex-col">
      {/* Logo et titre */}
      <div className="flex items-center gap-3 mb-8">
        <NextLink className="flex justify-start items-center gap-2" href="/">
          <Logo />
          <p className="font-bold text-xl text-inherit">ACME</p>
        </NextLink>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-3">
          {siteConfig.navItems.map((item) => {
            const Icon = item.icon
              ? icons[item.icon as keyof typeof icons]
              : null;
            return (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "group flex px-4 py-3.5 rounded-xl hover:bg-medium-black hover:text-white transition-colors font-normal items-center justify-between",
                    pathname === item.href && "bg-light-beige text-black"
                  )}
                  href={item.href}
                  data-active={pathname === item.href}
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon size={20} />}
                    {item.label}
                  </span>

                  <svg
                    width="6"
                    height="10"
                    viewBox="0 0 12 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <path
                      d="M2 2L10 10L2 18"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bouton Déconnexion */}
      <div className="mb-3">
        <Button
          className="w-full text-sm font-normal text-danger bg-danger-50"
          variant="flat"
          onPress={handleSignOut}
        >
          <Logout2 weight="Linear" size={20} color="text-danger" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
};
