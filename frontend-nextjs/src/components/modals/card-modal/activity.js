"use client";
import { ActivityIcon } from "lucide-react";
import { useSelector } from "react-redux";
import ActivityItem from "./activity-item";
import { useMemo } from "react";
const ActivityCard = () => {
  const card = useSelector((state) => state.card.card);
  const activities = useMemo(() => {
    if (!card || !Array.isArray(card.activities)) {
      return [];
    }

    const sortedActivities = [...card.activities];
    sortedActivities.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return sortedActivities;
  }, [card]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-x-4 w-full">
        <ActivityIcon size={24} />
        <div className="w-full">
          <p className="font-semibold  mb-2 text-sm">Hoạt động</p>
        </div>
      </div>
      <div className="w-full">
        <ol className="mt-2 space-y-4">
          {activities?.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ol>
      </div>
    </div>
  );
};
export default ActivityCard;
