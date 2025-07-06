"use client";

import { Link as HeroLink } from "@heroui/link";

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
}

export const CustomLink = ({
  children,
  href,
  className = "",
  color = "primary",
  size = "md",
  underline = "none",
  isExternal = false,
  isDisabled = false,
  isBlock = false,
  target,
  rel,
  ...props
}: CustomLinkProps) => {
  return (
    <HeroLink
      href={href}
      className={className}
      color={color}
      size={size}
      underline={underline}
      isExternal={isExternal}
      isDisabled={isDisabled}
      isBlock={isBlock}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </HeroLink>
  );
};

CustomLink.displayName = "CustomLink";
