"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import capitalize from "@/utils/capitalize";

const statusOptions = [
  { name: "Gần Nhất Trước ↓", uid: "desc" },
  { name: "Xa Nhất Trước ↑", uid: "asc" },
  { name: "Theo bảng chữ cái A-Z", uid: "nameAZ" },
  { name: "Theo bảng chữ cái Z-A", uid: "nameZA" },
];

const SortBoard = ({ children, setStatusFilter, statusFilter, isAction }) => {
  return (
    <Dropdown isOpen={isAction}>
      <DropdownTrigger className="hidden sm:flex">{children}</DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="status boards"
        closeOnSelect={false}
        selectedKeys={[statusFilter]}
        selectionMode="single"
        onSelectionChange={(value) => setStatusFilter([...value][0])}
      >
        {statusOptions.map((status) => (
          <DropdownItem key={status.uid} className="capitalize">
            <div>
              <p>{capitalize(status.name)}</p>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
export default SortBoard;
