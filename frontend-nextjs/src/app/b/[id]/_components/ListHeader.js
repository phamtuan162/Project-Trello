"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { ListOptions } from "./ListOptions";
import { boardSlice } from "@/stores/slices/boardSlice";
import { updateColumnDetail } from "@/services/workspaceApi";
import { socket } from "@/socket";

const { updateColumnInBoard } = boardSlice.actions;

export function ListHeader({ column }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(column?.title || "");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    try {
      if (value.length < 6) {
        toast.info("Tiêu đề phải dài hơn 6 ký tự!");
        return;
      }

      if (value === column.title.trim()) {
        setIsEditing(false);
        return;
      }

      dispatch(updateColumnInBoard({ id: column.id, title: value }));

      setIsEditing(false);

      await updateColumnDetail(column.id, {
        title: value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
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
            value={value}
            className="h-full text-lg rounded-md focus-visible:border-sky-600 w-full pl-3"
            style={{ border: "none" }}
            onBlur={() => onUpdateTitle()}
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue(e.target.value)}
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
