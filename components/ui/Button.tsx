import { Button as HeroButton } from "@heroui/button";
import { forwardRef } from "react";

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
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      children,
      type = "button",
      variant = "solid",
      color = "primary",
      size = "md",
      radius = "md",
      disabled = false,
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      startContent,
      endContent,
      spinner,
      onClick,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <HeroButton
        ref={ref}
        type={type}
        variant={variant}
        color={color}
        size={size}
        radius={radius}
        disabled={disabled || isDisabled}
        isLoading={isLoading}
        isDisabled={isDisabled}
        fullWidth={fullWidth}
        startContent={startContent}
        endContent={endContent}
        spinner={spinner}
        onClick={onClick}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </HeroButton>
    );
  }
);

CustomButton.displayName = "CustomButton";
