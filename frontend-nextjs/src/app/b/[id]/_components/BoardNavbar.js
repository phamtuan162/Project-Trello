"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { BoardOptions } from "./BoardOptions";
export default function BoardNavbar({ board, updateBoard }) {
  const inputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onUpdateTitle = async () => {
    const title = inputRef.current.value.trim();

    if (title && title !== board.title.trim()) {
      updateBoard(board.id, { title: title });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      inputRef.current.blur();
    }
  };

  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed  flex items-center px-6 gap-x-4 ">
      <div className="h-[40px]">
        {isEditing ? (
          <Input
            defaultValue={board?.title}
            className=" rounded-md focus-visible:border-sky-600 h-full "
            onBlur={() => onUpdateTitle()}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            size="xs"
            style={{ fontSize: "18px" }}
          />
        ) : (
          <Button
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2 text-white hover:bg-default-400"
            onClick={() => setIsEditing(!isEditing)}
          >
            {board?.title}
          </Button>
        )}
      </div>

      <div className="ml-auto text-white">
        <BoardOptions board={board} />
      </div>
    </div>
  );
}
