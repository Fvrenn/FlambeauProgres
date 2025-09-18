import React from "react";
import { User } from "@heroui/react";
import type { User as UserType } from "@/src/types/user";

interface UserCellProps {
  user: UserType;
  isCurrentUser: boolean;
}

export function UserCell({ user, isCurrentUser }: UserCellProps) {
  return (
    <User
      avatarProps={{ radius: "lg", src: user.image || undefined }}
      description={user.email}
      name={user.name}
    >
      {user.name}
      {isCurrentUser && " (Vous)"}
    </User>
  );
}