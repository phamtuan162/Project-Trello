"use client";
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

  return (
    <div className="mt-2 pb-5">
      <h1 className="text-xl font-bold ">
        {getGreeting()}, {user?.name}
      </h1>

      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mt-2">
        <ActivitiesRecent />
        <MissionsRecent />
      </div>
    </div>
  );
}
