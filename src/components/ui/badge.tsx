import React from "react";
import { cn } from "@heroui/react";

type Couleur =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

const COULEURS: Record<Couleur, string> = {
  default: "bg-foreground/8 text-foreground",
  primary: "bg-primary/15 text-[#c49a0e]",
  secondary: "bg-secondary/15 text-[#a68f00]",
  success: "bg-success/15 text-[#127f51]",
  warning: "bg-warning/15 text-[#a67300]",
  danger: "bg-danger/15 text-[#d24141]",
};

interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  color?: Couleur;
}

export function Badge({
  children,
  className,
  color = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors duration-fast",
        COULEURS[color],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
