"use client";
import { Trash, Image } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";
import { ActivityIcon } from "lucide-react";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteBoard } from "@/services/workspaceApi";
import { useRouter } from "next/navigation";
import FormBackground from "@/components/Form/FormBackground";
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { useDispatch, useSelector } from "react-redux";
const { updateBoard } = boardSlice.actions;
export function BoardOptions({ setIsActivity }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const board = useSelector((state) => state.board.board);
  const DeleteBoard = async () => {
    toast.warning("Bạn có chắc chắn muốn xóa bảng này đi ", {
      onClick: async () => {
        deleteBoard(board.id).then((data) => {
          if (data.status === 200) {
            router.push(`/w/${board.workspace_id}/boards`);
          } else {
            const error = data.error;
            toast.error(error);
          }
        });
      },
    });
  };
  const HandleBackground = async (formData) => {
    setIsLoading(true);
    const image = formData.get("image");
    if (image) {
      updateBoardDetail(board.id, { background: image }).then((data) => {
        if (data.status === 200) {
          dispatch(updateBoard({ ...board, background: image }));
          setIsLoading(false);
          setIsOpen(false);
        }
      });
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
        <Button
          style={{ color: "#172b4d" }}
          className="text-xs font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
          onClick={() => DeleteBoard()}
        >
          <Trash size={16} /> Xoá Bảng
        </Button>

        <FormBackground
          HandleBackground={HandleBackground}
          isLoading={isLoading}
        >
          <Button
            style={{ color: "#172b4d" }}
            className="mt-2 text-xs font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
          >
            <Image size={16} /> Thay đổi hình nền
          </Button>
        </FormBackground>

        <Button
          onClick={() => {
            setIsActivity(true);
            setIsOpen(false);
          }}
          style={{ color: "#172b4d" }}
          className="mt-2 text-xs font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
        >
          <ActivityIcon size={16} /> Hoạt động
        </Button>
      </PopoverContent>
    </Popover>
  );
}
