"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";

import BoardOptions from "./BoardOptions";
import TitleBoard from "./TitleBoard";
import UsersVisitBoard from "./UsersVisitBoard";
import BreadcrumbsBoard from "./BreadcrumbsBoard";

import { socket } from "@/socket";
import useSocketEvents from "@/hooks/useSocketEvents";

const { updateBoard, updateCardInBoard, deleteCardInBoard } =
  boardSlice.actions;
const { updateBoardInWorkspace } = workspaceSlice.actions;
const { updateCard, clearAndHideCard } = cardSlice.actions;

export default function BoardNavbar() {
  const dispatch = useDispatch();
  const { id: boardId } = useParams();

  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);

  const handleBoardUpdated = (data) => {
    if (!data) return;

    dispatch(updateBoard(data));

    if (data.title) {
      dispatch(updateBoardInWorkspace({ id: boardId, ...data }));
    }
  };

  const handleCardUpdated = (data) => {
    if (!data) return;

    dispatch(updateCardInBoard(data));

    if (card && +card?.id === +data?.id) {
      dispatch(updateCard(data));
    }
  };

  const handleResultDeleteCard = (data) => {
    if (!data) return;

    dispatch(deleteCardInBoard(data));

    if (card && +card?.id === +data?.id) {
      dispatch(clearAndHideCard());
      toast.info("Card này đã bị xóa hoặc di chuyển sang board khác");
    }
  };

  useSocketEvents([
    { event: "getBoardUpdated", handler: handleBoardUpdated },
    { event: "getCardUpdated", handler: handleCardUpdated },
    { event: "resultDeleteCard", handler: handleResultDeleteCard },
  ]);

  if (!board?.id || +board?.id !== +boardId) {
    return null;
  }

  return (
    <div
      className="w-full h-12 z-[40] absolute  flex items-center px-6 gap-x-4 "
      style={{ backdropFilter: "blur(4px)", background: "#0000003d" }}
    >
      <TitleBoard />
      <BreadcrumbsBoard />
      <div className="ml-auto text-white flex gap-3 items-center ">
        <UsersVisitBoard />
        <BoardOptions />
      </div>
    </div>
  );
}
