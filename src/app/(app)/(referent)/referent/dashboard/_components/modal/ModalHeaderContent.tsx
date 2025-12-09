"use client";
import React from "react";
import { User, Divider } from "@heroui/react";
import { User as UserType, Objectif } from "@prisma/client";

interface ModalHeaderContentProps {
  chef: UserType;
  objectif: Objectif;
}

export default function ModalHeaderContent({ chef, objectif }: ModalHeaderContentProps) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* User Info */}
        <div className="flex-shrink-0">
          <User
            avatarProps={{
              src: chef.image || undefined,
              name: chef.name.charAt(0).toUpperCase(),
              size: "md",
            }}
            name={
              <span className="text-base font-semibold text-foreground">
                {chef.name}
              </span>
            }
            description={
              <span className="text-xs text-default-500">{chef.email}</span>
            }
          />
        </div>
        
        <div className="hidden md:block w-px h-10 bg-divider mx-2" />

        {/* Objectif Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold ring-2 ring-primary/20">
                {objectif.code}
             </span>
             <span className="text-xs font-medium text-default-500 uppercase tracking-wider">
               Objectif
             </span>
          </div>
          <p className="text-sm md:text-base font-medium leading-snug line-clamp-2 md:line-clamp-none text-foreground">
            {objectif.description}
          </p>
        </div>
      </div>
      <Divider className="my-1" />
    </div>
  );
}
