"use client";

import {Link} from "@heroui/link";
const linkThemes = {
  default: {
    color: "primary" as const,
    size: "md" as const,
    underline: "none" as const,
  },
  subtle: {
    color: "foreground" as const,
    size: "sm" as const,
    underline: "hover" as const,
  },
  accent: {
    color: "primary" as const,
    size: "md" as const,
    underline: "always" as const,
  },
  danger: {
    color: "danger" as const,
    size: "md" as const,
    underline: "hover" as const,
  },
  auth: {
    color: "foreground" as const,
    size: "sm" as const,
    underline: "hover" as const,
  },
};

interface CustomLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  color?: "foreground" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  underline?: "none" | "hover" | "always" | "active" | "focus";
  isExternal?: boolean;
  isDisabled?: boolean;
  isBlock?: boolean;
  target?: string;
  rel?: string;
  theme?: keyof typeof linkThemes;
}

export const CustomLink = ({
  children,
  href,
  className = "",
  color,
  size,
  underline,
  isExternal = false,
  isDisabled = false,
  isBlock = false,
  target,
  rel,
  theme = "default",
  ...props
}: CustomLinkProps) => {
  const currentTheme = linkThemes[theme];

  return (
    <Link
      href={href}
      className={className}
      color={color || currentTheme.color}
      size={size || currentTheme.size}
      underline={underline || currentTheme.underline}
      isExternal={isExternal}
      isDisabled={isDisabled}
      isBlock={isBlock}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
};

CustomLink.displayName = "CustomLink";
