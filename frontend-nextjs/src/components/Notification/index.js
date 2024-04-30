"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { notificationSlice } from "@/stores/slices/notificationSlice";
import NotificationItem from "./notification-item";
import { CheckIcon, X } from "lucide-react";
const { updateNotification } = notificationSlice.actions;
const Notification = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(true);

  const socket = useSelector((state) => state.socket.socket);
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const notificationsFilter = useMemo(() => {
    return notifications?.filter(
      (notification) =>
        notification?.status?.toLowerCase().trim() ===
        (isSelected ? "unread" : "read")
    );
  }, [isSelected, notifications]);

  useEffect(() => {
    const handleGetNotification = (data) => {
      const notificationsUpdate =
        notifications.length > 0 ? [data, ...notifications] : [data];
      dispatch(updateNotification(notificationsUpdate));
    };

    if (socket) {
      socket.on("getNotification", handleGetNotification);

      return () => {
        socket.off("getNotification", handleGetNotification);
      };
    }
  }, [socket]);

  return (
    <Popover
      placement="bottom"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        content: [" p-0"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-2 border-b-1 border-solid border-default-200">
            <p
              className="w-full text-center font-medium text-xs"
              style={{ color: "#44546f" }}
            >
              Thông báo
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>

          <ol className="space-y-2 mt-4 pb-2 px-2 cursor-pointer max-h-[450px] overflow-x-auto">
            <div className="flex justify-end gap-2 mb-4">
              <button className="text-xs hover:underline">
                Đánh dấu tất cả đã đọc
              </button>
              <Switch
                isSelected={isSelected}
                onValueChange={setIsSelected}
                size="xs"
                color="success"
                className="text-xs w-[20p]"
                startContent={<CheckIcon size={16} color={"#fff"} />}
                endContent={<X size={16} />}
              ></Switch>
            </div>

            <p
              className="hidden last:block text-md  text-center "
              style={{ color: "#172b4d" }}
            >
              Không có Thông báo nào
            </p>
            {notificationsFilter?.length > 0 &&
              notificationsFilter.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </ol>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default Notification;
