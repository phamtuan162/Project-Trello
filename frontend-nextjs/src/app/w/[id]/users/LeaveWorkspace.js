"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  leaveWorkspaceApi,
  cancelUserWorkspaceApi,
} from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { socket } from "@/socket";

const { cancelUserInWorkspace, updateActivitiesInWorkspace } =
  workspaceSlice.actions;

const LeaveWorkspace = ({ user }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const userActive = useSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const [removeLinks, setRemoveLinks] = useState(false);

  const isSelfAction = +user.id === +userActive.id;

  const handleLeaveOrCancelWorkspace = async () => {
    try {
      const apiMethod = isSelfAction
        ? leaveWorkspaceApi
        : cancelUserWorkspaceApi;

      await toast
        .promise(
          async () =>
            await apiMethod({
              user_id: user.id,
              workspace_id: workspace.id,
              removeLinks: isSelfAction ? true : removeLinks,
            }),
          {
            pending: "Đang thực hiện...",
          }
        )
        .then((res) => {
          const { activity, notification } = res;
          if (isSelfAction) {
            toast.success(
              "Rời đi thành công. Bạn sẽ chuyển đến Không gian làm việc khác."
            );

            window.location.href = "/";
          } else {
            dispatch(cancelUserInWorkspace(user));
            dispatch(updateActivitiesInWorkspace(activity));
            toast.success("Loại bỏ thành viên thành công");

            socket.emit("sendNotification", {
              user_id: user.id,
              notification,
            });
          }

          socket.emit("removeUser", {
            userAction: {
              id: userActive.id,
              workspace_id_active: userActive.workspace_id_active,
            },
            userRemove: isSelfAction ? userActive : user,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (user?.role?.toLowerCase() === "owner") {
    return null;
  }

  if (
    userActive?.role?.toLowerCase() !== "admin" &&
    userActive?.role?.toLowerCase() !== "owner" &&
    !isSelfAction
  ) {
    return null;
  }

  return (
    <Popover
      placement="bottom"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        content: [" p-0"],
      }}
    >
      <PopoverTrigger>
        <button
          type="button"
          className="flex items-center gap-1 px-2 h-[30px] font-medium text-xs  w-[90px]  rounded-md focus-visible:outline-0"
          style={{ background: "#091E420F", color: "#172b4d" }}
        >
          <X size={16} className="shrink-0" />
          <p className="overflow-hidden whitespace-nowrap text-ellipsis ">
            {+userActive.id === +user.id ? "Rời đi" : "Loại bỏ thành viên"}
          </p>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-3">
            <p
              className="w-full text-center font-medium text-xs "
              style={{ color: "#44546f" }}
            >
              Loại bỏ thành viên
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>
          <div className="px-3  p-1 cursor-pointer ">
            <p className="font-normal text-sm">
              {isSelfAction
                ? "Rời Không gian làm việc"
                : "Gỡ khỏi Không gian làm việc"}
            </p>
            <p className="text-xs mt-1">
              Loại bỏ toàn bộ quyền truy cập vào Không gian làm việc này. Thành
              viên sẽ không còn liên kết với các thẻ và nhiệm vụ trong Không
              gian làm việc và sẽ không thể truy cập vào chúng.
            </p>
            {!isSelfAction && (
              <Checkbox
                size="sm"
                className="mt-1"
                isSelected={removeLinks}
                onValueChange={setRemoveLinks}
              >
                Xóa liên kết (thẻ, nhiệm vụ, v.v...)
              </Checkbox>
            )}

            <button
              onClick={() => handleLeaveOrCancelWorkspace()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg interceptor-loading mt-3"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LeaveWorkspace;
