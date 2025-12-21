"use client";

import React from "react";
import { User } from "@heroui/react";
import { type Justification, type User as UserType, type Objectif } from "@prisma/client";
import JustificationsTableActions from "./JustificationsTableActions";


export type JustificationAvecRelations = Justification & {
  chef: UserType;
  objectif: Objectif;
};


export const columns = [
  { key: "chef", name: "Chef" },
  { key: "objectif", name: "Objectif" },
  { key: "soumiseAt", name: "Date de soumission" },
  { key: "actions", name: "Actions" },
];


export const renderCell = (
  justification: JustificationAvecRelations,
  columnKey: React.Key
) => {
  switch (columnKey) {
    case "chef":
      return (
        <User
          avatarProps={{
            src: justification.chef.image || undefined,
            name: justification.chef.name.charAt(0).toUpperCase(),
          }}
          name={justification.chef.name}
          description={justification.chef.email}
        />
      );
    case "objectif":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">{justification.objectif.code}</p>
          <p className="text-bold text-sm text-default-400">
            {justification.objectif.description.substring(0, 50)}...
          </p>
        </div>
      );
    case "soumiseAt":
        
        return justification.soumiseAt 
            ? new Date(justification.soumiseAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "N/A";
    case "actions":
      return <JustificationsTableActions justification={justification} />;
    default:
      // @ts-ignore
      return justification[columnKey] || null;
  }
};