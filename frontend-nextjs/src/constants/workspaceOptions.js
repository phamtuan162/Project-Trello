import { ActivityIcon } from "lucide-react";
import { MissionIcon } from "@/components/Icon/MissionIcon";
import { HomeIcon } from "@/components/Icon/HomeIcon";
import { SettingIcon } from "@/components/Icon/SettingIcon";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { UserIcon } from "@/components/Icon/UserIcon";

export const workspaceOptions = [
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
