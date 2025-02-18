"use client";
import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";

import ActivityRecent from "./activityRecent";

const ActivitiesRecent = () => {
  const router = useRouter();
  const { id } = useParams();
  const workspace = useSelector((state) => state.workspace.workspace);

  const activitiesRecent = useMemo(() => {
    if (!workspace?.activities?.length) return [];

    return workspace.activities
      .filter(({ id }) => id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  }, [workspace?.activities]);

  return (
    <div className="border-1 border-solid rounded-lg border-default-200 p-2 px-4 flex flex-col">
      <h2>Hoạt động gần đây</h2>
      <ol className="space-y-2 mt-2 flex flex-col grow">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có hoạt động nào gần đây
        </p>
        {activitiesRecent?.map((activity) => (
          <ActivityRecent key={activity.id} activity={activity} />
        ))}
        {workspace?.activities?.length > 8 && (
          <div className="w-full flex justify-center grow items-end">
            <button
              onClick={() => router.push(`/w/${id}/activity`)}
              className="p-1 px-2 inline-block text-xs m rounded-full bg-default-100"
            >
              Xem tất cả
            </button>
          </div>
        )}
      </ol>
    </div>
  );
};

export default ActivitiesRecent;
