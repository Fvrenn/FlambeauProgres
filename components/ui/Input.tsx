"use client";

import {Input} from "@heroui/input";
import { forwardRef } from "react";

const inputThemes = {
  default: {
    variant: "faded" as const,
    size: "md" as const,
    color: "default" as const,
    radius: "md" as const,
    labelPlacement: "outside" as const,
  },
  modern: {
    variant: "flat" as const,
    size: "lg" as const,
    color: "primary" as const,
    radius: "lg" as const,
    labelPlacement: "inside" as const,
  },
  minimal: {
    variant: "underlined" as const,
    size: "md" as const,
    color: "secondary" as const,
    radius: "none" as const,
    labelPlacement: "outside" as const,
  },
  elegant: {
    variant: "bordered" as const,
    size: "lg" as const,
    color: "primary" as const,
    radius: "md" as const,
    labelPlacement: "outside" as const,
  },
  auth: {
    variant: "bordered" as const,
    size: "lg" as const,
    color: "primary" as const,
    radius: "md" as const,
    labelPlacement: "outside" as const,
  },
};

interface CustomInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel" | "url" | "search";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement?: "inside" | "outside" | "outside-left";
  isClearable?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  theme?: keyof typeof inputThemes;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      name,
      label,
      placeholder,
      type = "text",
      value,
      onChange,
      onValueChange,
      required = false,
      disabled = false,
      isInvalid = false,
      errorMessage,
      description,
      size,
      color,
      variant,
      radius,
      labelPlacement,
      isClearable = false,
      startContent,
      endContent,
      className = "",
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = inputThemes[theme];

    return (
      <Input
        ref={ref}
        name={name}
        label={label}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        onValueChange={onValueChange}
        isRequired={required}
        isDisabled={disabled}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        description={description}
        size={size || currentTheme.size}
        color={color || currentTheme.color}
        variant={variant || currentTheme.variant}
        radius={radius || currentTheme.radius}
        labelPlacement={labelPlacement || currentTheme.labelPlacement}
        isClearable={isClearable}
        startContent={startContent}
        endContent={endContent}
        className={className}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
