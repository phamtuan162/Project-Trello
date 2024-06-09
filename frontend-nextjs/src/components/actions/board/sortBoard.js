"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/Icon/CloseIcon";

const SortBoard = ({ children, setBoards, boards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("updated_at");
  useEffect(() => {
    const sortFunction = (a, b) => {
      if (selected.toLowerCase() === "name") {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
    };

    const sortedBoards = [...boards].sort(sortFunction);
    setBoards(sortedBoards);
  }, [selected]);

  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      classNames={{
        content: ["p-2"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[260px]">
        <div className="w-full ">
          <div className="flex justify-between items-center relative  ">
            <h1 className="grow text-center font-medium text-xs">
              Các bảng của bạn
            </h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-2 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium">Sắp xếp</p>
            <Select
              selectedKeys={[selected]}
              className="mt-1"
              classNames={{
                trigger: ["max-h-[40px] min-h-unit-10 "],
                value: ["text-xs font-medium "],
              }}
              onSelectionChange={(value) => {
                setSelected([...value][0]);
              }}
            >
              <SelectItem key={"updated_at"} value={"updated_at"}>
                Sắp xếp theo gần đây nhất
              </SelectItem>
              <SelectItem key={"name"} value={"name"}>
                Sắp xếp theo thứ tự bảng chữ cái
              </SelectItem>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default SortBoard;
