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

export const Navbar = () => {
  const { handleSignOut } = useLogout();

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
        <ul className="flex flex-col gap-2">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "block px-4 py-3 rounded-lg hover:bg-default-100 transition-colors",
                  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </li>
          ))}
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