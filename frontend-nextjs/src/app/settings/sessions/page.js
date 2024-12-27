"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { getLocalStorage } from "@/utils/localStorage";
import { formatTimeAgo } from "@/utils/formatTime";

const PageSessions = () => {
  const user = useSelector((state) => state.user.user);
  const device_id_current = getLocalStorage("device_id_current") || "";

  const handleLogoutDevice = async (deviceId) => {
    // Logic thu hồi truy cập từ thiết bị
    console.log(`Thu hồi truy cập từ thiết bị ${deviceId}`);
    // Xử lý API hoặc Redux để logout thiết bị tại đây
  };

  const devices = useMemo(() => {
    return (
      user?.devices?.sort(
        (a, b) => new Date(b.active_time) - new Date(a.active_time)
      ) || []
    );
  }, [user?.devices]);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-medium mt-2">Phiên</h1>
      <p className="mt-1">
        Dưới đây là các phiên gần đây của bạn, hãy thu hồi quyền truy cập để
        đăng xuất khỏi thiết bị đó.
      </p>
      <Table aria-label="Example static collection table" className="mt-4">
        <TableHeader>
          <TableColumn>HỆ ĐIỀU HÀNH</TableColumn>
          <TableColumn>TRÌNH DUYỆT</TableColumn>
          <TableColumn>THỜI GIAN ĐĂNG NHẬP</TableColumn>
          <TableColumn>TRUY CẬP</TableColumn>
        </TableHeader>
        <TableBody>
          {devices?.map((device) => (
            <TableRow
              className="border-b border-divider h-[70px]"
              key={device.id}
            >
              <TableCell>{device.system}</TableCell>
              <TableCell>{device.browser}</TableCell>
              <TableCell>
                {device.id === +device_id_current
                  ? "Đang đăng nhập"
                  : formatTimeAgo(device.active_time)}
              </TableCell>
              <TableCell>
                {device.id === +device_id_current ? (
                  "Phiên hiện tại"
                ) : (
                  <Button
                    type="button"
                    className="rounded-lg h-full py-1.5 text-red-600 bg-red-100 font-medium"
                    onClick={() => handleLogoutDevice(device.id)}
                  >
                    Thu hồi truy cập
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageSessions;
