"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useMemo } from "react";
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
import { useSelector, useDispatch } from "react-redux";

import FormPicker from "./FormPicker";
import { CloseIcon } from "../Icon/CloseIcon";
import { createBoard } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";

const { createBoardInWorkspace } = workspaceSlice.actions;

export default function FormPopoverBoard({
  children,
  placement = "top",
  length,
  ...props
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const closeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const onSubmit = async (formData) => {
    const image = formData.get("image");
    const workspace_id = formData.get("workspace");
    const title = formData.get("title");

    try {
      await toast
        .promise(
          async () =>
            await createBoard({
              background: image,
              title: title,
              workspace_id: workspace_id,
            }),
          { pending: "Đang tạo...", error: "Tạo bảng thất bại!" }
        )
        .then((res) => {
          const { data, activity } = res;

          dispatch(createBoardInWorkspace({ board: data, activity: activity }));

          toast.success("Tạo bảng thành công");

          if (+workspace.id === +workspace_id) {
            router.push(`/b/${data.id}`);
          } else {
            setIsOpen(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover
      placement={placement}
      className={`w-[250px] border-0 ${
        length >= 4 ? "-translate-y-[60px]" : ""
      } `}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (checkRole) {
          setIsOpen(open);
        } else {
          toast.info("Bạn không đủ quyền thực hiện hành động này!");
        }
      }}
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
                  defaultSelectedKeys={[workspace?.id?.toString() || ""]}
                  size="xs"
                  variant="bordered"
                  aria-label="input-label"
                  name="workspace"
                  id="workspace"
                >
                  {user?.workspaces?.map((workspace) => (
                    <SelectItem
                      key={workspace?.id}
                      value={workspace?.id}
                      id={`workspace_${workspace.id}`}
                    >
                      {workspace?.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Button
              isDisabled={!checkRole}
              color="primary"
              type="submit"
              className="w-full interceptor-loading"
            >
              Tạo mới
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}
// <div className="mb-2">
// <p
//   className="text-small font-bold text-foreground"
//   {...titleProps}
// >
//   Quyền xem
// </p>
// <div className="mt-2 flex flex-col gap-2 w-full">
//   <Select
//     name="status"
//     defaultSelectedKeys={["private"]}
//     size="xs"
//     variant="bordered"
//     aria-label="input-label"
//     id="mode"
//   >
//     <SelectItem
//       name="status"
//       key={"private"}
//       value={"private"}
//       id="mode_private"
//     >
//       Riêng tư
//     </SelectItem>
//     <SelectItem
//       name="status"
//       key={"public"}
//       value={"public"}
//       id="public"
//     >
//       Công khai
//     </SelectItem>
//   </Select>
// </div>
// </div>
