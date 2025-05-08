import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Skeleton = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
));

Skeleton.displayName = "Skeleton";