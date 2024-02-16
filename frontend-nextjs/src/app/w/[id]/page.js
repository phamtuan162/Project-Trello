"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BoardList } from "./_components/BoardList";
import { Info } from "./_components/Info";
import { Suspense } from "react";
import { getWorkspaceDetail } from "@/apis";
import { Skeleton } from "@nextui-org/react";
export default function WorkspaceIdPage() {
  const { id: workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorkspaceDetail(workspaceId);
      if (data) {
        setWorkspace(data.data);
      }
    };
    fetchData();
  }, []);
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
