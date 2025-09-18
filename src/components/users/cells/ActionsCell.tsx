import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { TrashBinTrash, Eye, Pen2 } from "@solar-icons/react";

const VerticalDotsIcon = () => (
  <svg 
    aria-hidden="true" 
    fill="none" 
    focusable="false" 
    height="24" 
    role="presentation" 
    viewBox="0 0 24 24" 
    width="24"
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

interface ActionsCellProps {
  userId: string;
  isCurrentUser: boolean;
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function ActionsCell({ userId, isCurrentUser, onView, onEdit, onDelete }: ActionsCellProps) {
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDotsIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="view" onPress={() => onView?.(userId)}>
            <div className="flex items-center gap-2">
              <Eye weight="Linear" size={16} />
              Voir détails
            </div>
          </DropdownItem>
          <DropdownItem key="edit" onPress={() => onEdit?.(userId)}>
            <div className="flex items-center gap-2">
              <Pen2 weight="Linear" size={16} />
              Modifier
            </div>
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            isDisabled={isCurrentUser}
            onPress={() => onDelete?.(userId)}
          >
            <div className="flex items-center gap-2">
              <TrashBinTrash weight="Linear" size={16} />
              Supprimer
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}