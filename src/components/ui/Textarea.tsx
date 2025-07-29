"use client";

import {Textarea} from "@heroui/input";
import { forwardRef } from "react";

const textareaThemes = {
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

interface CustomTextareaProps {
  label?: string;
  name?: string;
  placeholder?: string;
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
  minRows?: number;
  maxRows?: number;
  cacheMeasurements?: boolean;
  disableAutosize?: boolean;
  disableAnimation?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  theme?: keyof typeof textareaThemes;
}

export const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  (
    {
      name,
      label,
      placeholder,
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
      minRows,
      maxRows,
      cacheMeasurements,
      disableAutosize = false,
      disableAnimation = false,
      startContent,
      endContent,
      className = "",
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = textareaThemes[theme];

    return (
      <Textarea
        ref={ref}
        name={name}
        label={label}
        placeholder={placeholder}
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
        minRows={minRows}
        maxRows={maxRows}
        cacheMeasurements={cacheMeasurements}
        disableAutosize={disableAutosize}
        disableAnimation={disableAnimation}
        startContent={startContent}
        endContent={endContent}
        className={className}
        {...props}
      />
    );
  }
);

CustomTextarea.displayName = "CustomTextarea";