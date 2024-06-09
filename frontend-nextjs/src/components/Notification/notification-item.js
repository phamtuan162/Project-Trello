"use client";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
const NotificationItem = ({ notification }) => {
  return (
    <li className="flex items-center gap-4 hover:bg-default-100 rounded-md p-2">
      <Avatar
        src={notification?.userAvatar}
        name={notification?.userName?.charAt(0).toUpperCase()}
        radius="full"
        color="secondary"
        className="h-[40px] w-[40px] text-lg shrink-0"
      />
      <div className="flex flex-col space-y-0.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold  text-neutral-700 mr-1">
            {notification?.userName}
          </span>
          {notification?.content}
        </p>
        <p className="text-xs text-muted-foreground">
          {notification?.created_at &&
            formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: vi,
            })}
        </p>
      </div>
    </li>
  );
};
export default NotificationItem;
