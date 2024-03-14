"use client";
import { useEffect, useState } from "react";
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
  Input,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

import { SettingIcon } from "@/components/Icon/SettingIcon";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { SearchIcon } from "@/components/Icon/SearchIcon";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
import { UserIcon } from "@/components/Icon/UserIcon";
import { UpgradeIcon } from "@/components/Icon/UpgradeIcon";
import { AddIcon } from "@/components/Icon/AddIcon";
import { useSelector } from "react-redux";
import { switchWorkspace } from "@/services/workspaceApi";

export default function WorkspaceMenu({
  children,
  placement = "bottom",
  workspace,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspaces_switched = workspaces?.filter(
    (item) => item.id !== workspace.id
  );
  const [workspaceSearch, setWorkspaceSearch] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const options = [
    {
      href: "/settings",
      label: "Cài đặt",
      icon: <SettingIcon />,
    },
    {
      href: "/upgrade",
      label: "Nâng cấp",
      icon: <UpgradeIcon />,
    },
    {
      href: "/users",
      label: "Quản lý người dùng",
      icon: <UserIcon />,
    },
  ];
  useEffect(() => {
    if (workspaces_switched.length > 0) {
      setWorkspaceSearch(workspaces_switched);
    }
  }, [workspaces]);
  const handleSwitchWorkspace = async (workspace_id_witched) => {
    switchWorkspace(user.id, {
      workspace_id_active: workspace_id_witched,
    }).then((data) => {
      router.push(`/w/${data.workspace_id_active}/home`);
    });
  };

  const handleSearchWorkspace = async (e) => {
    const searchString = e.target.value.toLowerCase();
    const workspaceNeedSearch = workspaces_switched.filter((item) =>
      item.name.toLowerCase().includes(searchString)
    );
    setWorkspaceSearch(workspaceNeedSearch);
  };
  const handleClose = async () => {
    setWorkspaceSearch(workspaces_switched);
    setIsSearch(!isSearch);
  };
  return (
    <Popover
      onClose={handleClose}
      placement={placement}
      className="max-w-[300px] w-[250px]"
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

      <PopoverContent className=" p-0 ">
        <Card shadow="none" className=" border-none bg-transparent w-full">
          <CardHeader
            className="flex-col gap-2 items-stretch pb-1"
            style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
          >
            <div className="flex gap-3" style={{ cursor: "pointer" }}>
              <Avatar
                radius="md"
                size="sm"
                className="h-9 w-9 text-indigo-700 bg-indigo-100"
                name={workspace?.name?.charAt(0)}
              />
              <div className="flex flex-col items-start justify-center gap-1 grow">
                <h4 className="text-xs leading-4 font-semibold leading-none text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                  {workspace?.name}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <PrivateIcon size={16} /> {"\u2022"}
                </div>
              </div>
            </div>
            <div>
              {options?.map((option, index) => (
                <div
                  onClick={() => router.push(`.${option.href}`)}
                  key={index}
                  color="foreground"
                  className={`flex p-2 gap-2 items-center  rounded-lg max-h-[32px] w-full  cursor-pointer  mb-1 hover:bg-default-100 ${
                    pathname.includes(option.href)
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-default-100"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardBody className=" py-0 pt-1 max-h-[220px] overflow-x-auto">
            {isSearch ? (
              <div className="py-1">
                <Input
                  onChange={(e) => handleSearchWorkspace(e)}
                  variant="faded"
                  classNames={{
                    base: "max-w-full sm:max-w-[16rem] ",
                    mainWrapper: "h-full ",
                    input: "text-small ",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-white  dark:bg-default-500/20 rounded-lg ",
                  }}
                  placeholder="Tìm kiếm..."
                  size="sm"
                  startContent={<SearchIcon size={18} />}
                  endContent={
                    <button
                      className="p-1 hover:bg-default-100 rounded-lg flex items-center"
                      onClick={handleClose}
                    >
                      <CloseIcon size={16} />
                    </button>
                  }
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 select-none">
                <span className=" text-md font-medium">Chuyển đổi</span>
                <button
                  className="rounded-lg p-1.5 hover:bg-default-300"
                  onClick={() => setIsSearch(!isSearch)}
                >
                  <SearchIcon size={14} />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 ">
              {workspaceSearch.length > 0 ? (
                workspaceSearch?.map((workspace_search) => (
                  <div
                    onClick={() => handleSwitchWorkspace(workspace_search.id)}
                    key={workspace_search.id}
                    className="flex gap-3  p-1.5 hover:bg-default-100 rounded-lg pointer select-none list-none items-center "
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar
                      radius="md"
                      size="sm"
                      className="h-9 w-9 text-indigo-700 bg-indigo-100"
                      name={workspace_search?.name?.charAt(0)}
                    />
                    <div className="flex flex-col items-start  gap-1">
                      <h4 className=" text-xs leading-4 text-small font-semibold leading-none text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                        {workspace_search?.name}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground ">
                        <PrivateIcon size={16} /> {"\u2022"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span className="italic text-md p-2">Không tìm thấy</span>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex p-1.5 hover:bg-default-100 rounded-lg items-center gap-2">
              <AddIcon />
              Tạo mới không gian làm việc
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
