"use client";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import MissionRecent from "./missionRecent";
const MissionsRecent = () => {
  const router = useRouter();
  const { id } = useParams();
  const missions = useSelector((state) => state.mission.missions);

  const missionsRecent = useMemo(() => {
    const missionsCopy = missions?.filter((item) => item.card_id) || [];

    return missionsCopy
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [missions]);

  return (
    <div className="border-1 border-solid rounded-lg border-default-200 p-2 px-4 flex flex-col">
      <h2>Nhiệm vụ gần đây</h2>

      <ol className="space-y-2 mt-2 flex flex-col grow">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có nhiệm vụ nào gần đây
        </p>
        {missionsRecent?.map((mission) => (
          <MissionRecent key={mission.id} mission={mission} />
        ))}

        {missions?.length > 3 && (
          <div className="w-full flex justify-center grow items-end">
            <button
              onClick={() => router.push(`/w/${id}/missions`)}
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

export default MissionsRecent;
