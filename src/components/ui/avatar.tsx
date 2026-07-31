import React from "react";
import { cn } from "@heroui/react";

const SIZES = { sm: 28, md: 40, lg: 56 } as const;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof SIZES;
  ring?: boolean;
}

function getInitials(name?: string | null): string {
  if (!name) return "U";

  const parts = name.trim().split(/\s+/).slice(0, 2);

  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "U";
}

export function Avatar({
  src,
  name,
  size = "md",
  ring = false,
  className,
  style,
  ...props
}: AvatarProps) {
  const px = SIZES[size] ?? SIZES.md;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        src ? "bg-transparent" : "bg-foreground text-white",
        ring && "ring-2 ring-primary ring-offset-2",
        className,
      )}
      style={{
        width: px,
        height: px,
        fontSize: px * 0.38,
        fontWeight: 600,
        ...style,
      }}
      {...props}
    >
      {src ? (
        <img alt="" className="h-full w-full object-cover" src={src} />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

Avatar.displayName = "Avatar";
