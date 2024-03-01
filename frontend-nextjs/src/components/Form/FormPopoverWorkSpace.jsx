"use client";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import { SettingIcon } from "../Icon/SettingIcon";
import { PrivateIcon } from "../Icon/PrivateIcon";
import { UserIcon } from "../Icon/UserIcon";
import { UpgradeIcon } from "../Icon/UpgradeIcon";
export default function FormPopoverWorkSpace({
  children,
  placement = "bottom",
  workspace,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    {
      label: "Cài đặt",
      icon: <SettingIcon />,
    },
    {
      label: "Nâng cấp",
      icon: <UpgradeIcon />,
    },
    {
      label: "Quản lý người dùng",
      icon: <UserIcon />,
    },
  ];
  return (
    <Popover
      placement={placement}
      className="max-w-[300px] "
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        {children ? (
          children
        ) : (
          <Button color="hidden" className="p-0 min-w-[0px] w-0	"></Button>
        )}
      </PopoverTrigger>

      <PopoverContent className=" p-0">
        <Card shadow="none" className=" border-none bg-transparent">
          <CardHeader
            className="flex-col gap-2 items-stretch pb-1"
            style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
          >
            <div className="flex gap-3 justify-between">
              <Avatar
                radius="md"
                size="sm"
                className="h-9 w-9 text-indigo-700 bg-indigo-100"
                name={workspace?.name?.charAt(0).toUpperCase()}
              />
              <div className="flex flex-col items-start justify-center gap-1">
                <h4 className="text-small font-semibold leading-none text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                  {workspace?.name}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <PrivateIcon /> {"\u2022"}
                </div>
              </div>
            </div>
            <div>
              {options?.map((option, index) => (
                <div
                  key={index}
                  color="foreground"
                  className={`flex p-2 gap-2 items-center  rounded-lg max-h-[32px] w-full  cursor-pointer  mb-1 hover:bg-default-100`}
                >
                  {option.icon}
                  {option.label}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardBody
            className=" py-0"
            style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
          ></CardBody>
          <CardFooter>
            <h1>Footer</h1>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
