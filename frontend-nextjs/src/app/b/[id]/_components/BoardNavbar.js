"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@nextui-org/button";
import {
  Avatar,
  AvatarGroup,
  Input,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, useParams } from "next/navigation";

import { BoardOptions } from "./BoardOptions";
import { updateBoardDetail } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { toast } from "react-toastify";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { DashBoardIcon } from "@/components/Icon/DashBoardIcon";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";

const { updateBoard } = boardSlice.actions;
const { updateBoardInWorkspace } = workspaceSlice.actions;

const options = [
  {
    href: "",
    key: "board",
    label: "Bảng Kanban",
    icon: <BoardIcon size={16} />,
  },
  {
    href: "/dashboard",
    key: "dashboard",
    label: "Báo cáo",
    icon: <DashBoardIcon size={16} />,
  },
];

export default function BoardNavbar({ setIsActivity }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: boardId } = useParams();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(
    pathname.includes("dashboard") ? "dashboard" : "board"
  );
  const inputRef = useRef(null);
  const btnRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useSelector((state) => state.board.board);
  const socket = useSelector((state) => state.socket.socket);
  const [userVisit, setUserVisit] = useState([]);

  const usersVisitBoard = useMemo(() => {
    if (userVisit.length > 0 && workspace?.users?.length > 0) {
      return workspace.users.filter(
        (user) =>
          user.isOnline && userVisit.find((item) => +item.id === +user.id)
      );
    }
  }, [userVisit, workspace?.users]);

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
      inputRef.current.blur();
    }
  };

  // useEffect(() => {
  //   const handleUserVisitBoard = (data) => {
  //     if (data.length > 0) {
  //       setUserVisit(data);
  //     }
  //   };

  //   if (socket) {
  //     socket.on("getUserVisitBoard", handleUserVisitBoard);

  //     return () => {
  //       socket.off("getUserVisitBoard", handleUserVisitBoard);
  //     };
  //   }
  // }, [socket]);

  if (!board.id || +board.id !== +boardId) {
    return null;
  }

  return (
    <div
      className="w-full h-12 z-[40] absolute  flex items-center px-6 gap-x-4 "
      style={{ backdropFilter: "blur(4px)", background: "#0000003d" }}
    >
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
            ref={btnRef}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2 text-white hover:bg-default-400"
            onClick={() => setIsEditing(!isEditing)}
          >
            {board?.title}
          </Button>
        )}
      </div>
      <Breadcrumbs
        onAction={(key) => setCurrentPage(key)}
        classNames={{
          list: "gap-2",
        }}
        itemClasses={{
          item: [
            "p-1.5 rounded-md text-white ",
            "data-[current=true]:border-foreground data-[current=true]:bg-gray-200 data-[current=true]:text-indigo-950 transition-colors",
            "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-gray-200 focus:outline-none",
          ],
          separator: "hidden",
        }}
      >
        {options.map((option) => (
          <BreadcrumbItem
            key={option.key}
            isCurrent={currentPage === option.key}
            onClick={() => router.push(`/b/${board.id}${option.href}`)}
            className="option"
            startContent={option.icon}
          >
            {option.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <div className="ml-auto text-white flex gap-3 items-center ">
        <AvatarGroup isBordered max={2} className="group-avatar-1">
          {usersVisitBoard?.map((user) => (
            <Avatar
              key={user?.id}
              src={user.avatar}
              name={user?.name?.charAt(0).toUpperCase()}
              color="secondary"
            />
          ))}
        </AvatarGroup>
        <BoardOptions setIsActivity={setIsActivity} board={board} />
      </div>
    </div>
  );
}
