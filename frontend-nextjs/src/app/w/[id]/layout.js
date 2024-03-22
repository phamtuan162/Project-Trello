import SidebarWorkspace from "./_components/SidebarWorkspace";
import BreadcrumbWorkspace from "./_components/BreadcrumbWorkspace";

import { CalendarIcon } from "@/components/Icon/CalenderIcon";
import { MissionIcon } from "@/components/Icon/MissionIcon";
import { RecentlyIcon } from "@/components/Icon/RecentlyIcon";
import { StarIcon } from "@/components/Icon/StarIcon";
import { HomeIcon } from "@/components/Icon/HomeIcon";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import { SettingIcon } from "@/components/Icon/SettingIcon";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { UserIcon } from "@/components/Icon/UserIcon";
import { UpgradeIcon } from "@/components/Icon/UpgradeIcon";
export const metadata = {
  title: "Không gian làm việc ",
  description: "Chi tiết Không gian làm việc",
};
export default function WorkspaceLayout({ children }) {
  const workspaceOptions = [
    {
      href: "/home",
      label: "Trang chủ",
      icon: <HomeIcon />,
    },
    {
      href: "/recent",
      label: "Gần đây",
      icon: <RecentlyIcon />,
    },

    {
      href: "/mission",
      label: "Nhiệm vụ của tôi",
      icon: <MissionIcon />,
    },
    {
      href: "/calendar",
      label: "Lịch",
      icon: <CalendarIcon />,
    },
    {
      href: "/star",
      label: "Có gắn dấu sao",
      icon: <StarIcon />,
    },

    {
      href: "/more",
      label: "Khác",
      icon: <MoreIcon />,
    },
    {
      href: "/settings",
      label: "Cài đặt",
      icon: <SettingIcon />,
    },
    {
      href: "/boards",
      label: "Tất cả các bảng",
      icon: <BoardIcon />,
    },
    {
      href: "/users",
      label: "Người dùng",
      icon: <UserIcon />,
    },
  ];
  return (
    <div className="flex gap-x-7 justify-center h-full ">
      <SidebarWorkspace workspaceOptions={workspaceOptions} />
      <div
        className="work-space grow mt-5 pr-14 pl-8"
        style={{ maxHeight: "calc(100vh - 64px)", overflow: "auto" }}
      >
        <BreadcrumbWorkspace
          options={workspaceOptions}
          origin={"Không gian làm việc"}
        />
        {children}
      </div>
    </div>
  );
}
