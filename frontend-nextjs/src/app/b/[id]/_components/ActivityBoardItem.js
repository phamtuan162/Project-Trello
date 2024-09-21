"use client";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
import { generateActivityMessage } from "@/utils/formatters";
const ActivityBoardItem = ({ activity }) => {
  return (
    <li className="flex items-start gap-3">
      <Avatar
        src={activity?.userAvatar}
        name={activity?.userName?.charAt(0).toUpperCase()}
        radius="full"
        color="secondary"
        className="h-[32px] w-[32px] shrink-0"
      />
      <div className="flex flex-col space-y-0.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold  text-neutral-700">
            {activity?.userName}
          </span>
          {generateActivityMessage(activity)}
        </p>
        <p className="text-xs text-muted-foreground">
          {activity?.created_at &&
            formatDistanceToNow(new Date(activity?.created_at), {
              addSuffix: true,
              locale: vi,
            })}
        </p>
      </div>
    </li>
  );
};
export default ActivityBoardItem;
