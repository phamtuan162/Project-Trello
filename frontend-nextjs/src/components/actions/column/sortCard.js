"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { updateColumnDetail } from "@/services/workspaceApi";
const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;
const SortCard = ({ children, column }) => {
  console.log(column);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const board = useSelector((state) => state.board.board);
  const columns = useSelector((state) => state.column.columns);
  console.log(columns);
  const sortCardsByName = () => {
    const sortedCards = [...column.cards].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((item) => item.id),
    };

    const updatedColumns = columns.map((item) => {
      if (item.id === column.id) {
        return sortedColumn;
      }
      return item;
    });

    updateColumnDetail(column.id, {
      cardOrderIds: sortedColumn.cardOrderIds,
    }).then((data) => {
      if (data.status === 200) {
        dispatch(updateBoard({ ...board, columns: updatedColumns }));
        toast.success("Sắp xếp thành công");

        dispatch(updateColumn(updatedColumns));
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  const sortCardsByCreatedAt = (order = "asc") => {
    const ascending = order === "asc";
    console.log(ascending);
    const sortedCards = [...column.cards].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return ascending ? dateA - dateB : dateB - dateA;
    });

    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((item) => item.id),
    };

    const updatedColumns = columns.map((item) => {
      if (item.id === column.id) {
        return sortedColumn;
      }
      return item;
    });

    updateColumnDetail(column.id, {
      cardOrderIds: sortedColumn.cardOrderIds,
    }).then((data) => {
      if (data.status === 200) {
        dispatch(updateBoard({ ...board, columns: updatedColumns }));
        toast.success("Sắp xếp thành công");

        dispatch(updateColumn(updatedColumns));
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };
  const sortCardsByEndDate = () => {
    const sortedCardsWithEndDate = column.cards
      .filter((card) => card.endDateTime)
      .sort((a, b) => {
        return new Date(a.endDateTime) - new Date(b.endDateTime);
      });

    const sortedCardsWithoutEndDate = column.cards
      .filter((card) => !card.endDateTime)
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });

    const sortedCards = [
      ...sortedCardsWithEndDate,
      ...sortedCardsWithoutEndDate,
    ];

    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((item) => item.id),
    };

    const updatedColumns = columns.map((item) => {
      if (item.id === column.id) {
        return sortedColumn;
      }
      return item;
    });

    updateColumnDetail(column.id, {
      cardOrderIds: sortedColumn.cardOrderIds,
    }).then((data) => {
      if (data.status === 200) {
        dispatch(updateBoard({ ...board, columns: updatedColumns }));
        toast.success("Sắp xếp thành công");
        dispatch(updateColumn(updatedColumns));
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };

  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      classNames={{
        content: ["p-0 py-2"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[260px]">
        <div className="w-full">
          <div className="flex justify-between items-center relative  ">
            <h1 className="grow text-center font-medium text-xs">
              Sắp xếp danh sách
            </h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-2 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-3">
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer"
              onClick={() => sortCardsByCreatedAt("asc")}
            >
              Ngày tạo (Gần Nhất Trước)
            </div>
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer"
              onClick={() => sortCardsByCreatedAt("desc")}
            >
              Ngày tạo (Xa Nhất Trước)
            </div>
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer"
              onClick={() => sortCardsByName()}
            >
              Tên thẻ (theo thứ tự bảng chữ cái)
            </div>
            <div
              className=" p-2 hover:bg-default-200 px-3 rounded-sm cursor-pointer"
              onClick={() => sortCardsByEndDate()}
            >
              Ngày hết hạn
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default SortCard;
