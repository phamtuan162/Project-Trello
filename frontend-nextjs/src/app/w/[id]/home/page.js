"use client";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import ActivitiesRecent from "./activitiesRecent";
import MissionsRecent from "./missionsRecent";
const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
export default function HomeWorkspace() {
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const activitiesRecent = useMemo(() => {
    if (workspace?.activities?.length > 0) {
      const activities = workspace.activities
        .filter((activity) => +activity.user_id === +user.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 7);
      return activities;
    }
    return [];
  }, [workspace, user.id]);
  return (
    <div className="mt-2 pb-5">
      <h1 className="text-xl font-bold ">
        {getGreeting()}, {user.name}
      </h1>

      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mt-2">
        <ActivitiesRecent activitiesRecent={activitiesRecent} />
        <MissionsRecent />
      </div>
    </div>
  );
}
