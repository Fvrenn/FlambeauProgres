import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
} from "@heroui/react";
import Image from "next/image";

type MobileNavbarProps = {
  isMenuOpen: boolean;
  onMenuOpenChange: (isOpen: boolean) => void;
};

export const MobileNavbar = ({
  isMenuOpen,
  onMenuOpenChange,
}: MobileNavbarProps) => {
  return (
    <Navbar
      isBordered
      className="md:hidden"
      isMenuOpen={isMenuOpen}
      maxWidth="full"
      onMenuOpenChange={onMenuOpenChange}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand className="gap-2">
          <Image
            alt="Flambeau Progrès Logo"
            className="rounded-full"
            height={43}
            src="/logo/logo-flambeau-progres.svg"
            width={32}
          />
          <span className="text-lg font-medium text-[#E06511] leading-7">
            Flambeau <span className="text-[#542C11]">Progrès</span>
          </span>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
};
