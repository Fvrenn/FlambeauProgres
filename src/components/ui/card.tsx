import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@heroui/react";

const cardVariants = tv({
  slots: {
    root: [
      "rounded-[22px] transition-all duration-fast",
      "focus-within:outline-none",
    ],
    body: "flex flex-col gap-3",
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
      },
      md: {
        root: "p-5",
      },
      lg: {
        root: "p-7",
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

type CardVariants = VariantProps<typeof cardVariants>;

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariants {}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

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

function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
}

Card.displayName = "Card";
CardBody.displayName = "CardBody";

export { Card, CardBody };
