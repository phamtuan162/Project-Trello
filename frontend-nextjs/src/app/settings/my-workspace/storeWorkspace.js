"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { userSlice } from "@/stores/slices/userSlice";
import { myWorkspacesSlice } from "@/stores/slices/myWorkspacesSlice";
import { restoreWorkspaceApi } from "@/services/workspaceApi";
const { restoreMyWorkspaces } = userSlice.actions;
const { updateMyWorkspaces } = myWorkspacesSlice.actions;
const RestoreWorkspace = ({ workspace, children }) => {
  const dispatch = useDispatch();
  const my_workspaces = useSelector(
    (state) => state.my_workspaces.my_workspaces
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleRestoreWorkspace = async () => {
    try {
      toast
        .promise(async () => await restoreWorkspaceApi(workspace.id), {
          pending: "Đang khôi phục...",
        })
        .then(() => {
          const workspacesUpdated = my_workspaces.map((w) => {
            if (+w.id === +workspace.id) {
              return { ...w, deleted_at: null };
            }
            return w;
          });
          dispatch(updateMyWorkspaces(workspacesUpdated));
          dispatch(restoreMyWorkspaces(workspace));
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
              Khi bạn khôi phục một Không gian làm việc, tất cả các thông tin và
              hoạt động liên quan đến Không gian làm việc đó sẽ được khôi phục
              hoặc kích hoạt lại. Điều này bao gồm các thành viên, nhiệm vụ,
              hoạt động , bảng làm việc và các công việc.
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
