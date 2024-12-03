"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
  Skeleton,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { CheckIcon, X } from "lucide-react";

import { notificationSlice } from "@/stores/slices/notificationSlice";
import NotificationItem from "./notification-item";
import { markAsReadNotification } from "@/services/notifyApi";
import { fetchNotification } from "@/stores/middleware/fetchNotification";
import { socket } from "@/socket";

const { updateNotification, createNotification } = notificationSlice.actions;

const Notification = ({ children, handleClickNotify }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const user = useSelector((state) => state.user.user);

  // Thêm ref cho phần tử cuối cùng để theo dõi khi cuộn đến cuối
  const loadMoreRef = useRef(null);

  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const filteredNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) return [];

    return notifications
      .filter(({ status }) => {
        if (!status) return false; // Bỏ qua nếu `status` không tồn tại
        const normalizedStatus = status.toLowerCase().trim();
        return normalizedStatus === (isSelected ? "unread" : "read");
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [notifications, isSelected]);

  // Sử dụng Intersection Observer để theo dõi khi cuộn đến cuối
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const entry = entries[0];
  //       // Kiểm tra nếu phần tử cuối cùng đã vào viewport và không đang tải
  //       if (entry.isIntersecting && !loading && filteredNotifications.length) {
  //         // setLoading(true);
  //         // Giả lập việc tải thêm thông báo

  //         dispatch(fetchNotification({ user: user.id, limit: 5, offset }));
  //         setTimeout(() => {
  //           // setLoading(false); // Sau khi tải xong
  //         }, 1500);
  //         setOffset((prevOffset) => prevOffset + 5); // Assuming a limit of 5 per request
  //       }
  //     },
  //     {
  //       threshold: 1.0, // Đảm bảo phần tử loadMoreRef hoàn toàn xuất hiện
  //     }
  //   );

  //   if (loadMoreRef.current) {
  //     observer.observe(loadMoreRef.current);
  //   }

  //   return () => {
  //     if (loadMoreRef.current) {
  //       observer.unobserve(loadMoreRef.current);
  //     }
  //   };
  // }, [filteredNotifications, loading]);

  useEffect(() => {
    const handleGetNotification = (data) => {
      dispatch(createNotification(data));
    };

    socket.on("getNotification", handleGetNotification);

    return () => {
      socket.off("getNotification", handleGetNotification);
    };
  }, [dispatch]);

  const handleMarkAsReadNotification = async () => {
    if (!notifications.length) return;

    try {
      const { status } = await markAsReadNotification({
        user_id: user.id,
      });
      if (200 <= status && status <= 299) {
        const notificationsUpdate = notifications.map((notification) => ({
          ...notification,
          status: "read",
        }));
        dispatch(updateNotification(notificationsUpdate));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover
      placement="bottom"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (open) {
          handleClickNotify();
        }
        setIsOpen(open);
      }}
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
              className="focus-visible:outline-0 flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>
          <ol className="space-y-2 mt-4 pb-2 px-2 cursor-pointer max-h-[400px] overflow-x-auto">
            <div className="flex justify-end gap-2 mb-2">
              {isSelected ? (
                <button
                  onClick={() => handleMarkAsReadNotification()}
                  className="text-xs hover:underline"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              ) : (
                <span className="flex items-center justify-center text-xs">
                  Chưa đọc
                </span>
              )}

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
            {filteredNotifications?.map((notification) => (
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
// {isloading && (
//   <div className=" w-full flex items-center gap-4 p-2">
//     <div>
//       <Skeleton className="flex rounded-full w-[40px] h-[40px]" />
//     </div>
//     <div className="w-full flex flex-col space-y-0.5">
//       <Skeleton className="h-3 w-full rounded-lg" />
//       <Skeleton className="h-3 w-3/5 rounded-lg" />
//     </div>
//   </div>
// )}
// {/* Phần tử ref dùng để theo dõi khi cuộn đến cuối */}
// <div ref={loadMoreRef}></div>
