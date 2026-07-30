import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";

export const badgeVariants = tv({
  base: [
    "inline-flex items-center gap-1.5 rounded-full font-medium",
    "transition-colors duration-fast",
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
      dot: "pl-2",
    },
    size: {
      sm: "text-xs px-2   h-5",
      md: "text-xs px-2.5 h-6",
      lg: "text-sm px-3   h-7",
    },
  },
  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      class: "bg-[#FCC226] text-[#0f1511]",
    },
    {
      color: "secondary",
      variant: "solid",
      class: "bg-[#ffdc00] text-[#0f1511]",
    },
    { color: "success", variant: "solid", class: "bg-[#1bc47d] text-white" },
    {
      color: "warning",
      variant: "solid",
      class: "bg-[#ffb100] text-[#0f1511]",
    },
    { color: "danger", variant: "solid", class: "bg-[#ff4f4f] text-white" },
    {
      color: "default",
      variant: "solid",
      class: "bg-[#E8E7DE] text-[#0f1511]",
    },
    {
      color: "primary",
      variant: "flat",
      class: "bg-[#FCC226]/15 text-[#c49a0e]",
    },
    {
      color: "secondary",
      variant: "flat",
      class: "bg-[#ffdc00]/15 text-[#a68f00]",
    },
    {
      color: "success",
      variant: "flat",
      class: "bg-[#1bc47d]/15 text-[#127f51]",
    },
    {
      color: "warning",
      variant: "flat",
      class: "bg-[#ffb100]/15 text-[#a67300]",
    },
    {
      color: "danger",
      variant: "flat",
      class: "bg-[#ff4f4f]/15 text-[#d24141]",
    },
    {
      color: "default",
      variant: "flat",
      class: "bg-[#0f1511]/8 text-[#0f1511]",
    },
    {
      color: "primary",
      variant: "outline",
      class: "border-[#FCC226] text-[#c49a0e]",
    },
    {
      color: "secondary",
      variant: "outline",
      class: "border-[#ffdc00] text-[#a68f00]",
    },
    {
      color: "success",
      variant: "outline",
      class: "border-[#1bc47d] text-[#1bc47d]",
    },
    {
      color: "warning",
      variant: "outline",
      class: "border-[#ffb100] text-[#ffb100]",
    },
    {
      color: "danger",
      variant: "outline",
      class: "border-[#ff4f4f] text-[#ff4f4f]",
    },
    {
      color: "default",
      variant: "outline",
      class: "border-[#0f1511]/20 text-[#0f1511]",
    },
    { color: "primary", variant: "dot", class: "text-[#c49a0e]" },
    { color: "secondary", variant: "dot", class: "text-[#a68f00]" },
    { color: "success", variant: "dot", class: "text-[#127f51]" },
    { color: "warning", variant: "dot", class: "text-[#a67300]" },
    { color: "danger", variant: "dot", class: "text-[#d24141]" },
    { color: "default", variant: "dot", class: "text-[#0f1511]" },
  ],
  defaultVariants: {
    color: "default",
    variant: "flat",
    size: "md",
  },
});

const DOT_COLORS: Record<string, string> = {
  primary: "bg-[#FCC226]",
  secondary: "bg-[#ffdc00]",
  success: "bg-[#1bc47d]",
  warning: "bg-[#ffb100]",
  danger: "bg-[#ff4f4f]",
  default: "bg-[#0f1511]",
};

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    BadgeVariants {
  icon?: string;
}

export function Badge({
  children,
  className,
  color = "default",
  variant = "flat",
  size = "md",
  icon,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ color, variant, size }), className)}
      {...props}
    >
      {variant === "dot" && (
        <span
          className={cn(
            "inline-block rounded-full shrink-0",
            size === "sm"
              ? "w-1.5 h-1.5"
              : size === "lg"
                ? "w-2.5 h-2.5"
                : "w-2 h-2",
            DOT_COLORS[(color as string) ?? "default"],
          )}
        />
      )}
      {icon && variant !== "dot" && (
        <Icon
          className="shrink-0"
          icon={icon}
          width={size === "lg" ? 14 : 12}
        />
      )}
      {children}
    </span>
  );
}

Badge.displayName = "Badge";
export default Badge;
