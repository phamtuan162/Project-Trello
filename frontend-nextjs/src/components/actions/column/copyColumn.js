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
import { mapOrder } from "@/utils/sorts";
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
    let filteredCards = column.cards.filter((card) => !card.FE_PlaceholderCard);

    const isPlaceholderExist = filteredCards.length < column.cards.length;

    const columnUpdated = isPlaceholderExist
      ? {
          ...column,
          cards: filteredCards,
          cardOrderIds: filteredCards.map((card) => card.id),
        }
      : column;

    try {
      const { data, status, error } = await copyColumnApi({
        column: columnUpdated,
        board_id: board.id,
        title: title,
      });
      if (200 <= status && status <= 299) {
        let columnUpdate = data;
        columnUpdate.cards = mapOrder(
          columnUpdate.cards,
          columnUpdate.cardOrderIds,
          "id"
        );
        let newBoard = {
          ...board,
          columns: [columnUpdate, ...board.columns],
        };

        dispatch(updateBoard(newBoard));
        toast.success("Sao chép danh sách thành công");

        setIsOpen(false);
        dispatch(updateColumn(newBoard.columns));
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log(error);
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
