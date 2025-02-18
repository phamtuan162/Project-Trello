import { useEffect } from "react";
import { socket } from "@/socket";

const useSocketEvents = (events) => {
  useEffect(() => {
    // Đăng ký tất cả các sự kiện
    events.forEach(({ event, handler }) => {
      socket.on(event, handler);
    });

    // Hủy đăng ký khi component unmount
    return () => {
      events.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
    };
  }, [events]); // Chỉ chạy lại nếu danh sách `events` thay đổi
};

export default useSocketEvents;
