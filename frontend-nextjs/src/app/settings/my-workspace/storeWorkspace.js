"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { userSlice } from "@/stores/slices/userSlice";
import { restoreWorkspaceApi } from "@/services/workspaceApi";

const { restoreWorkspaceInUser } = userSlice.actions;

const RestoreWorkspace = ({ workspace, children }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const handleRestoreWorkspace = async () => {
    try {
      await toast
        .promise(async () => await restoreWorkspaceApi(workspace.id), {
          pending: "Đang khôi phục...",
        })
        .then(() => {
          dispatch(restoreWorkspaceInUser(workspace));
          toast.success("Khôi phục Không gian làm việc thành công");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Popover
      placement="right"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        content: [" p-0"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-1">
            <p
              className="w-full text-center font-medium text-xs"
              style={{ color: "#44546f" }}
            >
              Khôi phục Không gian làm việc
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>
          <div
            className="px-3  p-1 cursor-pointer"
            style={{ color: "#44546f" }}
          >
            <p className="text-xs mt-1">
              Khôi phục Không gian làm việc sẽ khôi phục toàn bộ thông tin,
              thành viên, nhiệm vụ, hoạt động, và bảng liên quan.
            </p>
            <Button
              onClick={() => handleRestoreWorkspace()}
              type="button"
              className="w-full h-[40px] mt-3 interceptor-loading"
              color="danger"
            >
              Khôi phục
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default RestoreWorkspace;
