import { Input as HeroInput } from "@heroui/input";
import { forwardRef } from "react";

interface CustomInputProps {
  label?: string;
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
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
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
      size = "md",
      color = "default",
      variant = "bordered",
      radius = "md",
      labelPlacement = "outside",
      isClearable = false,
      startContent,
      endContent,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <HeroInput
        ref={ref}
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
        size={size}
        color={color}
        variant={variant}
        radius={radius}
        labelPlacement={labelPlacement}
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
