import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
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
                  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bouton Sponsor */}
      <div className="mb-6">
        <Button
          isExternal
          as={Link}
          className="w-full text-sm font-normal text-default-600 bg-default-100"
          href={siteConfig.links.sponsor}
          startContent={<HeartFilledIcon className="text-danger" />}
          variant="flat"
        >
          Sponsor
        </Button>
      </div>

      {/* Liens sociaux */}
      <div className="border-t border-divider pt-4">
        <div className="flex items-center justify-center">
          <div className="flex gap-3">
            <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
              <TwitterIcon className="text-default-500 hover:text-default-700 transition-colors" />
            </Link>
            <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
              <DiscordIcon className="text-default-500 hover:text-default-700 transition-colors" />
            </Link>
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500 hover:text-default-700 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
