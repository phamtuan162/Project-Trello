"use client";
import { useRouter } from "next/navigation";
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
  CircularProgress,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormPicker from "./FormPicker";
import { CloseIcon } from "../Icon/CloseIcon";
import { createBoard } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
const { updateWorkspace } = workspaceSlice.actions;
export default function FormPopoverBoard({
  children,
  workspaces,
  placement = "top",
  open,
  length,
  ...props
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(open);
  const [isCreate, setIsCreate] = useState(false);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const onSubmit = (formData) => {
    setIsCreate(true);
    const image = formData.get("image");
    const workspace_id = formData.get("workspace");
    const title = formData.get("title");
    const status = formData.get("status");

    createBoard({
      background: image,
      title: title,
      workspace_id: workspace_id,
      status: status,
    }).then((data) => {
      if (data.status === 200) {
        const board = data.data;
        let updatedBoards = [];
        if (Array.isArray(workspace.boards) && workspace.boards.length > 0) {
          updatedBoards = [...workspace.boards, board];
        } else {
          updatedBoards = [board];
        }

        const updatedWorkspace = {
          ...workspace,
          boards: updatedBoards,
          activities:
            workspace.activities.length > 0
              ? [...workspace.activities, board.activities]
              : [board.activities],
        };
        console.log(updateWorkspace.activities);
        dispatch(updateWorkspace(updatedWorkspace));
        toast.success("Thêm bảng thành công");
        // router.push(`/b/${board.id}`);
      } else {
        const error = data.error;
        toast.error(error);
      }
      setIsCreate(false);
    });
  };

  return (
    <Popover
      placement={placement}
      className={`w-[250px] border-0 ${
        length >= 4 ? "-translate-y-[60px]" : ""
      } `}
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
              <h1 className="grow text-center ">Tạo Bảng</h1>
              <Button
                className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
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
                  {user?.workspaces?.map((workspace) => (
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
                  name="status"
                  defaultSelectedKeys={["private"]}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                  id="mode"
                >
                  <SelectItem
                    name="status"
                    key={"private"}
                    value={"private"}
                    id="mode_private"
                  >
                    Riêng tư
                  </SelectItem>
                  <SelectItem
                    name="status"
                    key={"public"}
                    value={"public"}
                    id="public"
                  >
                    Công khai
                  </SelectItem>
                </Select>
              </div>
            </div>

            <Button
              isDisabled={
                user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner"
              }
              color="primary"
              type="submit"
              className="w-full"
            >
              {isCreate ? (
                <CircularProgress aria-label="Loading..." size={22} />
              ) : (
                "Tạo mới"
              )}
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
