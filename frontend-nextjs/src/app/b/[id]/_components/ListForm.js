"use client";
import { Input, Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";

import { AddIcon } from "@/components/Icon/AddIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useSelector, useDispatch } from "react-redux";
import { createColumn } from "@/services/workspaceApi";
import { generatePlaceholderCard } from "@/utils/formatters";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateBoard } = boardSlice.actions;

export function ListForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);

  const inputRef = useRef(null);
  const btnAddRef = useRef(null);
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    if (inputRef.current && isCreate) {
      inputRef.current.focus();
    }
  }, [isCreate]);

  const createNewColumn = async () => {
    const trimmedValue = inputRef.current.value.trim();

    if (trimmedValue.length < 3) {
      toast.error("Title cột phải ít nhất 3 ký tự");
      return;
    }

    try {
      const { data, status, error } = await createColumn({
        title: trimmedValue,
        board_id: board.id,
      });

      if (200 <= status && status <= 299) {
        const createdColumn = data;
        const placeholderCard = generatePlaceholderCard(createdColumn);
        createdColumn.cards = [placeholderCard];
        createdColumn.cardOrderIds = [placeholderCard.id];

        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.concat(createdColumn);
        newBoard.columnOrderIds = newBoard.columnOrderIds.concat(
          createdColumn.id
        );

        dispatch(updateBoard(newBoard));
        toast.success("Tạo danh sách thành công");
      } else {
        toast.error(error);
      }
    } catch (error) {
      console.log("Error creating new column:", error);
    } finally {
      setIsCreate(false);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await createNewColumn();
    }
  };

  if (
    user?.role?.toLowerCase() !== "admin" &&
    user?.role?.toLowerCase() !== "owner"
  ) {
    return null;
  }

  return (
    <li className="shrink-0 h-full w-[272px] select-none   ">
      {isCreate ? (
        <>
          <div
            className="fixed z-40 "
            style={{ inset: "0" }}
            onClick={() => setIsCreate(false)}
          ></div>
          <form className="w-full rounded-md bg-[#f1f2f4] shadow-md p-2 relative  z-50 column">
            <Input
              isRequired
              ref={inputRef}
              size={"sm"}
              variant={"bordered"}
              type="text"
              placeholder="Nhập tiêu đề..."
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                type="button"
                color="primary"
                ref={btnAddRef}
                onClick={() => createNewColumn()}
              >
                Thêm danh sách
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="min-w-3 rounded-lg bg-inherit hover:bg-default-300 text-xs p-2 border-0"
                onClick={() => setIsCreate(!isCreate)}
              >
                <CloseIcon />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <button
          className="column w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm relative  z-50"
          onClick={() => setIsCreate(true)}
        >
          <AddIcon />
          <span className="ml-2">Thêm danh sách khác</span>
        </button>
      )}
    </li>
  );
}
