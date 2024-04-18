import SidebarWorkspace from "./_components/SidebarWorkspace";
import BreadcrumbWorkspace from "./_components/BreadcrumbWorkspace";

import { CalendarIcon } from "@/components/Icon/CalenderIcon";
import { MissionIcon } from "@/components/Icon/MissionIcon";
import { RecentlyIcon } from "@/components/Icon/RecentlyIcon";
import { HomeIcon } from "@/components/Icon/HomeIcon";
import { SettingIcon } from "@/components/Icon/SettingIcon";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { UserIcon } from "@/components/Icon/UserIcon";
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
      href: "/settings",
      label: "Cài đặt",
      icon: <SettingIcon />,
    },

    {
      href: "/users",
      label: "Thành viên",
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
