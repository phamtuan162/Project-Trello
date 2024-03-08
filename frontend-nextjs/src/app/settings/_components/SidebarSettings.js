"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ArrowLeft,
  User,
  CreditCard,
  Building,
  Cloud,
} from "lucide-react";
import { logoutApi } from "@/services/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import { CalendarIcon } from "@/components/Icon/CalenderIcon";
import { NotifyIcon } from "@/components/Icon/NotifyIcon";
const SidebarSettings = () => {
  const pathname = usePathname();
  const router = useRouter();
  const SettingOptions = [
    {
      href: "/settings",
      label: "Chung",
      icon: <User size={18} />,
    },
    {
      href: "/settings/billing",
      label: "Thanh toán",
      icon: <CreditCard size={18} />,
    },
    {
      href: "/settings/notifications",
      label: "Thông báo",
      icon: <NotifyIcon size={18} />,
    },
    {
      href: "/settings/my-workspace",
      label: "Không gian làm việc ",
      icon: <Building size={18} />,
    },
    {
      href: "/settings/calendar",
      label: "Lịch",
      icon: <CalendarIcon size={18} />,
    },
    {
      href: "/settings/storage",
      label: "Lưu trữ đám mây",
      icon: <Cloud size={18} />,
    },
  ];
  const handleLogOut = async () => {
    toast.warning("Bạn có chắc chắn muốn đăng xuất không? ", {
      onClick: async () => {
        logoutApi().then((data) => {
          if (data) {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            window.location.href = "/auth/login";
          }
        });
      },
    });
  };
  return (
    <div
      className="h-full w-64 w-max-[300px] dark-border flex flex-col"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className=" p-2 dark-border pr-5"
        style={{
          borderBottom: "1px solid rgb(232, 234, 237)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="flex p-2 gap-2 items-center rounded-lg hover:bg-default-100 text-sm cursor-pointer w-full"
        >
          <ArrowLeft size={18} />
          Trở lại không gian làm việc
        </button>
      </div>

      <div className="grow overflow-y-auto p-3">
        {SettingOptions?.map((option, index) => (
          <div
            onClick={() => router.push(option.href)}
            key={index}
            color="foreground"
            className={`flex p-2 gap-3 items-center  rounded-lg max-h-[32px] text-md  cursor-pointer  mb-1 ${
              pathname.includes(option.href)
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-default-100"
            } `}
          >
            {option.icon}
            {option.label}
          </div>
        ))}
      </div>
      <div
        className="p-2 pr-5 dark-border"
        style={{
          borderTop: "1px solid rgb(232, 234, 237)",
        }}
      >
        <button
          onClick={() => handleLogOut()}
          className="p-2 rounded-lg flex gap-2 items-center hover:bg-default-100 w-full text-sm"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};
export default SidebarSettings;
