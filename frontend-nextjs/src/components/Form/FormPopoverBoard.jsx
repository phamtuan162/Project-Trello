"use client";
import { useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import FormPicker from "./FormPicker";
import { CloseIcon } from "../Icon/CloseIcon";
export default function FormPopoverBoard({
  children,
  placement = "bottom",
  open,
  ...props
}) {
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(open);
  const workspaces = [
    {
      name: "Frontend",
      value: "frontend",
    },
    {
      name: "Backend",
      value: "backend",
    },
    {
      name: "Fullstack",
      value: "fullstack",
    },
  ];
  const onSubmit = (formData) => {
    console.log(formData.get("image"));
  };
  return (
    <Popover
      placement={placement}
      className="w-[304px]"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      {...props}
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
          <form className="px-1 py-2 w-full" action={onSubmit}>
            <div className="flex justify-between items-center	relative">
              <h1 className="grow text-center text-lg">Tạo Bảng</h1>
              <Button
                className="min-w-3 rounded-lg bg-white hover:bg-default-300 text-xs p-1 absolute right-0 h-auto"
                onClick={() => setIsOpen(!isOpen)}
                ref={closeRef}
              >
                <CloseIcon />
              </Button>
            </div>

            <div className="mb-2">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Phông nền
              </p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <FormPicker id="image" />
              </div>
            </div>

            <div className="mb-2">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Tiêu đề bảng<span style={{ color: "red" }}>*</span>
              </p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Input size="xs" variant="bordered" aria-label="input-label" />
              </div>
            </div>

            <div className="mb-2">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Không gian làm việc
              </p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Select
                  defaultSelectedKeys={["frontend"]}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                >
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.value} value={workspace.value}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mb-2">
              <p
                className="text-small font-bold text-foreground"
                {...titleProps}
              >
                Quyền xem
              </p>
              <div className="mt-2 flex flex-col gap-2 w-full">
                <Select
                  defaultSelectedKeys={["backend"]}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                >
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.value} value={workspace.value}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Button color="primary" type="submit" className="w-full">
              Tạo mới
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
