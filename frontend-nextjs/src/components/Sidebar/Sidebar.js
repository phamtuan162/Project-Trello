"use client";
import "./sidebar.scss";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Link,
  Button,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { BoardIcon } from "../Icon/BoardIcon";
import { HeartIcon } from "../Icon/HeartIcon";
import { UserIcon } from "../Icon/UserIcon";
import { SettingIcon } from "../Icon/SettingIcon";
import { Activity } from "lucide-react";
import { AddIcon } from "../Icon/AddIcon";
const Sidebar = () => {
  const routes = [
    {
      label: "Boards",
      icon: <BoardIcon />,
    },
    {
      label: "Highlights",
      icon: <HeartIcon />,
    },
    {
      label: "Member",
      icon: <UserIcon />,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
    },
    {
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
    <div className=" sidebar">
      <div className="font-medium text-xs flex items-center mb-1  ">
        <span className="pl-4">Các không gian làm việc</span>
      </div>

      <div
        className="overflow-y-auto h-full"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <Accordion
          showDivider={false}
          selectionMode="multiple"
          className="p-2 flex flex-col gap-1 w-full "
          itemClasses={itemClasses}
        >
          <AccordionItem
            key="1"
            aria-label="Accordion 1"
            title="Accordion 1"
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
          <AccordionItem
            key="2"
            aria-label="Accordion 2"
            title="Accordion 2"
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
                    className="max-h-9 rounded-lg data-[hover=true]:bg-default-100 "
                    textValue={route.label}
                    key={index}
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
          <AccordionItem
            key="3"
            aria-label="Accordion 3"
            title="Accordion 3"
            startContent={
              <Avatar
                color="success"
                radius="lg"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            }
          ></AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
export default Sidebar;
