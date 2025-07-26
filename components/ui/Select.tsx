"use client";

import {Select, SelectItem} from "@heroui/select";
import { forwardRef } from "react";
import { Selection } from "@heroui/react";

const selectThemes = {
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

interface SelectOption {
  key: string;
  label: string;
  value?: string;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  textValue?: string;
  isDisabled?: boolean;
}

interface CustomSelectProps {
  label?: string;
  name?: string;
  placeholder?: string;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  options: SelectOption[];
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
  selectionMode?: "single" | "multiple";
  isMultiline?: boolean;
  disallowEmptySelection?: boolean;
  closeOnSelect?: boolean;
  shouldFlip?: boolean;
  isLoading?: boolean;
  spinnerProps?: any;
  scrollShadowProps?: any;
  selectorIcon?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  listboxProps?: any;
  popoverProps?: any;
  theme?: keyof typeof selectThemes;
}

export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      name,
      label,
      placeholder,
      selectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      options,
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
      selectionMode = "single",
      isMultiline = false,
      disallowEmptySelection = false,
      closeOnSelect = true,
      shouldFlip = true,
      isLoading = false,
      spinnerProps,
      scrollShadowProps,
      selectorIcon,
      startContent,
      endContent,
      className = "",
      listboxProps,
      popoverProps,
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = selectThemes[theme];

    return (
      <Select
        ref={ref}
        name={name}
        label={label}
        placeholder={placeholder}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
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
        selectionMode={selectionMode}
        isMultiline={isMultiline}
        disallowEmptySelection={disallowEmptySelection}
        shouldFlip={shouldFlip}
        isLoading={isLoading}
        spinnerProps={spinnerProps}
        scrollShadowProps={scrollShadowProps}
        selectorIcon={selectorIcon}
        startContent={startContent}
        endContent={endContent}
        className={className}
        listboxProps={listboxProps}
        popoverProps={popoverProps}
        {...props}
      >
        {options.map((option) => (
          <SelectItem
            key={option.key}
            textValue={option.textValue || option.label}
            description={option.description}
            startContent={option.startContent}
            endContent={option.endContent}
            isDisabled={option.isDisabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </Select>
    );
  }
);

CustomSelect.displayName = "CustomSelect";