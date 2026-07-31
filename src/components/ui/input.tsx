"use client";

import React from "react";
import { Input as HeroInput, type InputProps } from "@heroui/react";

const inputClassNames: InputProps["classNames"] = {
  inputWrapper: [
    "bg-[#FAF6EB]",
    "border",
    "border-dashboard-border",
    "rounded-[12px]",
    "shadow-none",
    "hover:bg-dashboard-tab",
    "group-data-[focus=true]:bg-dashboard-tab",
    "group-data-[focus=true]:border-foreground/30",
    "!transition-colors",
  ],
  label: [
    "text-foreground/50",
    "text-xs",
    "font-medium",
  ],
  input: [
    "text-sm",
    "text-foreground",
    "placeholder:text-foreground/30",
    "bg-transparent",
  ],
  description: "text-foreground/40 text-xs",
  errorMessage: "text-danger text-xs",
};

export function Input(props: InputProps) {
  return (
    <HeroInput
      {...props}
      classNames={{
        ...inputClassNames,
        ...props.classNames,
      }}
    />
  );
}

Input.displayName = "Input";
