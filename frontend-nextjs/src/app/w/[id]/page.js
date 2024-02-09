import { BoardList } from "./_components/BoardList";
import { Info } from "./_components/Info";
import { Suspense } from "react";

export default function WorkspaceIdPage() {
  return (
    <div className="w-full mb-20">
      <div className="mb-4">
        <Info />
      </div>

      <hr />
      <div className="px-2 md:px-4 mt-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
}
