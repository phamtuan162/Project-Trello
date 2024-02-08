"use client";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
} from "@nextui-org/react";
export default function FormPopoverWorkSpace({
  children,
  placement = "bottom",
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Popover
      placement={placement}
      className="w-[304px]"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      style={{ translate: "-68px" }}
    >
      <PopoverTrigger>
        {children ? (
          children
        ) : (
          <Button color="hidden" className="p-0 min-w-[0px] w-0	"></Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Dimensions
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
              <Input
                defaultValue="100%"
                label="Width"
                size="sm"
                variant="bordered"
              />
              <Input
                defaultValue="300px"
                label="Max. width"
                size="sm"
                variant="bordered"
              />
              <Input
                defaultValue="24px"
                label="Height"
                size="sm"
                variant="bordered"
              />
              <Input
                defaultValue="30px"
                label="Max. height"
                size="sm"
                variant="bordered"
              />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
