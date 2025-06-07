import React from "react";
import { Navbar, NavbarBrand, NavbarContent, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Header: React.FC = () => {
  return (
    <Navbar className="border-b border-divider">
      <NavbarBrand>
        <Icon icon="lucide:flame" className="text-warning text-2xl mr-2" />
        <p className="font-bold text-inherit">Flambeau Progresse</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              color="warning"
              name="Pierre Durand"
              size="sm"
              src="https://img.heroui.chat/image/avatar?w=150&h=150&u=4"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Connecté en tant que</p>
              <p className="font-semibold">pierre.durand@flambeau.fr</p>
            </DropdownItem>
            <DropdownItem key="settings">Paramètres</DropdownItem>
            <DropdownItem key="help_and_feedback">Aide & Support</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Déconnexion
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};