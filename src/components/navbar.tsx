"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Logout2 } from "@solar-icons/react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/src/components/icons";
import { useLogout } from "@/src/lib/logout";
import {
  Home,
  User,
  Dollar,
  SquareAltArrowRight,
  ShieldUp,
} from "@solar-icons/react";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@heroui/react";
const icons = {
  Home,
  User,
  Dollar,
  ShieldUp,
};

type NavbarProps = {
  isAdmin?: boolean;
  isReferent?: boolean;
};

export const Navbar = ({ isAdmin, isReferent }: NavbarProps) => {
  const filteredNavItems = siteConfig.navItems.filter((item) => {
    if (item.type === "accordion" && item.label === "Administration") {
      return isAdmin;
    }
    if (item.type === "accordion" && item.label === "Référent") {
      return isReferent || isAdmin;
    }
    return true;
  });
  const { handleSignOut } = useLogout();
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-background border-r border-divider p-6 flex flex-col">
      {/* Logo et titre */}
      <div className="flex items-center gap-3 mb-8">
        <NextLink className="flex justify-start items-center gap-2" href="/">
          <Logo />
          <p className=" text-2xl text-inherit leading-7 font-medium mt-2">
            <span className="text-[#E06511]">Flambeaux </span>
            <br /> <span className="text-[#542C11]">Progres</span>
          </p>
        </NextLink>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-3">
          {filteredNavItems.map((item) => {
            if (item.type === "link" && item.href) {
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
                    href={item.href as string}
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
            }
            return null;
          })}
        </ul>
        <div className="my-4">
          <Accordion variant="splitted" className="px-0">
            {filteredNavItems
              .filter((item) => item.type === "accordion")
              .map((item) => {
                const Icon = item.icon
                  ? icons[item.icon as keyof typeof icons]
                  : null;
                return (
                  <AccordionItem
                    key={item.label}
                    aria-label={item.label}
                    title={
                      <span className="flex items-center gap-2">
                        {Icon && <Icon size={20} />}
                        {item.label}
                      </span>
                    }
                    className="shadow-none text-black bg-transparent transition-all duration-200 data-[open=true]:bg-light-beige data-[open=true]:rounded-[25px]"
                  >
                    <ul className="flex flex-col pl-2">
                      {item.items?.map((subItem) =>
                        subItem.href ? (
                          <NextLink
                            key={subItem.href}
                            className="group flex items-center justify-between px-4 py-3 rounded-full hover:bg-medium-black hover:text-white transition-colors"
                            href={subItem.href}
                          >
                            <span className="flex items-center gap-2">
                              {subItem.label}
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
                        ) : null
                      )}
                    </ul>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
      </nav>

      {/* Accordéon navigation avancée */}

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
