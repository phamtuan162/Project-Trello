"use client";
import { useState, useEffect, useRef } from "react";
import { Input, Button } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { socket } from "@/socket";

const { updateBoard } = boardSlice.actions;
const { updateBoardInWorkspace } = workspaceSlice.actions;

const TitleBoard = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const board = useSelector((state) => state.board.board);
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
        toast.error("Tiêu đề phải dài hơn 6 ký tự!");
        return;
      }

      if (title === board.title.trim()) {
        setIsEditing(false);
        return;
      }

      await toast
        .promise(
          async () =>
            await updateBoardDetail(board.id, {
              title: title,
            }),
          { pending: "Đang cập nhật..." }
        )
        .then((res) => {
          dispatch(
            updateBoard({
              title: title,
            })
          );

          dispatch(updateBoardInWorkspace({ id: board.id, title: title }));

          toast.success("Cập nhật thành công");

          socket.emit("updateBoard", { title: title });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      inputRef.current.blur();
    }
  };

  return (
    <div className="h-[40px] flex item-center">
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
          onClick={() => setIsEditing(true)}
        >
          {board?.title}
        </Button>
      )}
    </div>
  );
};

export default TitleBoard;
