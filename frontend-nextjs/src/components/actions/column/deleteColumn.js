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

import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { deleteColumn } from "@/services/workspaceApi";

const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;

const DeleteColumn = ({ children, column }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);

  const handleDeleteColumn = async () => {
    setIsLoading(true);

    const columnsUpdate = board.columns.filter((c) => c.id !== column.id);

    const newBoard = {
      ...board,
      columns: columnsUpdate,
      columnOrderIds: board.columnOrderIds.filter((id) => id !== column.id),
    };

    try {
      const { data, status, error, message } = await deleteColumn(column.id);
      if (200 <= status && status <= 299) {
        dispatch(updateBoard(newBoard));
        toast.success("Bạn đã xóa danh sách này thành công");
        dispatch(updateColumn(columnsUpdate));
      } else {
        toast.error(error || message);
      }
    } catch (error) {
      console.log("Error deleting column:", error);
    } finally {
      setIsLoading(false);
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
              Khi bạn xóa danh sách thẻ, tất cả các thông tin và hoạt động liên
              quan đến danh sách sẽ bị xóa hoặc ngưng lại. Khi danh sách thẻ đã
              bị loại bỏ, bạn sẽ không còn thấy nó xuất hiện trên bảng làm việc.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2"
              color="danger"
              isDisabled={
                (user?.role?.toLowerCase() !== "admin" &&
                  user?.role?.toLowerCase() !== "owner") ||
                isLoading
              }
              onClick={() => handleDeleteColumn()}
            >
              {isLoading ? <CircularProgress /> : "Xóa danh sách thẻ"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteColumn;
