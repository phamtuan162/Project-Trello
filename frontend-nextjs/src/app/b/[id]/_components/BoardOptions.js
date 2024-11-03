"use client";
import { Trash, Image } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteBoard } from "@/services/workspaceApi";
import { useRouter } from "next/navigation";
import FormBackground from "@/components/Form/FormBackground";
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { useDispatch, useSelector } from "react-redux";
const { updateBoard } = boardSlice.actions;
const { updateWorkspace } = workspaceSlice.actions;
export function BoardOptions({ setIsActivity }) {
  const socket = useSelector((state) => state.socket.socket);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const board = useSelector((state) => state.board.board);
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const DeleteBoard = async () => {
    toast.warning(
      "Xin vui lòng nhấn vào đây nếu bạn chắc chắn muốn xóa bảng này! ",
      {
        onClick: async () => {
          try {
            const { status } = await deleteBoard(board.id);
            if (200 <= status && status <= 299) {
              const users = workspace.users.filter(
                (item) => +item.id !== +user.id
              );
              const boardsUpdate =
                workspace?.boards?.filter((item) => +item.id !== +board.id) ||
                [];

              dispatch(updateWorkspace({ ...workspace, boards: boardsUpdate }));

              router.push(`/w/${board.workspace_id}/boards`);

              if (users.length > 0)
                for (const userItem of users) {
                  socket.emit("sendNotification", {
                    user_id: userItem.id,
                    userName: user.name,
                    userAvatar: user.avatar,
                    type: "delete_board",
                    content: `đã xóa Bảng ${board.title} ra khỏi Không gian làm việc ${workspace.name} `,
                  });
                }
            }
          } catch (error) {
            console.log(error);
          }
        },
      }
    );
  };
  const HandleBackground = async (formData) => {
    setIsLoading(true);
    const image = formData.get("image");
    if (!image) return;
    try {
      const { status } = await updateBoardDetail(board.id, {
        background: image,
      });
      if (200 <= status && status <= 299) {
        dispatch(updateBoard({ ...board, background: image }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <Popover
      className="min-w-[200px]"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Thao tác với Bảng
        </div>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className="min-w-3 rounded-lg border-0  hover:bg-default-300 text-xs p-1 absolute right-1 h-auto top-1"
        >
          <CloseIcon />
        </Button>
        {user?.role?.toLowerCase() === "owner" && (
          <Button
            style={{ color: "#172b4d" }}
            className="text-xs interceptor-loading font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
            onClick={() => DeleteBoard()}
          >
            <Trash size={16} /> Xoá Bảng
          </Button>
        )}

        <FormBackground
          HandleBackground={HandleBackground}
          isLoading={isLoading}
        >
          <Button
            style={{ color: "#172b4d" }}
            className="mt-2 text-xs interceptor-loading font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
          >
            <Image size={16} /> Thay đổi hình nền
          </Button>
        </FormBackground>
      </PopoverContent>
    </Popover>
  );
}
// <Button
//   onClick={() => {
//     setIsActivity(true);
//     setIsOpen(false);
//   }}
//   style={{ color: "#172b4d" }}
//   className="mt-2 text-xs font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
// >
//   <ActivityIcon size={16} /> Hoạt động
// </Button>
