"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { ListOptions } from "./ListOptions";
import { boardSlice } from "@/stores/slices/boardSlice";
import { updateColumnDetail } from "@/services/workspaceApi";

const { updateColumnInBoard } = boardSlice.actions;

export function ListHeader({ column }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    try {
      const title = inputRef.current.value.trim();

      if (title.length < 6) {
        toast.info("Tiêu đề phải dài hơn 6 ký tự!");
        return;
      }

      if (title === column.title.trim()) {
        setIsEditing(false);
        return;
      }

      dispatch(updateColumnInBoard({ id: column.id, title: title }));

      setIsEditing(false);

      await updateColumnDetail(column.id, {
        title: title,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
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
