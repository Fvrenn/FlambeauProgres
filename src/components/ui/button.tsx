"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

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
    color: {
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      danger: "",
      default: "",
    },

    variant: {
      solid: "",
      flat: "",
      outline: "border bg-transparent",
      ghost: "bg-transparent",
      link: "bg-transparent underline-offset-4 hover:underline p-0 h-auto",
    },

    size: {
      xs: "text-xs px-2.5 py-1.5 h-7",
      sm: "text-xs px-3.5  py-0   h-8",
      md: "text-sm px-4.5  py-0   h-10",
      lg: "text-base px-6   py-0   h-12",
      xl: "text-lg  px-7   py-0   h-14",
    },

    rounded: {
      none: "!rounded-none",
      sm: "!rounded-sm",
      md: "!rounded-md",
      lg: "!rounded-lg",
      xl: "!rounded-xl",
      full: "!rounded-full",
    },

    fullWidth: {
      true: "w-full",
    },

    isIconOnly: {
      true: "p-0",
    },
  },

  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      class:
        "bg-primary text-foreground hover:bg-[#e5ae1e] focus-visible:ring-primary",
    },
    {
      color: "secondary",
      variant: "solid",
      class:
        "bg-secondary text-foreground hover:bg-[#e5c800] focus-visible:ring-secondary",
    },
    {
      color: "success",
      variant: "solid",
      class:
        "bg-success text-white hover:bg-[#16a267] focus-visible:ring-success",
    },
    {
      color: "warning",
      variant: "solid",
      class:
        "bg-warning text-foreground hover:bg-[#d29200] focus-visible:ring-warning",
    },
    {
      color: "danger",
      variant: "solid",
      class:
        "bg-danger text-white hover:bg-[#d24141] focus-visible:ring-danger",
    },
    {
      color: "default",
      variant: "solid",
      class:
        "bg-default text-foreground hover:bg-[#d4d3ca] focus-visible:ring-foreground",
    },

    {
      color: "primary",
      variant: "flat",
      class:
        "bg-primary/15 text-[#c49a0e] hover:bg-primary/25 focus-visible:ring-primary",
    },
    {
      color: "secondary",
      variant: "flat",
      class:
        "bg-secondary/15 text-[#a68f00] hover:bg-secondary/25 focus-visible:ring-secondary",
    },
    {
      color: "success",
      variant: "flat",
      class:
        "bg-success/15 text-[#127f51] hover:bg-success/25 focus-visible:ring-success",
    },
    {
      color: "warning",
      variant: "flat",
      class:
        "bg-warning/15 text-[#a67300] hover:bg-warning/25 focus-visible:ring-warning",
    },
    {
      color: "danger",
      variant: "flat",
      class:
        "bg-danger/15 text-[#d24141] hover:bg-danger/25 focus-visible:ring-danger",
    },
    {
      color: "default",
      variant: "flat",
      class:
        "bg-default/60 text-foreground hover:bg-default focus-visible:ring-foreground",
    },

    {
      color: "primary",
      variant: "outline",
      class:
        "border-primary text-[#c49a0e] hover:bg-primary/10 focus-visible:ring-primary",
    },
    {
      color: "secondary",
      variant: "outline",
      class:
        "border-secondary text-[#a68f00] hover:bg-secondary/10 focus-visible:ring-secondary",
    },
    {
      color: "success",
      variant: "outline",
      class:
        "border-success text-success hover:bg-success/10 focus-visible:ring-success",
    },
    {
      color: "warning",
      variant: "outline",
      class:
        "border-warning text-warning hover:bg-warning/10 focus-visible:ring-warning",
    },
    {
      color: "danger",
      variant: "outline",
      class:
        "border-danger text-danger hover:bg-danger/10 focus-visible:ring-danger",
    },
    {
      color: "default",
      variant: "outline",
      class:
        "border-foreground/20 text-foreground hover:bg-foreground/5 focus-visible:ring-foreground",
    },

    {
      color: "primary",
      variant: "ghost",
      class:
        "text-[#c49a0e] hover:bg-primary/15 focus-visible:ring-primary",
    },
    {
      color: "secondary",
      variant: "ghost",
      class:
        "text-[#a68f00] hover:bg-secondary/15 focus-visible:ring-secondary",
    },
    {
      color: "success",
      variant: "ghost",
      class:
        "text-success hover:bg-success/15 focus-visible:ring-success",
    },
    {
      color: "warning",
      variant: "ghost",
      class:
        "text-warning hover:bg-warning/15 focus-visible:ring-warning",
    },
    {
      color: "danger",
      variant: "ghost",
      class:
        "text-danger hover:bg-danger/15 focus-visible:ring-danger",
    },
    {
      color: "default",
      variant: "ghost",
      class: "text-foreground hover:bg-foreground/8 focus-visible:ring-foreground",
    },

    {
      color: "primary",
      variant: "link",
      class: "text-[#c49a0e] hover:text-primary",
    },
    {
      color: "success",
      variant: "link",
      class: "text-success hover:text-[#16a267]",
    },
    {
      color: "danger",
      variant: "link",
      class: "text-danger hover:text-[#d24141]",
    },
    {
      color: "default",
      variant: "link",
      class: "text-foreground hover:text-[#595180]",
    },

    { isIconOnly: true, size: "xs", class: "w-7  h-7" },
    { isIconOnly: true, size: "sm", class: "w-9  h-9" },
    { isIconOnly: true, size: "md", class: "w-10 h-10" },
    { isIconOnly: true, size: "lg", class: "w-12 h-12" },
    { isIconOnly: true, size: "xl", class: "w-14 h-14" },
  ],

  defaultVariants: {
    color: "default",
    variant: "solid",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonVariants {
  startIcon?: string;
  endIcon?: string;
  isLoading?: boolean;
  loadingText?: string;
  iconSize?: number;
  ref?: React.Ref<HTMLButtonElement>;
}

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
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <Icon
            className="animate-spin shrink-0"
            icon="solar:refresh-bold"
            width={resolvedIconSize}
          />
        )}

        {!isLoading && startIcon && (
          <Icon
            className="shrink-0"
            icon={startIcon}
            width={resolvedIconSize}
          />
        )}

        {isIconOnly ? null : (
          <span className="leading-none">
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}

        {!isLoading && endIcon && (
          <Icon className="shrink-0" icon={endIcon} width={resolvedIconSize} />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
