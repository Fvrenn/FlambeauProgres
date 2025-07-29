"use client";

import { Checkbox } from "@heroui/checkbox";
import { forwardRef } from "react";

const checkboxThemes = {
  default: {
    size: "md" as const,
    color: "default" as const,
    radius: "md" as const,
  },
  modal: {
    size: "md" as const,
    color: "success" as const,
    radius: "md" as const,
  },
  minimal: {
    size: "md" as const,
    color: "secondary" as const,
    radius: "none" as const,
  },
  elegant: {
    size: "lg" as const,
    color: "primary" as const,
    radius: "md" as const,
  },
  auth: {
    size: "lg" as const,
    color: "primary" as const,
    radius: "md" as const,
  },
};

interface CustomCheckboxProps {
  children?: React.ReactNode;
  name?: string;
  value?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  onValueChange?: (isSelected: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  validationState?: "valid" | "invalid";
  description?: string;
  errorMessage?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  lineThrough?: boolean;
  isIndeterminate?: boolean;
  disableAnimation?: boolean;
  icon?: React.ReactNode;
  className?: string;
  classNames?: {
    base?: string;
    wrapper?: string;
    icon?: string;
    label?: string;
  };
  theme?: keyof typeof checkboxThemes;
}

export const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  (
    {
      children,
      name,
      value,
      isSelected,
      defaultSelected = false,
      onChange,
      onValueChange,
      required = false,
      disabled = false,
      isInvalid = false,
      validationState,
      description,
      errorMessage,
      size,
      color,
      radius,
      lineThrough = false,
      isIndeterminate = false,
      disableAnimation = false,
      icon,
      className = "",
      classNames,
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = checkboxThemes[theme];

    return (
      <div className="flex flex-col gap-1">
        <Checkbox
          ref={ref}
          name={name}
          value={value}
          isSelected={isSelected}
          defaultSelected={defaultSelected}
          onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
          onValueChange={onValueChange}
          isRequired={required}
          isDisabled={disabled}
          isInvalid={isInvalid}
          validationState={validationState}
          size={size || currentTheme.size}
          color={color || currentTheme.color}
          radius={radius || currentTheme.radius}
          lineThrough={lineThrough}
          isIndeterminate={isIndeterminate}
          disableAnimation={disableAnimation}
          icon={icon}
          className={className}
          classNames={classNames}
          {...props}
        >
          {children}
        </Checkbox>
        {description && !isInvalid && (
          <p className="text-xs text-default-400 ml-6">{description}</p>
        )}
        {errorMessage && isInvalid && (
          <p className="text-xs text-danger ml-6">{errorMessage}</p>
        )}
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";
