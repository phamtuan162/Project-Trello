"use client";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@nextui-org/react";

import { BoardIcon } from "../Icon/BoardIcon";
import { UserIcon } from "../Icon/UserIcon";
import { AddIcon } from "../Icon/AddIcon";
import { BoardSampleIcon } from "../Icon/BoardSampleIcon";
import FormPopoverBoard from "../Form/FormPopoverBoard";
import FormPopoverWorkSpace from "../Form/FormPopoverWorkSpace";
export default function CreateAll() {
  const items = [
    {
      key: "createBoard",
      title: "Tạo bảng",
      desc: "Sử dụng bảng để quản lý các dự án, theo dõi thông tin, hoặc tổ chức bất cứ việc gì.",
      icon: <BoardIcon />,
      popover: <FormPopoverBoard />,
    },
    {
      key: "createBoardSample",
      title: "createBoardSample",
      desc: "Bắt đầu nhanh hơn với mẫu bảng.",
      icon: <BoardSampleIcon />,
    },
    {
      key: "createWorkspace",
      title: "Tạo Không gian làm việc",
      desc: "Sử dụng Không gian làm việc để tổ chức công ty của bạn, hỗ trợ người bận rộn, gia đình hoặc bạn bè.",
      icon: <UserIcon />,
      popover: <FormPopoverWorkSpace />,
    },
  ];
  const [selectedItem, setSelectedItem] = useState(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleItemClick = (key) => {
    setSelectedItem(key === selectedItem ? null : key);
  };
  return (
    <div className="flex ">
      <Dropdown className="max-h-[229px] w-[304px] overflow-y-auto">
        <DropdownTrigger>
          <Button
            color="primary"
            className="min-w-5 aria-expanded:bg-sky-200	 aria-expanded:text-blue-700"
            onClick={() => setSelectedItem(null)}
          >
            <AddIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown menu with description"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
        >
          <DropdownSection>
            {items.map((item) => {
              return (
                <DropdownItem
                  key={item.key}
                  description={item.desc}
                  title={item.title}
                  startContent={item.icon}
                  onClick={() => handleItemClick(item.key)}
                >
                  {item.title}
                </DropdownItem>
              );
            })}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {selectedItem && (
        <>{items.find((item) => item.key === selectedItem)?.popover}</>
      )}
    </div>
  );
}
