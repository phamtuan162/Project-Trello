"use client";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import MissionRecent from "./missionRecent";
const MissionsRecent = () => {
  const { id } = useParams();
  const missions = useSelector((state) => state.mission.missions);
  const missionsRecent = useMemo(() => {
    if (missions?.length > 0) {
      const missionsCopy = [...missions];

      return missionsCopy
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    }
    return [];
  }, [missions]);
  return (
    <div className="border-1 border-solid rounded-lg border-default-200 p-2 px-4 flex flex-col">
      <h2>Nhiệm vụ gần đây</h2>

      <ol className="space-y-2 mt-2 flex flex-col grow">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có hoạt động nào gần đây
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
              Xem thêm
            </button>
          </div>
        )}
      </ol>
    </div>
  );
};

export default MissionsRecent;