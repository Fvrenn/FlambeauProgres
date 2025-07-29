"use client";

import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
const cardThemes = {
  default: {
    shadow: "md" as const,
    radius: "lg" as const,
    isHoverable: false,
    isPressable: false,
  },
  elegant: {
    shadow: "lg" as const,
    radius: "lg" as const,
    isHoverable: true,
    isPressable: false,
  },
  minimal: {
    shadow: "none" as const,
    radius: "md" as const,
    isHoverable: false,
    isPressable: false,
  },
  interactive: {
    shadow: "md" as const,
    radius: "lg" as const,
    isHoverable: true,
    isPressable: true,
  },
  auth: {
    shadow: "lg" as const,
    radius: "lg" as const,
    isHoverable: false,
    isPressable: false,
  },
};

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
  theme?: keyof typeof cardThemes;
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
  isHoverable,
  isPressable,
  isBlurred = false,
  isFooterBlurred = false,
  shadow,
  radius,
  fullWidth = false,
  isDisabled = false,
  disableAnimation = false,
  onPress,
  theme = "default",
  ...props
}: CustomCardProps) => {
  const currentTheme = cardThemes[theme];

  return (
    <Card
      className={className}
      isHoverable={isHoverable ?? currentTheme.isHoverable}
      isPressable={isPressable ?? currentTheme.isPressable}
      isBlurred={isBlurred}
      isFooterBlurred={isFooterBlurred}
      shadow={shadow || currentTheme.shadow}
      radius={radius || currentTheme.radius}
      fullWidth={fullWidth}
      isDisabled={isDisabled}
      disableAnimation={disableAnimation}
      onPress={onPress}
      {...props}
    >
      {children}
    </Card>
  );
};

export const CustomCardBody = ({ children, className = "", ...props }: CustomCardBodyProps) => {
  return (
    <CardBody
      className={className}
      {...props}
    >
      {children}
    </CardBody>
  );
};

export const CustomCardHeader = ({ children, className = "", ...props }: CustomCardHeaderProps) => {
  return (
    <CardHeader
      className={className}
      {...props}
    >
      {children}
    </CardHeader>
  );
};

export const CustomCardFooter = ({
  children,
  className = "",
  ...props
}: CustomCardFooterProps) => {
  return (
    <CardFooter
      className={className}
      {...props}
    >
      {children}
    </CardFooter>
  );
};

CustomCard.displayName = "CustomCard";
CustomCardBody.displayName = "CustomCardBody";
CustomCardHeader.displayName = "CustomCardHeader";
CustomCardFooter.displayName = "CustomCardFooter";
