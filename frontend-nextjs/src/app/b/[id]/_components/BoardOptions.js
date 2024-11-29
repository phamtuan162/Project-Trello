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
import { useRouter } from "next/navigation";
import FormBackground from "@/components/Form/FormBackground";
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import DeleteBoard from "@/components/actions/board/deleteBoard";
import { useDispatch, useSelector } from "react-redux";
const { updateBoard } = boardSlice.actions;

export function BoardOptions({}) {
  const socket = useSelector((state) => state.socket.socket);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const board = useSelector((state) => state.board.board);
  const user = useSelector((state) => state.user.user);

  const HandleBackground = async (formData) => {
    try {
      const image = formData.get("image");

      if (!image) {
        toast.info("Chưa chọn ảnh!");
        return;
      }

      await toast
        .promise(
          async () =>
            await updateBoardDetail(board.id, {
              background: image,
            }),
          { pending: "Đang cập nhật..." }
        )
        .then((res) => {
          dispatch(updateBoard({ background: image }));
          toast.success("Cập nhật ảnh nền thành công");
          setIsOpen(false);
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
          <DeleteBoard>
            <Button
              style={{ color: "#172b4d" }}
              className="text-xs interceptor-loading font-medium rounded-none w-full h-auto p-2 px-5 justify-start font-normal  flex items-center gap-2 bg-white hover:bg-default-200"
            >
              <Trash size={16} /> Xoá Bảng
            </Button>
          </DeleteBoard>
        )}

        <FormBackground HandleBackground={HandleBackground}>
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
