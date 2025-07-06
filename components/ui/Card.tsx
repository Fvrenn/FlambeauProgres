"use client";

import { Card as HeroCard, CardBody as HeroCardBody, CardHeader as HeroCardHeader, CardFooter as HeroCardFooter } from "@heroui/react";

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
  isPressable?: boolean;
  isBlurred?: boolean;
  isFooterBlurred?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  isDisabled?: boolean;
  disableAnimation?: boolean;
  onPress?: () => void;
}

interface CustomCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CustomCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CustomCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CustomCard = ({
  children,
  className = "",
  isHoverable = false,
  isPressable = false,
  isBlurred = false,
  isFooterBlurred = false,
  shadow = "md",
  radius = "lg",
  fullWidth = false,
  isDisabled = false,
  disableAnimation = false,
  onPress,
  ...props
}: CustomCardProps) => {
  return (
    <HeroCard
      className={className}
      isHoverable={isHoverable}
      isPressable={isPressable}
      isBlurred={isBlurred}
      isFooterBlurred={isFooterBlurred}
      shadow={shadow}
      radius={radius}
      fullWidth={fullWidth}
      isDisabled={isDisabled}
      disableAnimation={disableAnimation}
      onPress={onPress}
      {...props}
    >
      {children}
    </HeroCard>
  );
};

export const CustomCardBody = ({ children, className = "", ...props }: CustomCardBodyProps) => {
  return (
    <HeroCardBody
      className={className}
      {...props}
    >
      {children}
    </HeroCardBody>
  );
};

export const CustomCardHeader = ({ children, className = "", ...props }: CustomCardHeaderProps) => {
  return (
    <HeroCardHeader
      className={className}
      {...props}
    >
      {children}
    </HeroCardHeader>
  );
};

export const CustomCardFooter = ({
  children,
  className = "",
  ...props
}: CustomCardFooterProps) => {
  return (
    <HeroCardFooter
      className={className}
      {...props}
    >
      {children}
    </HeroCardFooter>
  );
};

CustomCard.displayName = "CustomCard";
CustomCardBody.displayName = "CustomCardBody";
CustomCardHeader.displayName = "CustomCardHeader";
CustomCardFooter.displayName = "CustomCardFooter";
