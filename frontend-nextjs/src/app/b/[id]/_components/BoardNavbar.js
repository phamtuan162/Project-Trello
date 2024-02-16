"use client";
import { BoardTitleForm } from "./BoardTitleForm";
import { BoardOptions } from "./BoardOptions";
export default function BoardNavbar({ board }) {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed  flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm board={board} />
      <div className="ml-auto">
        <BoardOptions board={board} />
      </div>
    </div>
  );
}
