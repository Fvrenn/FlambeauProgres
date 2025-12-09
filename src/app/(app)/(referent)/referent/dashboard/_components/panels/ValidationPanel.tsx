"use client";
import React from "react";
import { Avatar, Chip, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Justification, Objectif } from "@prisma/client";

// Reusing types from parent or defining interface locally if simple
// Ideally types should be shared, but for now defining what we need
type ChefInfo = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type ObjectifInfo = {
  id: string;
  code: string;
  description: string;
};

type JustificationAValider = Justification & {
  chef: ChefInfo;
  objectif: ObjectifInfo;
};

interface ValidationPanelProps {
  justifications: JustificationAValider[];
  onJustificationClick: (justification: JustificationAValider) => void;
}

export default function ValidationPanel({ justifications, onJustificationClick }: ValidationPanelProps) {
  if (justifications.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-default-500 text-sm">Rien à valider</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 pr-1 md:pr-2">
      <ul className="space-y-1 md:space-y-2">
        {justifications.map((justification) => (
          <li key={justification.id}>
            <div
              className="py-4 px-3 md:py-6 md:px-5 rounded-md flex flex-col md:flex-row items-start md:items-center cursor-pointer hover:bg-default-100 transition-colors gap-3 md:gap-0"
              onClick={() => onJustificationClick(justification)}
            >
              {/* Row 1 Mobile: Chef + Avatar */}
              <div className="flex items-center gap-3 w-full md:w-1/4">
                <Avatar
                  src={justification.chef.image || undefined}
                  name={justification.chef.name.charAt(0).toUpperCase()}
                  size="sm"
                  className="w-8 h-8 md:w-10 md:h-10 text-tiny md:text-small"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-foreground">
                    {justification.chef.name}
                  </p>
                  <p className="text-[10px] md:text-xs text-default-500 truncate">
                    {justification.chef.email}
                  </p>
                </div>
              </div>

              {/* Row 2 Mobile: Objectif */}
              <div className="flex-1 flex items-center w-full md:w-auto mt-1 md:mt-0">
                <span className="text-sm md:text-xl font-medium text-foreground border border-default-300 bg-white md:bg-transparent py-1 px-2 md:py-3 md:px-2.5 rounded-lg md:rounded-full md:w-12 md:h-12 flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 shadow-sm md:shadow-none">
                  {justification.objectif.code}
                </span>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs md:text-base font-medium text-foreground line-clamp-1">
                    {justification.objectif.description}
                  </p>
                  <p className="text-[10px] md:text-sm text-default-400 block md:hidden">
                    Objectif {justification.objectif.code}
                  </p>
                </div>
              </div>

              {/* Row 3 Mobile: Status & Button */}
              <div className="flex items-center justify-between w-full md:w-auto md:ml-6 mt-1 md:mt-0">
                <Chip
                  size="sm"
                  variant="flat"
                  color="warning"
                  classNames={{
                    base: "h-6 text-[10px] md:text-xs",
                    content: "px-2",
                  }}
                  startContent={<Icon icon="solar:clock-circle-linear" width={12} />}
                >
                  En attente
                </Chip>
                <Button
                  isIconOnly
                  aria-label="Ouvrir"
                  color="default"
                  variant="light"
                  className="bg-transparent data-[hover=true]:bg-default/20 w-8 h-8 md:w-10 md:h-10 min-w-8"
                  onPress={() => onJustificationClick(justification)}
                >
                  <Icon icon="solar:arrow-right-linear" width={20} className="md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
            <div className="px-3 md:px-5">
              <Divider className="bg-default-100" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
