
"use client";

import { ToastProvider, Toast, useToast } from "@heroui/react";
import { forwardRef, ReactNode } from "react";

const toastThemes = {
  default: {
    color: "default" as const,
    variant: "flat" as const,
    radius: "md" as const,
  },
  success: {
    color: "success" as const,
    variant: "solid" as const,
    radius: "md" as const,
  },
  danger: {
    color: "danger" as const,
    variant: "solid" as const,
    radius: "md" as const,
  },
  warning: {
    color: "warning" as const,
    variant: "solid" as const,
    radius: "md" as const,
  },
  info: {
    color: "primary" as const,
    variant: "bordered" as const,
    radius: "md" as const,
  },
};

export interface CustomToastProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "flat";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  endContent?: ReactNode;
  closeIcon?: ReactNode;
  timeout?: number;
  promise?: Promise<any>;
  loadingIcon?: ReactNode;
  hideIcon?: boolean;
  hideCloseButton?: boolean;
  shouldShowTimeoutProgress?: boolean;
  severity?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  className?: string;
  classNames?: Partial<Record<string, string>>;
  theme?: keyof typeof toastThemes;
}

export const CustomToast = forwardRef<HTMLDivElement, CustomToastProps>(
  (
    {
      title,
      description,
      icon,
      color,
      variant,
      radius,
      endContent,
      closeIcon,
      timeout,
      promise,
      loadingIcon,
      hideIcon = false,
      hideCloseButton = false,
      shouldShowTimeoutProgress = false,
      severity,
      className = "",
      classNames,
      theme = "default",
      ...props
    },
    ref
  ) => {
    const currentTheme = toastThemes[theme];
    return (
      <Toast
        ref={ref}
        title={title}
        description={description}
        icon={icon}
        color={color || currentTheme.color}
        variant={variant || currentTheme.variant}
        radius={radius || currentTheme.radius}
        endContent={endContent}
        closeIcon={closeIcon}
        timeout={timeout}
        promise={promise}
        loadingIcon={loadingIcon}
        hideIcon={hideIcon}
        hideCloseButton={hideCloseButton}
        shouldShowTimeoutProgress={shouldShowTimeoutProgress}
        severity={severity}
        className={className}
        classNames={classNames}
        {...props}
      />
    );
  }
);
CustomToast.displayName = "CustomToast";

export const CustomToastProvider = ToastProvider;
export { useToast };
