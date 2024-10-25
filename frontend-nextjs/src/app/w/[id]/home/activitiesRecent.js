"use client";
import ActivityRecent from "./activityRecent";
import { useRouter, useParams } from "next/navigation";
const ActivitiesRecent = ({ activitiesRecent }) => {
  const router = useRouter();
  const { id } = useParams();
  return (
    <div className="border-1 border-solid rounded-lg border-default-200 p-2 px-4 flex flex-col">
      <h2>Hoạt động gần đây</h2>
      <ol className="space-y-2 mt-2 flex flex-col grow">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có hoạt động nào gần đây
        </p>
        {activitiesRecent?.length > 0 &&
          activitiesRecent.map((activity) => (
            <ActivityRecent activity={activity} />
          ))}
        {activitiesRecent?.length > 5 && (
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
