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
      className="  h-full dark-border  md:w-64 shrink-0  flex max-w-[250px]  flex-col"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className="flex p-2 max-h-[70px] dark-border justify-center md:justify-start "
        style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
      >
        <FormPopoverWorkSpace workspace={workspace}>
          <div className="flex gap-2 p-1.5 items-center hover:bg-default-100 rounded-lg ">
            <Avatar
              src={workspace?.avatar}
              radius="md"
              size="sm"
              className="h-6 md:w-6 text-indigo-700 bg-indigo-100 w-6"
              name={workspace?.name?.charAt(0).toUpperCase()}
            />
            <div className="flex items-center gap-2">
              <p className="md:block hidden overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[110px] text-sm ">
                {workspace?.name}
              </p>
              <button className="">
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </FormPopoverWorkSpace>
        <div className="w-6 h-6 md:block hidden"></div>
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
              className={`flex  p-2 gap-4 items-center justify-center md:justify-start  rounded-lg max-h-[32px] text-md  cursor-pointer  mb-1 ${
                pathname.includes(option.href)
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-default-100"
              } `}
            >
              {option.icon}
              <span className="md:block hidden">{option.label}</span>
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
              className="md:flex gap-2 p-1.5 items-center justify-center  md:justify-start  hover:bg-default-100 rounded-lg w-auto mb-1 hidden"
            >
              <Avatar
                src={board?.background}
                radius="md"
                size="sm"
                className="h-6 w-6 text-indigo-700 bg-indigo-100"
                name={board?.title?.charAt(0).toUpperCase()}
              />
              <div className="flex items-center gap-2">
                <p className="md:block hidden overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[140px] text-sm ">
                  {board?.title}
                </p>
              </div>
            </div>
          ))}
          <div
            onClick={() => router.push(`/w/${workspaceId}/boards`)}
            className={`flex p-1.5 hover:bg-default-100 rounded-lg items-center justify-center md:justify-start gap-2 text-sm  cursor-pointer ${
              pathname.includes("boards")
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-default-100"
            }`}
          >
            <BoardIcon size={16} />

            <span className="md:block hidden">Xem tất cả bảng</span>
          </div>
          <FormPopoverBoard placement="top">
            <div className="flex p-1.5 hover:bg-default-100 rounded-lg justify-center md:justify-start items-center gap-2 text-sm  cursor-pointer">
              <Plus size={16} />

              <span className="md:block hidden">Tạo bảng mới</span>
            </div>
          </FormPopoverBoard>
        </div>
      </div>

      <div className="p-2 flex flex-col md:flex-row justify-center items-center md:h-[50px] gap-1 ">
        <button
          className={`flex gap-1 items-center text-sm py-1.5 flex items-center justify-center rounded-lg hover:bg-default-100 md:flex-1 w-full`}
        >
          <img
            src="https://app-cdn.clickup.com/invite-gradient.d97ffc8ac2bc7a4f39e36f57c5c4f410.svg"
            alt="invite"
          />
          <span className="invite md:block hidden">Mời</span>
        </button>
        <span className="md:w-px w-2/3 h-0.5 rounded-lg md:h-2/3 bg-default-100"></span>
        <button className="flex gap-1 items-center text-sm py-1.5 flex items-center justify-center  rounded-lg  hover:bg-default-100 md:flex-1 w-full">
          <HelpOutlineIcon />
          <span className="md:block hidden"> Giúp đỡ</span>
        </button>
      </div>
    </div>
  );
};
export default SidebarWorkspace;
