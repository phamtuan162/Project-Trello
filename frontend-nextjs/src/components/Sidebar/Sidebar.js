"use client";
import "./sidebar.scss";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { BoardIcon } from "../Icon/BoardIcon";
import { HeartIcon } from "../Icon/HeartIcon";
import { UserIcon } from "../Icon/UserIcon";
import { CalendarIcon } from "../Icon/CalenderIcon";
import { MissionIcon } from "../Icon/MissionIcon";
import { RecentlyIcon } from "../Icon/RecentlyIcon";
import { StarIcon } from "../Icon/StarIcon";
import { HomeIcon } from "../Icon/HomeIcon";
import { SettingIcon } from "../Icon/SettingIcon";
import { MoreIcon } from "../Icon/MoreIcon";
import { Activity } from "lucide-react";
import { Skeleton } from "@nextui-org/react";
const Sidebar = () => {
  const { id } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspaceOptions = [
    {
      href: "/",
      label: "Trang chủ",
      icon: <HomeIcon />,
    },
    {
      href: "/",
      label: "Gần đây",
      icon: <RecentlyIcon />,
    },

    {
      href: "/",
      label: "Nhiệm vụ của tôi",
      icon: <MissionIcon />,
    },
    {
      href: "/",
      label: "Lịch",
      icon: <CalendarIcon />,
    },
    {
      href: "/",
      label: "Có gắn dấu sao",
      icon: <StarIcon />,
    },
    {
      href: "/",
      label: "Tất cả bảng",
      icon: <BoardIcon />,
    },
    {
      href: "/",
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
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

  return (
    <div
      className="p-2 sidebar h-full  w-64 shrink-0 hidden lg:block overflow-x-auto"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
        maxHeight: " calc(100vh-64px)",
      }}
    >
      <div
        className="p-2"
        style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
      >
        {workspaceOptions?.map((option, index) => (
          <div
            key={index}
            className="flex p-2 gap-4 items-center  rounded-lg hover:bg-default-100 cursor-pointer text-lg"
          >
            {option.icon}
            {option.label}
          </div>
        ))}
      </div>

      <div>
        <Skeleton
          isLoaded={workspaces?.length > 0 ? true : false}
          className="rounded-lg h-full"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <Accordion
            defaultSelectedKeys={id}
            showDivider={false}
            selectionMode="multiple"
            className=" flex flex-col gap-1 w-full "
            itemClasses={itemClasses}
          >
            {workspaces?.map((workspace) => (
              <AccordionItem
                key={workspace.id}
                aria-label={workspace.desc}
                title={workspace.name}
                startContent={
                  <Avatar
                    color="success"
                    radius="lg"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                }
              >
                <Listbox aria-label="Listbox Variants">
                  {routes?.map((route, index) => {
                    return (
                      <ListboxItem
                        href={`/w/${workspace.id}/${route.href}`}
                        className="max-h-9 rounded-lg data-[hover=true]:bg-default-100 "
                        textValue={route.label}
                        key={index}
                        style={{ color: "#172b4d" }}
                      >
                        <Button
                          variant="ghost"
                          className="border-0 no-hover max-h-9 pl-9 text-xs"
                        >
                          {route.icon}
                          {route.label}
                        </Button>
                      </ListboxItem>
                    );
                  })}
                </Listbox>
              </AccordionItem>
            ))}
          </Accordion>
        </Skeleton>
      </div>
    </div>
  );
};
export default Sidebar;
