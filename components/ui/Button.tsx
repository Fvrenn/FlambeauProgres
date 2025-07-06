"use client";

import {Button} from "@heroui/button";import { forwardRef } from "react";

const buttonThemes = {
  default: {
    variant: "solid" as const,
    color: "default" as const,
    size: "md" as const,
    radius: "md" as const,
    customClasses: "bg-medium-black text-white border-medium-black",
  },
  primary: {
    variant: "solid" as const,
    color: "primary" as const,
    size: "lg" as const,
    radius: "md" as const,
    customClasses: "",
  },
  secondary: {
    variant: "bordered" as const,
    color: "primary" as const,
    size: "md" as const,
    radius: "md" as const,
    customClasses: "",
  },
  ghost: {
    variant: "light" as const,
    color: "primary" as const,
    size: "md" as const,
    radius: "md" as const,
    customClasses: "",
  },
  danger: {
    variant: "solid" as const,
    color: "danger" as const,
    size: "md" as const,
    radius: "md" as const,
    customClasses: "",
  },
  auth: {
    variant: "solid" as const,
    color: "primary" as const,
    size: "lg" as const,
    radius: "md" as const,
    customClasses: "",
  },
};

interface CustomButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  disabled?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  spinner?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  theme?: keyof typeof buttonThemes;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      type = "button",
      variant,
      color,
      size,
      radius,
      disabled = false,
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      startContent,
      endContent,
      spinner,
      onClick,
      className = "",
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = buttonThemes[theme];

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant || currentTheme.variant}
        color={color || currentTheme.color}
        size={size || currentTheme.size}
        radius={radius || currentTheme.radius}
        disabled={disabled || isDisabled}
        isLoading={isLoading}
        isDisabled={isDisabled}
        fullWidth={fullWidth}
        startContent={startContent}
        endContent={endContent}
        spinner={spinner}
        onClick={onClick}
        className={`${fullWidth ? "w-full" : ""} ${currentTheme.customClasses} ${className}`}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
