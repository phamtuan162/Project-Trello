"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { ListOptions } from "./ListOptions";
import { boardSlice } from "@/stores/slices/boardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { updateColumnDetail } from "@/services/workspaceApi";

const { updateBoard } = boardSlice.actions;
const { updateColumn } = columnSlice.actions;
export function ListHeader({ column }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    const title = inputRef.current.value.trim();

    if (title !== column.title.toString().trim()) {
      try {
        const { data, status, error } = await updateColumnDetail(column.id, {
          title: title,
        });
        if (200 <= status && status <= 299) {
          const updatedColumn = data;
          const updatedColumns = board.columns.map((column) =>
            column.id === updatedColumn.id ? updatedColumn : column
          );

          const updatedBoard = {
            ...board,
            columns: updatedColumns.map((c) => {
              if (c.id === column.id) {
                return {
                  ...c,
                  cards: mapOrder(c.cards, c.cardOrderIds, "id"),
                };
              }
              return c;
            }),
          };

          dispatch(updateBoard(updatedBoard));
          toast.success("Cập nhật thành công");
          dispatch(updateColumn(updatedColumns));
        } else {
          toast.error(error);
        }
      } catch (error) {
        console.error("Error updating column:", error);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      inputRef.current.blur();
    }
  };

  return (
    <div className=" px-2 pt-0 pb-1 text-sm font-semibold flex justify-between items-center gap-x-2">
      <div className="h-[30px] grow">
        {isEditing ? (
          <input
            ref={inputRef}
            name="title"
            id="title"
            required
            defaultValue={column.title}
            className="h-full text-lg rounded-md focus-visible:border-sky-600 w-full pl-3"
            style={{ border: "none" }}
            onBlur={() => onUpdateTitle()}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="text-lg  ml-4 w-full block"
            onClick={() => setIsEditing(!isEditing)}
          >
            {column.title}
          </span>
        )}
      </div>

      {(user?.role?.toLowerCase() === "admin" ||
        user?.role?.toLowerCase() === "owner") && (
        <ListOptions column={column} />
      )}
    </div>
  );
}
