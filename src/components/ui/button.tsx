"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

// ─────────────────────────────────────────────
//  Définition des variantes avec tailwind-variants
// ─────────────────────────────────────────────
export const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-full",
    "font-medium select-none",
    "transition-all duration-fast ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.97]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "whitespace-nowrap",
  ],

  variants: {
    // ── Couleur ──────────────────────────────
    color: {
      primary:   "",
      secondary: "",
      success:   "",
      warning:   "",
      danger:    "",
      default:   "",
    },

    // ── Style visuel ─────────────────────────
    variant: {
      solid:   "",
      flat:    "",
      outline: "border bg-transparent",
      ghost:   "bg-transparent",
      link:    "bg-transparent underline-offset-4 hover:underline p-0 h-auto",
    },

    // ── Taille ───────────────────────────────
    size: {
      xs:  "text-xs px-2.5 py-1.5 h-7",
      sm:  "text-xs px-3.5  py-0   h-8",
      md:  "text-sm px-4.5  py-0   h-10",
      lg:  "text-base px-6   py-0   h-12",
      xl:  "text-lg  px-7   py-0   h-14",
    },

    // ── Forme ────────────────────────────────
    rounded: {
      none:  "!rounded-none",
      sm:    "!rounded-sm",
      md:    "!rounded-md",
      lg:    "!rounded-lg",
      xl:    "!rounded-xl",
      full:  "!rounded-full",
    },

    // ── Largeur totale ────────────────────────
    fullWidth: {
      true: "w-full",
    },

    // ── Icône seule (carré) ───────────────────
    isIconOnly: {
      true: "p-0",
    },
  },

  // ── Variantes composées (color × variant) ──
  compoundVariants: [
    // ─ SOLID ──────────────────────────────────
    {
      color: "primary",
      variant: "solid",
      class:
        "bg-[#FCC226] text-[#0f1511] hover:bg-[#e5ae1e] focus-visible:ring-[#FCC226]",
    },
    {
      color: "secondary",
      variant: "solid",
      class:
        "bg-[#ffdc00] text-[#0f1511] hover:bg-[#e5c800] focus-visible:ring-[#ffdc00]",
    },
    {
      color: "success",
      variant: "solid",
      class:
        "bg-[#1bc47d] text-white hover:bg-[#16a267] focus-visible:ring-[#1bc47d]",
    },
    {
      color: "warning",
      variant: "solid",
      class:
        "bg-[#ffb100] text-[#0f1511] hover:bg-[#d29200] focus-visible:ring-[#ffb100]",
    },
    {
      color: "danger",
      variant: "solid",
      class:
        "bg-[#ff4f4f] text-white hover:bg-[#d24141] focus-visible:ring-[#ff4f4f]",
    },
    {
      color: "default",
      variant: "solid",
      class:
        "bg-[#E8E7DE] text-[#0f1511] hover:bg-[#d4d3ca] focus-visible:ring-[#0f1511]",
    },

    // ─ FLAT ───────────────────────────────────
    {
      color: "primary",
      variant: "flat",
      class:
        "bg-[#FCC226]/15 text-[#c49a0e] hover:bg-[#FCC226]/25 focus-visible:ring-[#FCC226]",
    },
    {
      color: "secondary",
      variant: "flat",
      class:
        "bg-[#ffdc00]/15 text-[#a68f00] hover:bg-[#ffdc00]/25 focus-visible:ring-[#ffdc00]",
    },
    {
      color: "success",
      variant: "flat",
      class:
        "bg-[#1bc47d]/15 text-[#127f51] hover:bg-[#1bc47d]/25 focus-visible:ring-[#1bc47d]",
    },
    {
      color: "warning",
      variant: "flat",
      class:
        "bg-[#ffb100]/15 text-[#a67300] hover:bg-[#ffb100]/25 focus-visible:ring-[#ffb100]",
    },
    {
      color: "danger",
      variant: "flat",
      class:
        "bg-[#ff4f4f]/15 text-[#d24141] hover:bg-[#ff4f4f]/25 focus-visible:ring-[#ff4f4f]",
    },
    {
      color: "default",
      variant: "flat",
      class:
        "bg-[#E8E7DE]/60 text-[#0f1511] hover:bg-[#E8E7DE] focus-visible:ring-[#0f1511]",
    },

    // ─ OUTLINE ────────────────────────────────
    {
      color: "primary",
      variant: "outline",
      class:
        "border-[#FCC226] text-[#c49a0e] hover:bg-[#FCC226]/10 focus-visible:ring-[#FCC226]",
    },
    {
      color: "secondary",
      variant: "outline",
      class:
        "border-[#ffdc00] text-[#a68f00] hover:bg-[#ffdc00]/10 focus-visible:ring-[#ffdc00]",
    },
    {
      color: "success",
      variant: "outline",
      class:
        "border-[#1bc47d] text-[#1bc47d] hover:bg-[#1bc47d]/10 focus-visible:ring-[#1bc47d]",
    },
    {
      color: "warning",
      variant: "outline",
      class:
        "border-[#ffb100] text-[#ffb100] hover:bg-[#ffb100]/10 focus-visible:ring-[#ffb100]",
    },
    {
      color: "danger",
      variant: "outline",
      class:
        "border-[#ff4f4f] text-[#ff4f4f] hover:bg-[#ff4f4f]/10 focus-visible:ring-[#ff4f4f]",
    },
    {
      color: "default",
      variant: "outline",
      class:
        "border-[#0f1511]/20 text-[#0f1511] hover:bg-[#0f1511]/5 focus-visible:ring-[#0f1511]",
    },

    // ─ GHOST ──────────────────────────────────
    {
      color: "primary",
      variant: "ghost",
      class: "text-[#c49a0e] hover:bg-[#FCC226]/15 focus-visible:ring-[#FCC226]",
    },
    {
      color: "secondary",
      variant: "ghost",
      class: "text-[#a68f00] hover:bg-[#ffdc00]/15 focus-visible:ring-[#ffdc00]",
    },
    {
      color: "success",
      variant: "ghost",
      class: "text-[#1bc47d] hover:bg-[#1bc47d]/15 focus-visible:ring-[#1bc47d]",
    },
    {
      color: "warning",
      variant: "ghost",
      class: "text-[#ffb100] hover:bg-[#ffb100]/15 focus-visible:ring-[#ffb100]",
    },
    {
      color: "danger",
      variant: "ghost",
      class: "text-[#ff4f4f] hover:bg-[#ff4f4f]/15 focus-visible:ring-[#ff4f4f]",
    },
    {
      color: "default",
      variant: "ghost",
      class: "text-[#0f1511] hover:bg-[#0f1511]/8 focus-visible:ring-[#0f1511]",
    },

    // ─ LINK ───────────────────────────────────
    {
      color: "primary",
      variant: "link",
      class: "text-[#c49a0e] hover:text-[#FCC226]",
    },
    {
      color: "success",
      variant: "link",
      class: "text-[#1bc47d] hover:text-[#16a267]",
    },
    {
      color: "danger",
      variant: "link",
      class: "text-[#ff4f4f] hover:text-[#d24141]",
    },
    {
      color: "default",
      variant: "link",
      class: "text-[#0f1511] hover:text-[#595180]",
    },

    // ─ isIconOnly × size ──────────────────────
    { isIconOnly: true, size: "xs", class: "w-7  h-7" },
    { isIconOnly: true, size: "sm", class: "w-9  h-9" },
    { isIconOnly: true, size: "md", class: "w-10 h-10" },
    { isIconOnly: true, size: "lg", class: "w-12 h-12" },
    { isIconOnly: true, size: "xl", class: "w-14 h-14" },
  ],

  defaultVariants: {
    color:   "default",
    variant: "solid",
    size:    "md",
  },
});

