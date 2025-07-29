"use client";

import { DatePicker } from "@heroui/date-picker";
import { forwardRef } from "react";
import { DateValue } from "@internationalized/date";

const datePickerThemes = {
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

interface CustomDatePickerProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: DateValue;
  onChange?: (date: DateValue | null) => void;
  defaultValue?: DateValue;
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement?: "inside" | "outside" | "outside-left";
  showMonthAndYearPickers?: boolean;
  hideTimeZone?: boolean;
  hourCycle?: 12 | 24;
  granularity?: "day" | "hour" | "minute" | "second";
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: DateValue) => boolean;
  pageBehavior?: "single" | "visible";
  visibleMonths?: number;
  autoFocus?: boolean;
  calendarWidth?: number;
  selectorIcon?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  calendarProps?: any;
  timeInputProps?: any;
  theme?: keyof typeof datePickerThemes;
}

export const CustomDatePicker = forwardRef<
  HTMLDivElement,
  CustomDatePickerProps
>(
  (
    {
      name,
      label,
      placeholder,
      value,
      onChange,
      defaultValue,
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
      showMonthAndYearPickers = false,
      hideTimeZone = false,
      hourCycle = 24,
      granularity = "day",
      minValue,
      maxValue,
      isDateUnavailable,
      pageBehavior = "single",
      visibleMonths = 1,
      autoFocus = false,
      calendarWidth,
      selectorIcon,
      startContent,
      endContent,
      className = "",
      calendarProps,
      timeInputProps,
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = datePickerThemes[theme];

    return (
      <DatePicker
        ref={ref}
        name={name}
        label={label}
        value={value}
        onChange={
          onChange ? (value) => onChange(value as DateValue | null) : undefined
        }
        defaultValue={defaultValue}
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
        showMonthAndYearPickers={showMonthAndYearPickers}
        hideTimeZone={hideTimeZone}
        hourCycle={hourCycle}
        granularity={granularity}
        minValue={minValue}
        maxValue={maxValue}
        isDateUnavailable={isDateUnavailable}
        pageBehavior={pageBehavior}
        visibleMonths={visibleMonths}
        autoFocus={autoFocus}
        calendarWidth={calendarWidth}
        selectorIcon={selectorIcon}
        startContent={startContent}
        endContent={endContent}
        className={className}
        calendarProps={calendarProps}
        timeInputProps={timeInputProps}
        {...props}
      />
    );
  }
);

CustomDatePicker.displayName = "CustomDatePicker";
