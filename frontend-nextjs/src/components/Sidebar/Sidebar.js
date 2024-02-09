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
import { useParams } from "next/navigation";
import { BoardIcon } from "../Icon/BoardIcon";
import { HeartIcon } from "../Icon/HeartIcon";
import { UserIcon } from "../Icon/UserIcon";
import { SettingIcon } from "../Icon/SettingIcon";
import { Activity } from "lucide-react";

const Sidebar = () => {
  const { id } = useParams();
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
  const workspaces = [
    { id: 1, name: "Workspace 1", desc: "Mô tả 1" },
    { id: 2, name: "Workspace 2", desc: "Mô tả 2" },
    { id: 3, name: "Workspace 3", desc: "Mô tả 3" },
  ];
  return (
    <div className=" sidebar  w-64 shrink-0 hidden lg:block">
      <div className="font-medium text-xs flex items-center mb-1  ">
        <span className="pl-4">Các không gian làm việc</span>
      </div>

      <div
        className="overflow-y-auto h-full"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <Accordion
          defaultSelectedKeys={id}
          showDivider={false}
          selectionMode="multiple"
          className="p-2 flex flex-col gap-1 w-full "
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
      </div>
    </div>
  );
};
export default Sidebar;