// ─────────────────────────────────────────────
//  Types du composant
// ─────────────────────────────────────────────
export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariants {
  /** Icône Iconify à gauche (ex: "solar:home-2-linear") */
  startIcon?: string;
  /** Icône Iconify à droite */
  endIcon?: string;
  /** Affiche un spinner de chargement */
  isLoading?: boolean;
  /** Texte du label de chargement */
  loadingText?: string;
  /** Largeur de l'icône (défaut : 18) */
  iconSize?: number;
  /** Ref forwardé */
  ref?: React.Ref<HTMLButtonElement>;
}

// ─────────────────────────────────────────────
//  Composant Button
// ─────────────────────────────────────────────
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color,
      variant,
      size,
      rounded,
      fullWidth,
      isIconOnly,
      startIcon,
      endIcon,
      isLoading = false,
      loadingText,
      iconSize = 18,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const iconSizeMap: Record<NonNullable<ButtonVariants["size"]>, number> = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 22,
    };

    const resolvedIconSize = iconSize ?? iconSizeMap[size ?? "md"];

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants({
            color,
            variant,
            size,
            rounded,
            fullWidth,
            isIconOnly,
          }),
          className,
        )}
        {...props}
      >
        {/* Spinner de chargement */}
        {isLoading && (
          <Icon
            icon="solar:refresh-bold"
            width={resolvedIconSize}
            className="animate-spin shrink-0"
          />
        )}

        {/* Icône gauche (uniquement si pas en chargement) */}
        {!isLoading && startIcon && (
          <Icon
            icon={startIcon}
            width={resolvedIconSize}
            className="shrink-0"
          />
        )}

        {/* Contenu */}
        {isIconOnly ? null : (
          <span className="leading-none">
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}

        {/* Icône droite (uniquement si pas en chargement) */}
        {!isLoading && endIcon && (
          <Icon
            icon={endIcon}
            width={resolvedIconSize}
            className="shrink-0"
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export default Button;
