import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from "@heroui/react";
import { AltArrowDown } from "@solar-icons/react";
import { ROLE_OPTIONS, ROLE_COLOR_MAP } from "../constants";
import type { User as UserType } from "@/src/types/user";

interface RoleCellProps {
  user: UserType;
  isCurrentUser: boolean;
  onRoleChange: (userId: string, newRole: "ADMIN" | "CHEF" | "REFERENT") => void;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export function RoleCell({ user, isCurrentUser, onRoleChange }: RoleCellProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Chip
          className={`capitalize ${isCurrentUser ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          endContent={!isCurrentUser && <AltArrowDown weight="Outline" size={14} />}
          color={ROLE_COLOR_MAP[user.role]}
          size="sm"
          variant="flat"
        >
          {capitalize(user.role)}
        </Chip>
      </DropdownTrigger>
      {!isCurrentUser && (
        <DropdownMenu
          aria-label="Changer le rôle"
          selectionMode="single"
          selectedKeys={new Set([user.role])}
          onSelectionChange={(keys) => {
            const newRole = Array.from(keys)[0] as "ADMIN" | "CHEF" | "REFERENT";
            if (newRole && newRole !== user.role) {
              onRoleChange(user.id, newRole);
            }
          }}
        >
          {ROLE_OPTIONS.map((role) => (
            <DropdownItem key={role.uid} className="capitalize">
              {role.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Dropdown>
  );
}