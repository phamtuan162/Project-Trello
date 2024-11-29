"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { updateColumnDetail } from "@/services/workspaceApi";

const { updateBoard } = boardSlice.actions;
const { updateColumns } = columnSlice.actions;

const options = [
  { order: "createdAtDesc", label: "Ngày tạo (Gần Nhất Trước)" },
  { order: "createdAtAsc", label: "Ngày tạo (Xa Nhất Trước)" },
  { order: "name", label: "Tên thẻ (theo thứ tự bảng chữ cái)" },
  { order: "endDateTime", label: "Ngày hết hạn" },
];

const sortFunctions = {
  name: (a, b) => a.title.localeCompare(b.title),
  endDateTime: (a, b) => {
    if (a.endDateTime && b.endDateTime)
      return new Date(a.endDateTime) - new Date(b.endDateTime);
    return a.endDateTime
      ? -1
      : b.endDateTime
      ? 1
      : a.title.localeCompare(b.title);
  },
  createdAtAsc: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  createdAtDesc: (a, b) => new Date(b.created_at) - new Date(a.created_at),
};

const SortCard = ({ children, column }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([column.order || "asc"])
  );

  const handleColumnUpdate = async (sortedColumn, order) => {
    try {
      const updatedColumns = board.columns.map((col) =>
        col.id === column.id ? sortedColumn : col
      );

      dispatch(updateBoard({ columns: updatedColumns }));
      dispatch(updateColumns(updatedColumns));

      await updateColumnDetail(column.id, {
        order,
        cardOrderIds: sortedColumn.cardOrderIds,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const sortCards = (order, compareFn) => {
    const sortedCards = [...column.cards].sort(compareFn);
    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((card) => card.id),
    };
    handleColumnUpdate(sortedColumn, order);
  };

  const handleSort = useCallback(() => {
    const order = [...selectedKeys][0];
    const compareFn = sortFunctions[order];

    sortCards(order, compareFn);
  }, [selectedKeys]);

  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      classNames={{ content: ["p-0 py-2"] }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[260px]">
        <div className="w-full">
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center font-medium text-xs">
              Sắp xếp danh sách
            </h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300 p-1 absolute right-2 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-3">
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {options.map((option) => (
                <ListboxItem key={option.order} onClick={handleSort}>
                  {option.label}
                </ListboxItem>
              ))}
            </Listbox>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SortCard;
