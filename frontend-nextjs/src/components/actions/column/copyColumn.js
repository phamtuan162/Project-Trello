"use client";
import { useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  Button,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { boardSlice } from "@/stores/slices/boardSlice";
import { copyColumnApi } from "@/services/workspaceApi";
import { mapOrder } from "@/utils/sorts";
import { socket } from "@/socket";

const { updateBoard } = boardSlice.actions;

const CopyColumn = ({ children, column }) => {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(column?.title || "");
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let columnUpdate;

      const isPlaceholderExist = column.cards.some(
        (card) => card.FE_PlaceholderCard
      );

      if (isPlaceholderExist) {
        let filteredCards = column.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        columnUpdate = {
          ...column,
          cards: filteredCards,
          cardOrderIds: filteredCards.map((card) => card.id),
        };
      } else {
        columnUpdate = column;
      }

      await toast
        .promise(
          async () =>
            await copyColumnApi({
              column: columnUpdate,
              board_id: board.id,
              title: title,
            }),
          {
            pending: "Đang sao chép...",
          }
        )
        .then((res) => {
          const { data: columnUpdate } = res;

          columnUpdate.cards = mapOrder(
            columnUpdate.cards,
            columnUpdate.cardOrderIds,
            "id"
          );
          const columnsUpdate = [columnUpdate, ...board.columns];

          dispatch(
            updateBoard({
              columns: columnsUpdate,
            })
          );
          toast.success("Sao chép danh sách thành công");

          socket.emit("updateBoard", { columns: columnsUpdate });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
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
              onKeyDown={handleKeyDown}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full h-[40px] mt-2 interceptor-loading"
              color="primary"
              isDisabled={!checkRole}
            >
              Tạo danh sách
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default CopyColumn;
