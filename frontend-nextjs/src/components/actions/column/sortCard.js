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
const { updateColumn } = columnSlice.actions;
const SortCard = ({ children, column }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([column.order || "asc"])
  );
  const board = useSelector((state) => state.board.board);
  const columns = useSelector((state) => state.column.columns);
  const sortCardsByName = (order) => {
    const sortedCards = [...column.cards].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((item) => item.id),
    };

    const updatedColumns = columns.map((item) => {
      return item.id === column.id ? sortedColumn : item;
    });

    updateColumnDetail(column.id, {
      order: order,
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
      return item.id === column.id ? sortedColumn : item;
    });

    updateColumnDetail(column.id, {
      order: order,
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

  const sortCardsByEndDate = (order) => {
    const sortedCards = [...column.cards].sort((a, b) => {
      // Sắp xếp thẻ có ngày kết thúc trước
      if (a.endDateTime && b.endDateTime) {
        return new Date(a.endDateTime) - new Date(b.endDateTime);
      }
      // Nếu chỉ có một trong hai thẻ có ngày kết thúc
      if (a.endDateTime) return -1;
      if (b.endDateTime) return 1;
      // Nếu cả hai thẻ không có ngày kết thúc, sắp xếp theo tên
      return a.title.localeCompare(b.title);
    });

    const sortedColumn = {
      ...column,
      cards: sortedCards,
      cardOrderIds: sortedCards.map((item) => item.id),
    };

    const updatedColumns = columns.map((item) => {
      return item.id === column.id ? sortedColumn : item;
    });

    updateColumnDetail(column.id, {
      order: order,
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
  const options = [
    {
      order: "desc",
      label: "Ngày tạo (Gần Nhất Trước)",
      function: sortCardsByCreatedAt,
    },
    {
      order: "asc",
      label: "Ngày tạo (Xa Nhất Trước)",
      function: sortCardsByCreatedAt,
    },
    {
      order: "name",
      label: "Tên thẻ (theo thứ tự bảng chữ cái)",
      function: sortCardsByName,
    },
    {
      order: "endDateTime",
      label: "Ngày hết hạn",
      function: sortCardsByEndDate,
    },
  ];

  const handleSort = useCallback(() => {
    const order = [...selectedKeys][0];
    const option = options.find((item) => item.order === order);
    option.function(order);
  }, [selectedKeys]);

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
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {options.map((option) => (
                <ListboxItem key={option.order} onClick={() => handleSort()}>
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
