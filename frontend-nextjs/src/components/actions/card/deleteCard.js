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
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { deleteCardApi } from "@/services/workspaceApi";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import useCardModal from "@/hooks/use-card-modal";
const { updateBoard } = boardSlice.actions;
const { updateCard } = cardSlice.actions;
const { updateColumn } = columnSlice.actions;
const DeleteCard = ({ children }) => {
  const dispatch = useDispatch();
  const cardModel = useCardModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const HandleDeleteCard = () => {
    setIsLoading(true);
    const newBoard = { ...board };

    const nextColumns = cloneDeep(newBoard.columns);
    const activeColumn = nextColumns.find(
      (column) => +column.id === +card.column_id
    );
    if (activeColumn) {
      activeColumn.cards = activeColumn.cards.filter(
        (item) => item.id !== card.id
      );
      activeColumn.cardOrderIds = activeColumn.cards.map((item) => item.id);
    }

    const dndOrderedColumnsIds = nextColumns.map((c) => c.id);
    newBoard.columns = [...nextColumns];
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    deleteCardApi(card.id).then((data) => {
      if (data.status === 200) {
        dispatch(updateBoard(newBoard));
        dispatch(updateCard([]));
        dispatch(updateColumn(nextColumns));
        cardModel.onClose();
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
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
              Xóa thẻ
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
              Khi bạn xóa một thẻ, tất cả các thông tin và hoạt động liên quan
              đến thẻ đó sẽ bị xóa hoặc ngưng lại. Điều này bao gồm tiêu đề, mô
              tả, ngày hết hạn, bình luận và các tệp đính kèm... Khi thẻ đã bị
              loại bỏ, bạn sẽ không còn thấy nó xuất hiện trong danh sách công
              việc hoặc trên bảng làm việc.
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
              onClick={() => HandleDeleteCard()}
            >
              {isLoading ? <CircularProgress /> : "Xóa thẻ"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteCard;
