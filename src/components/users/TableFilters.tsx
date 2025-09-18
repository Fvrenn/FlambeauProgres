import { Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ROLE_OPTIONS } from "./constants";
import type { Selection } from "@heroui/react";

// Icônes simples
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

interface TableFiltersProps {
  searchValue: string;
  roleFilter: Selection;
  totalUsers: number;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (selection: Selection) => void;
  onClear: () => void;
  onAddUser?: () => void;
}

export function TableFilters({
  searchValue,
  roleFilter,
  totalUsers,
  onSearchChange,
  onRoleFilterChange,
  onClear,
  onAddUser,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Rechercher par nom ou email..."
          startContent={<SearchIcon />}
          value={searchValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon />}
                variant="flat"
              >
                Rôle
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtrer par rôle"
              closeOnSelect={false}
              selectedKeys={roleFilter}
              selectionMode="multiple"
              onSelectionChange={onRoleFilterChange}
            >
              {ROLE_OPTIONS.map((role) => (
                <DropdownItem key={role.uid} className="capitalize">
                  {role.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            className="bg-medium-black text-white"
            endContent={<PlusIcon />}
            onPress={onAddUser}
          >
            Ajouter utilisateur
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {totalUsers} utilisateurs
        </span>
      </div>
    </div>
  );
}