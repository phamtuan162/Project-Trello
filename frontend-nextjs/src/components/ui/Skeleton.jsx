import { cn } from "../../lib/utils";
import React from "react";
export function Skeleton({ className, ...props }) {
  return React.createElement("div", {
    className: cn("animate-pulse rounded-md bg-muted", className),
    ...props,
  });
}
