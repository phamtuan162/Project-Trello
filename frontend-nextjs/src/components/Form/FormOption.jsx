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
    <NavbarItem className="">
      <button
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
        type="button"
        aria-label={option.label}
        className=" rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-full  flex items-center "
      >
        {option.icon}

        <Popover
          showArrow
          className="translate-y-[24px] -translate-x-[10px]"
          isOpen={isPopoverOpen}
          onOpenChange={(open) => setIsPopoverOpen(open)}
          placement="bottom"
          color="default"
          classNames={{
            content: ["p-2 "],
          }}
        >
          <PopoverTrigger>
            <span className=""></span>
          </PopoverTrigger>
          <PopoverContent className="max-w-[130px] text-center">
            {option.label}
          </PopoverContent>
        </Popover>
      </button>
    </NavbarItem>
  );
}
