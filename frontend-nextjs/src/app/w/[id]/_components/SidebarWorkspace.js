"use client";
import { Avatar } from "@nextui-org/react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { HeartIcon } from "@/components/Icon/HeartIcon";
import { UserIcon } from "@/components/Icon/UserIcon";
import { CalendarIcon } from "@/components/Icon/CalenderIcon";
import { MissionIcon } from "@/components/Icon/MissionIcon";
import { RecentlyIcon } from "@/components/Icon/RecentlyIcon";
import { StarIcon } from "@/components/Icon/StarIcon";
import { HomeIcon } from "@/components/Icon/HomeIcon";
import { SettingIcon } from "@/components/Icon/SettingIcon";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import { HelpOutlineIcon } from "@/components/Icon/HelpOutlineIcon";
import { BoardsAction } from "./BoardsAction";
import { ChevronDown, Activity, Plus } from "lucide-react";
import FormPopoverWorkSpace from "@/components/Form/FormPopoverWorkSpace";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";
import { useEffect, useState } from "react";
const SidebarWorkspace = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id: workspaceId } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );
  const [boards, setBoards] = useState([]);
  useEffect(() => {
    if (workspace) {
      setBoards(workspace.boards);
    }
  }, [workspace]);
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
  ];
  const routes = [
    {
      href: "",
      label: "Boards",
      icon: <BoardIcon />,
    },
    {
      href: "/highlight",
      label: "Highlights",
      icon: <HeartIcon />,
    },
    {
      href: "/member",
      label: "Member",
      icon: <UserIcon />,
    },
    {
      href: "/activity",
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
    },
    {
      href: "/setting",
      label: "Settings",
      icon: <SettingIcon />,
    },
  ];
  // const itemClasses = {
  //   base: "py-0 w-full",
  //   title: "font-normal text-medium",
  //   trigger:
  //     "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
  //   indicator: "text-medium",
  //   content: "text-small px-2",
  // };

  return (
    <div
      className="  h-full dark-border  w-64 shrink-0 hidden lg:flex max-w-[250px]  flex-col"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className="flex p-2 max-h-[70px] dark-border "
        style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
      >
        <FormPopoverWorkSpace workspace={workspace}>
          <div className="flex gap-2 p-1.5 items-center hover:bg-default-100 rounded-lg w-auto">
            <Avatar
              radius="md"
              size="sm"
              className="h-6 w-6 text-indigo-700 bg-indigo-100"
              name={workspace?.name?.charAt(0).toUpperCase()}
            />
            <div className="flex items-center gap-2">
              <p className="overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[110px] text-sm ">
                {workspace?.name}
              </p>

              <ChevronDown size={14} />
            </div>
          </div>
        </FormPopoverWorkSpace>
        <div className="w-6 h-6"></div>
      </div>
      <div
        className="overflow-y-auto grow dark-border"
        style={{
          borderBottom: "1px solid rgb(232, 234, 237)",
        }}
      >
        <div
          className="p-2 dark-border"
          style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
        >
          {workspaceOptions?.map((option, index) => (
            <div
              onClick={() => router.push(`/w/${workspaceId}/${option.href}`)}
              key={index}
              color="foreground"
              className={`flex p-2 gap-4 items-center  rounded-lg max-h-[32px] text-md  cursor-pointer  mb-1 ${
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

        <div className="p-2 px-4">
          <BoardsAction
            setBoards={setBoards}
            boardsOrigin={workspace?.boards}
          />
          {boards?.slice(0, 3).map((board) => (
            <div
              onClick={() => router.push(`/b/${board.id}`)}
              key={board.id}
              className="flex gap-2 p-1.5 items-center hover:bg-default-100 rounded-lg w-auto mb-1"
            >
              <Avatar
                src={board?.background}
                radius="md"
                size="sm"
                className="h-6 w-6 text-indigo-700 bg-indigo-100"
                name={board?.name?.charAt(0).toUpperCase()}
              />
              <div className="flex items-center gap-2">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[140px] text-sm ">
                  {board?.title}
                </p>
              </div>
            </div>
          ))}
          <div
            onClick={() => router.push(`/w/${workspaceId}/boards`)}
            className={`flex p-1.5 hover:bg-default-100 rounded-lg items-center gap-2 text-sm  cursor-pointer ${
              pathname.includes("boards")
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-default-100"
            }`}
          >
            <BoardIcon size={16} />
            Xem tất cả bảng
          </div>
          <FormPopoverBoard placement="top">
            <div className="flex p-1.5 hover:bg-default-100 rounded-lg items-center gap-2 text-sm  cursor-pointer">
              <Plus size={16} />
              Tạo bảng mới
            </div>
          </FormPopoverBoard>
        </div>
      </div>

      <div className="p-2 flex justify-center items-center h-[50px] gap-1">
        <button
          className={`flex gap-1 items-center text-sm py-1.5 flex items-center justify-center rounded-lg hover:bg-default-100 flex-1 `}
        >
          <img
            src="https://app-cdn.clickup.com/invite-gradient.d97ffc8ac2bc7a4f39e36f57c5c4f410.svg"
            alt="invite"
          />
          <span className="invite">Mời</span>
        </button>
        <span className="w-px rounded-lg h-2/3 bg-default-100"></span>
        <button className="flex gap-1 items-center text-sm py-1.5 flex items-center justify-center  rounded-lg  hover:bg-default-100 flex-1">
          <HelpOutlineIcon />
          Giúp đỡ
        </button>
      </div>
    </div>
  );
};
export default SidebarWorkspace;
