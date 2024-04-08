"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@nextui-org/button";
import { Avatar, AvatarGroup, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { BoardOptions } from "./BoardOptions";
export default function BoardNavbar({ board, updateBoard }) {
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const workspace = useSelector((state) => state.workspace.workspace);
  const userOnline = useMemo(() => {
    return workspace?.users?.filter((user) => user.isOnline);
  }, [workspace]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  const onUpdateTitle = async () => {
    const title = inputRef.current.value.trim();

    if (title && title !== board.title.trim()) {
      await updateBoard(board.id, { title: title });
      setIsEditing(false);
    }
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
            ref={btnRef}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2 text-white hover:bg-default-400"
            onClick={() => setIsEditing(!isEditing)}
          >
            {board?.title}
          </Button>
        )}
      </div>

      <div className="ml-auto text-white flex gap-3 items-center">
        <AvatarGroup isBordered max={2} size="sm">
          {userOnline?.map((user) => (
            <Avatar
              key={user.id}
              size="sm"
              src={user.avatar}
              name={user.name.charAt(0).toUpperCase()}
              color="secondary"
            />
          ))}
        </AvatarGroup>
        <BoardOptions board={board} />
      </div>
    </div>
  );
}
