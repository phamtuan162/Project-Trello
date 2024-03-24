"use client";
import { useSelector } from "react-redux";
import { BoardList } from "../_components/BoardList";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";
export default function pageBoards({ params }) {
  const workspace = useSelector((state) => state.workspace.workspace);

  return (
    <div className="w-full mb-20">
      <div className="px-2 md:px-4 mt-4">
        <Skeleton isLoaded={workspace?.boards ? true : false}>
          <Suspense fallback={<BoardList.Skeleton />}>
            <BoardList boards={workspace?.boards} />
          </Suspense>
        </Skeleton>
      </div>
    </div>
  );
}
