import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@heroui/react";

export const cardVariants = tv({
  slots: {
    root: [
      "rounded-[22px] transition-all duration-fast",
      "focus-within:outline-none",
    ],
    header: "flex flex-col gap-1",
    body: "flex flex-col gap-3",
    footer: "flex items-center gap-2",
  },
  variants: {
    variant: {
      elevated: {
        root: "bg-dashboard-panel shadow-inset-border",
      },
      flat: {
        root: "bg-default/60 border border-transparent",
      },
      outline: {
        root: "bg-transparent border border-foreground/12 hover:border-foreground/25",
      },
      glass: {
        root: "bg-white/60 backdrop-blur-md border border-white/40 shadow-sm",
      },
    },
    size: {
      sm: {
        root: "p-3",
        header: "mb-2",
        footer: "mt-2",
      },
      md: {
        root: "p-5",
        header: "mb-3",
        footer: "mt-3",
      },
      lg: {
        root: "p-7",
        header: "mb-4",
        footer: "mt-4",
      },
    },
    isHoverable: {
      true: { root: "cursor-pointer hover:-translate-y-0.5" },
    },
    isPressable: {
      true: { root: "cursor-pointer active:scale-[0.99]" },
    },
  },
  defaultVariants: {
    variant: "elevated",
    size: "md",
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariants {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function Card({
  children,
  className,
  variant,
  size,
  isHoverable,
  isPressable,
  ...props
}: CardProps) {
  const { root } = cardVariants({ variant, size, isHoverable, isPressable });

  return (
    <div className={cn(root(), className)} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 mb-3", className)} {...props}>
      {children}
    </div>
  );
}

function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 mt-3 pt-3 border-t border-foreground/8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardBody, CardFooter };
