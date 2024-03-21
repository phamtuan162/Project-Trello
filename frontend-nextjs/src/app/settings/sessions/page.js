"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { getLocalStorage } from "@/utils/localStorage";
import { formatTimeAgo } from "@/utils/formatTime";

const PageSessions = () => {
  const user = useSelector((state) => state.user.user);
  const device_id_current = getLocalStorage("device_id_current") || "";
  const handleLogoutDevice = async () => {
    // const socket = io("http://localhost:3001");
  };
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-medium mt-2">Phiên</h1>
      <p className="mt-1">
        Dưới đây là các phiên gần đây của bạn, hãy thu hồi quyền truy cập để
        đăng xuất khỏi thiết bị đó.
      </p>
      <Table
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
        }}
        removeWrapper
        aria-label="Example static collection table"
        className="mt-4"
      >
        <TableHeader>
          <TableColumn>HỆ ĐIỀU HÀNH</TableColumn>
          <TableColumn>TRÌNH DUYỆT</TableColumn>
          <TableColumn>THỜI GIAN ĐĂNG NHẬP</TableColumn>
          <TableColumn>TRUY CẬP</TableColumn>
        </TableHeader>
        <TableBody>
          {user?.devices?.map((device) => (
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
                    onClick={() => handleLogoutDevice()}
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
