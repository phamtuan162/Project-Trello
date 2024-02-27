"use client";
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
import { useParams, redirect } from "next/navigation";
export function BoardOptions({ board }) {
  const { id: boardId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const DeleteBoard = async () => {
    toast.warning("Bạn có chắc chắn muốn xóa bảng này đi ", {
      onClick: async () => {
        await deleteBoard(board.id);
        toast.success("Xóa thành công");
        window.location.href = `/w/${board.workspace_id}`;
      },
    });
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
          Board actions
        </div>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className="min-w-3 rounded-lg border-0  hover:bg-default-300 text-xs p-1 absolute right-1 h-auto top-1"
        >
          <CloseIcon />
        </Button>
        <Button
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          onClick={() => DeleteBoard()}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
}
