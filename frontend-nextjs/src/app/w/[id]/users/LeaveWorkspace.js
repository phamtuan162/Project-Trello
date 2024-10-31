"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  leaveWorkspaceApi,
  cancelUserWorkspaceApi,
} from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";

const { cancelUser, updateActivities } = workspaceSlice.actions;

const LeaveWorkspace = ({ user }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const userActive = useSelector((state) => state.user.user);
  const socket = useSelector((state) => state.socket.socket);
  const [isOpen, setIsOpen] = useState(false);
  const handleLeaveOrCancelWorkspace = async () => {
    try {
      const isSelfAction = +user.id === +userActive.id;
      const apiMethod = isSelfAction
        ? leaveWorkspaceApi
        : cancelUserWorkspaceApi;

      const { status, data, error } = await apiMethod({
        user_id: user.id,
        workspace_id: workspace.id,
      });

      if (200 <= status && status <= 299) {
        if (isSelfAction) {
          toast.success("Rời đi thành công");
          window.location.href = "/";
        } else {
          dispatch(cancelUser(user));
          dispatch(updateActivities(data));
          toast.success("Loại bỏ thành viên thành công");
        }

        socket.emit("removeUser", {
          userActionId: userActive.id,
          userRemoveId: isSelfAction ? userActive.id : user.id,
        });

        if (!isSelfAction) {
          socket.emit("sendNotification", {
            user_id: user.id,
            userName: userActive.name,
            userAvatar: userActive.avatar,
            type: "cancel_user",
            content: `đã loại bạn khỏi Không gian làm việc ${workspace.name}`,
          });
        }
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user?.role?.toLowerCase() === "owner" && +userActive?.id !== +user.id) {
    return null;
  }

  if (
    userActive?.role?.toLowerCase() !== "admin" &&
    userActive?.role?.toLowerCase() !== "owner" &&
    +userActive?.id !== +user.id
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
              className="w-full text-center font-medium text-xs"
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
          <div
            onClick={() => handleLeaveOrCancelWorkspace()}
            className="px-3 hover:bg-default-300 p-1 cursor-pointer"
            style={{ color: "#44546f" }}
          >
            <p className="font-normal text-sm">
              {+userActive.id === +user.id
                ? "Rời Không gian làm việc"
                : " Đã gỡ khỏi Không gian làm việc"}
            </p>
            <p className="text-xs mt-1">
              Loại bỏ toàn bộ truy cập tới Không gian làm việc. Thành viên sẽ
              giữ lại tất cả các bảng của họ trong Không gian làm việc này. Họ
              sẽ nhận được thông báo.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default LeaveWorkspace;
