"use client";

import React from "react";
import { cn } from "@heroui/react";

import { Icon } from "@/lib/icons";

type Couleur = "default" | "primary" | "success" | "danger";
type Variante = "solid" | "flat" | "ghost";
type Taille = "sm" | "md";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium select-none cursor-pointer transition-all duration-fast ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap";

const TAILLES: Record<Taille, string> = {
  sm: "text-xs px-3.5 h-8",
  md: "text-sm px-4.5 h-10",
};

const TAILLES_ICONE_SEULE: Record<Taille, string> = {
  sm: "p-0 w-9 h-9",
  md: "p-0 w-10 h-10",
};

const STYLES: Record<Variante, Partial<Record<Couleur, string>>> = {
  solid: {
    default:
      "bg-default text-foreground hover:bg-[#d4d3ca] focus-visible:ring-foreground",
    primary:
      "bg-primary text-foreground hover:bg-[#e5ae1e] focus-visible:ring-primary",
    success:
      "bg-success text-white hover:bg-[#16a267] focus-visible:ring-success",
  },
  flat: {
    default:
      "bg-default/60 text-foreground hover:bg-default focus-visible:ring-foreground",
  },
  ghost: {
    default:
      "bg-transparent text-foreground hover:bg-foreground/8 focus-visible:ring-foreground",
    danger:
      "bg-transparent text-danger hover:bg-danger/15 focus-visible:ring-danger",
  },
};

const TAILLE_ICONE = 18;

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  color?: Couleur;
  variant?: Variante;
  size?: Taille;
  startIcon?: string;
  endIcon?: string;
  isLoading?: boolean;
  isIconOnly?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  color = "default",
  variant = "solid",
  size = "md",
  startIcon,
  endIcon,
  isLoading = false,
  isIconOnly = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE,
        TAILLES[size],
        STYLES[variant][color],
        isIconOnly && TAILLES_ICONE_SEULE[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Icon
          className="animate-spin shrink-0"
          icon="solar:refresh-bold"
          width={TAILLE_ICONE}
        />
      )}
      {!isLoading && startIcon && (
        <Icon className="shrink-0" icon={startIcon} width={TAILLE_ICONE} />
      )}
      {!isIconOnly && <span className="leading-none">{children}</span>}
      {!isLoading && endIcon && (
        <Icon className="shrink-0" icon={endIcon} width={TAILLE_ICONE} />
      )}
    </button>
  );
}
