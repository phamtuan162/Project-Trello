"use client";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  CircularProgress,
  Textarea,
  Button,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { toast } from "react-toastify";
import { copyColumnApi } from "@/services/workspaceApi";
const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;
const CopyColumn = ({ children, column }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(column.title);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await copyColumnApi({
        column: column,
        board_id: board.id,
        title: title,
      });
      handleCopyColumnResponse(data);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi sao chép danh sách");
    }
    setIsLoading(false);
  };

  const handleCopyColumnResponse = (data) => {
    if (data.status === 200) {
      const columnUpdate = data.data;
      const newBoard = {
        ...board,
        columns: [columnUpdate, ...board.columns],
      };
      dispatch(updateBoard(newBoard));
      toast.success("Sao chép danh sách thành công");
      setIsOpen(false);
      dispatch(updateColumn(newBoard.columns));
    } else {
      const error = data.error;
      toast.error(error);
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
              Sao chép danh sách
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>
          <form
            className="px-3  p-1 cursor-pointer"
            style={{ color: "#44546f" }}
            onSubmit={(e) => handleSubmit(e)}
          >
            <label htmlFor="name" className="text-xs font-medium">
              Tên
            </label>

            <Textarea
              id="name"
              name="name"
              variant="bordered"
              className="w-full mt-2 text-sm rounded-sm"
              value={title}
              ref={textareaRef}
              disableAnimation
              disableAutosize
              classNames={{
                input: "resize-y min-h-[40px] h-[40px]",
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full h-[40px] mt-2"
              color="primary"
              isDisabled={
                (user?.role?.toLowerCase() !== "admin" &&
                  user?.role?.toLowerCase() !== "owner") ||
                isLoading
              }
            >
              {isLoading ? <CircularProgress /> : "Tạo danh sách"}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default CopyColumn;
