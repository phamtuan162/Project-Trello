"use client";
import React from "react";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import FormPicker from "./FormPicker";
import { CloseIcon } from "../Icon/CloseIcon";
import { createBoard } from "@/services/workspaceApi";
export default function FormPopoverBoard({
  children,
  placement = "top",
  open,
  ...props
}) {
  const { id: workspaceId } = useParams();
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(open);
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspace = workspaces.find(
    (workspace) => workspace.id === +workspaceId
  );

  // useEffect(() => {
  //   async function fetchData() {
  //     if (workspaceId) {
  //       const data = await getWorkspaceDetail(workspaceId);
  //       setWorkspace(data.data);
  //     }
  //     const data = await getWorkspace();
  //     setWorkspaces(data.data);
  //   }
  //   fetchData();
  // }, []);

  const onSubmit = (formData) => {
    const image = formData.get("image");
    const workspace_id = formData.get("workspace");
    const title = formData.get("title");

    createBoard({
      background: image,
      title: title,
      workspace_id: workspace_id,
    }).then((data) => {
      if (data) {
        toast.success("Thêm bảng thành công");
        location.href = `/b/${data.id}`;
      }
    });
  };

  return (
    <Popover
      placement={placement}
      className="w-[304px] border-0 -translate-y-1/4"
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
                className="min-w-3 rounded-lg border-0 hover:bg-default-300 text-xs p-1 absolute right-0 h-auto"
                onClick={() => setIsOpen(!isOpen)}
                ref={closeRef}
                variant="ghost"
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
                <Input
                  name="title"
                  id="title"
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                  isRequired
                />
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
                  defaultSelectedKeys={workspace ? [String(workspace.id)] : []}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                  name="workspace"
                  id="workspace"
                >
                  {workspaces?.map((workspace) => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.id}
                      id={`workspace_${workspace.id}`}
                    >
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
                  defaultSelectedKeys={["private"]}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                  id="mode"
                >
                  <SelectItem
                    key={"private"}
                    value={"private"}
                    id="mode_private"
                  >
                    Riêng tư
                  </SelectItem>
                  <SelectItem key={"public"} value={"public"} id="public">
                    Công khai
                  </SelectItem>
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
