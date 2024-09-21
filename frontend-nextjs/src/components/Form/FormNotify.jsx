"use client";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
} from "@nextui-org/react";
export default function FormNotify({ children, placement = "bottom", label }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      placement={placement}
      className="w-[304px] "
      isOpen={isOpen}
      showArrow
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2 w-auto">
            <p className="text-small  text-foreground" {...titleProps}>
              {label}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
