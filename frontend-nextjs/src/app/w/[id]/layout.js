import SidebarWorkspace from "./_components/SidebarWorkspace";
import BreadcrumbWorkspace from "./_components/BreadcrumbWorkspace";
import { ActivityIcon } from "lucide-react";
import { MissionIcon } from "@/components/Icon/MissionIcon";
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
      href: "/activity",
      label: "Hoạt động",
      icon: <ActivityIcon size={16} />,
    },

    {
      href: "/missions",
      label: "Nhiệm vụ của tôi",
      icon: <MissionIcon />,
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
    {
      href: "/boards",
      label: "Tất cả Bảng",
      icon: <BoardIcon />,
    },
  ];
  return (
    <div className="flex gap-x-7 justify-center h-full ">
      <SidebarWorkspace workspaceOptions={workspaceOptions} />
      <div
        className="work-space grow mt-5 px-2 md:px-8 pr-4"
        style={{ maxHeight: "calc(100vh - 64px)", overflowX: "auto" }}
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
