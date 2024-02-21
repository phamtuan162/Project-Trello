"use client";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  NavbarItem,
} from "@nextui-org/react";
export default function FormOption({ option }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <NavbarItem className="h-full">
      <button
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
        style={{ marginRight: "-5px" }}
        type="button"
        aria-label={option.label}
        className="relative rounded-lg  p-2 text-gray-400 hover:bg-gray-500 hover:text-white h-full  text-lg "
      >
        {option.icon}

        <Popover
          showArrow
          isOpen={isPopoverOpen}
          onOpenChange={(open) => setIsPopoverOpen(open)}
          placement="bottom"
          classNames={{
            base: ["before:bg-default-800"],
            content: [
              "p-2 bg-default-800 text-white text-lg",
              "dark:from-default-100 dark:to-default-50",
            ],
          }}
        >
          <PopoverTrigger>
            <span className=""></span>
          </PopoverTrigger>
          <PopoverContent>{option.label}</PopoverContent>
        </Popover>
      </button>
    </NavbarItem>
  );
}
