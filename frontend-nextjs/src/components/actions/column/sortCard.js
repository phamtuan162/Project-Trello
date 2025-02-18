"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";

import { sortCardFunctions } from "@/utils/sorts";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { boardSlice } from "@/stores/slices/boardSlice";
import { updateColumnDetail } from "@/services/workspaceApi";
import { socket } from "@/socket";
import { cloneDeep } from "lodash";

const { updateBoard } = boardSlice.actions;

const options = [
  { order: "createdAtDesc", label: "Ngày tạo (Gần Nhất Trước)" },
  { order: "createdAtAsc", label: "Ngày tạo (Xa Nhất Trước)" },
  { order: "name", label: "Tên thẻ (theo thứ tự bảng chữ cái)" },
  { order: "endDateTime", label: "Ngày hết hạn" },
];

const SortCard = ({ children, column }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([column?.order || "asc"])
  );
  const board = useSelector((state) => state.board.board);

  const handleColumnUpdate = async (sortedColumn, order) => {
    const columns = cloneDeep(board.columns);
    const updatedColumns = columns.map((col) =>
      col.id === column.id ? sortedColumn : col
    );

    dispatch(updateBoard({ columns: updatedColumns }));

    try {
      await updateColumnDetail(column.id, {
        order,
        cardOrderIds: sortedColumn.cardOrderIds,
      });
      socket.emit("updateBoard", { columns: updatedColumns });
    } catch (err) {
      dispatch(updateBoard({ columns }));
      console.log(err);
    }
  };

  const handleSort = useCallback(() => {
    try {
      const order = [...selectedKeys][0];
      const compareFn = sortCardFunctions[order];

      const sortedCards = [...column.cards].sort(compareFn);
      const sortedColumn = {
        ...column,
        cards: sortedCards,
        cardOrderIds: sortedCards.map((card) => card.id),
      };
      handleColumnUpdate(sortedColumn, order);
    } catch (error) {
      console.log(error);
    }
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
