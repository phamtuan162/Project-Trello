"use client";
import { useSelector } from "react-redux";
import { BoardList } from "../_components/BoardList";
import { Info } from "../_components/Info";
import { Suspense } from "react";
import { Skeleton } from "@nextui-org/react";
export default function pageBoards({ params }) {
  const workspaceId = params.id;
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );
  return (
    <div className="w-full mb-20">
      <Skeleton isLoaded={workspace ? true : false}>
        <div className="mb-4">
          <Info workspace={workspace} />
        </div>
      </Skeleton>

      <hr />
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
