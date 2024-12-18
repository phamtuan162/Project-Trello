"use client";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";

import { generateActivityMessage } from "@/utils/formatters";

const ActivityItem = ({ activity }) => {
  return (
    <li className="flex items-center gap-1.5 w-full">
      <Avatar
        src={activity?.userAvatar}
        name={activity?.userName?.charAt(0).toUpperCase()}
        radius="full"
        color="secondary"
        className="h-[32px] w-[32px] shrink-0 text-lg"
      />
      <div className="flex flex-col space-y-0.5 w-full">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold  text-neutral-700 mr-0.5">
            {activity.userName}
          </span>
          {generateActivityMessage(activity)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(activity.created_at), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
      </div>
    </li>
  );
};
export default ActivityItem;
