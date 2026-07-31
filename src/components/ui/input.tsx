"use client";

import React from "react";
import { Input as HeroInput, type InputProps } from "@heroui/react";
import { mergeClasses } from "@heroui/theme";

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
  label: ["text-foreground/50", "text-xs", "font-medium"],
  input: [
    "text-sm",
    "text-foreground",
    "placeholder:text-foreground/30",
    "bg-transparent",
  ],
  description: "text-foreground/40 text-xs",
  errorMessage: "text-danger text-xs",
};

export function Input({ classNames, ...rest }: InputProps) {
  return (
    <HeroInput
      // @ts-expect-error -- HTMLHeroUIProps est polymorphe (props "as"), spreader la totalité dépasse la limite d'union de TS (TS2590)
      {...rest}
      classNames={mergeClasses(inputClassNames, classNames)}
    />
  );
}

Input.displayName = "Input";
