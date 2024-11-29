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
import { workspaceSlice } from "@/stores/slices/workspaceSlice";

import { deleteBoard } from "@/services/workspaceApi";
import { useRouter } from "next/navigation";

const { updateWorkspace } = workspaceSlice.actions;

const DeleteBoard = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const workspace = useSelector((state) => state.workspace.workspace);

  const handleDeleteColumn = async () => {
    setIsLoading(true);

    try {
      await toast
        .promise(async () => await deleteBoard(board.id), {
          pending: "Đang xóa...",
        })
        .then(() => {
          const boardsUpdate =
            workspace?.boards?.filter((item) => +item.id !== +board.id) || [];

          dispatch(updateWorkspace({ boards: boardsUpdate }));

          router.push(`/w/${board.workspace_id}/boards`);
          toast.success("Xóa thành công");
          //   const users = workspace.users.filter(
          //     (item) => +item.id !== +user.id
          //   );

          //   if (users.length > 0)
          //     for (const userItem of users) {
          //       socket.emit("sendNotification", {
          //         user_id: userItem.id,
          //         userName: user.name,
          //         userAvatar: user.avatar,
          //         type: "delete_board",
          //         content: `đã xóa Bảng ${board.title} ra khỏi Không gian làm việc ${workspace.name} `,
          //       });
          //     }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Popover
      placement="left"
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
              Xóa danh sách thẻ
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
              Khi bạn xóa bảng, tất cả các thông tin và hoạt động liên quan đến
              bảng sẽ bị xóa hoặc ngưng lại. Khi bảng đã bị loại bỏ, bạn sẽ
              không còn thấy nó xuất hiện trên Không gian làm việc.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2 interceptor-loading"
              color="danger"
              isDisabled={
                (user?.role?.toLowerCase() !== "admin" &&
                  user?.role?.toLowerCase() !== "owner") ||
                isLoading
              }
              onClick={() => handleDeleteColumn()}
            >
              {isLoading ? <CircularProgress /> : "Xóa bảng"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteBoard;
