"use client";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { ListOptions } from "./ListOptions";
export function ListHeader({ column, createNewCard, updateColumn }) {
  const user = useSelector((state) => state.user.user);
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = useCallback(async () => {
    const title = inputRef.current.value.trim();

    if (title !== column.title.toString().trim()) {
      await updateColumn(column.id, { title: title });
    }
    setIsEditing(false);
  }, [inputRef]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      inputRef.current.blur();
    }
  }, []);
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
        <ListOptions column={column} createNewCard={createNewCard} />
      )}
    </div>
  );
}
