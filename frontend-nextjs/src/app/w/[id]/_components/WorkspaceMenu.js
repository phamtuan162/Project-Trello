"use client";
import { useState, useMemo } from "react";
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
import { usePathname, useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import { SettingIcon } from "@/components/Icon/SettingIcon";
import { SearchIcon } from "@/components/Icon/SearchIcon";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
import { UserIcon } from "@/components/Icon/UserIcon";
import { UpgradeIcon } from "@/components/Icon/UpgradeIcon";
import { AddIcon } from "@/components/Icon/AddIcon";
import { switchWorkspaceApi } from "@/services/workspaceApi";
import FormCreateWorkspace from "@/components/Form/FormCreateWorkspace";
import { userSlice } from "@/stores/slices/userSlice";
import Loading from "@/components/Loading/Loading";
import { fetchMission } from "@/stores/middleware/fetchMission";
import { fetchWorkspace } from "@/stores/middleware/fetchWorkspace";
import { socket } from "@/socket";

const { updateUser } = userSlice.actions;

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

export default function WorkspaceMenu({
  children,
  placement = "bottom",
  workspace,
}) {
  const dispatch = useDispatch();
  const { id: workspaceId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const hasSearchFilter = Boolean(filterValue);

  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((w) => !w.deleted_at) || [];
  }, [user?.workspaces]);

  const filteredItems = useMemo(() => {
    if (!workspaceId || !workspaces) return [];

    const filteredWorkspaces = workspaces.filter(
      (item) => item?.id && +item.id !== +workspaceId
    );

    if (!hasSearchFilter) return filteredWorkspaces;

    const searchQuery = filterValue.toLowerCase();

    return filteredWorkspaces.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
  }, [workspaces, filterValue, hasSearchFilter]);

  const handleSwitchWorkspace = async (workspaceSwitch) => {
    const { id, role } = workspaceSwitch;
    setIsChange(true);
    try {
      await toast
        .promise(
          async () =>
            await switchWorkspaceApi(id, {
              user_id: user.id,
            }),
          { pending: "Đang di chuyển..." }
        )
        .then(async (res) => {
          await Promise.all([
            // Cập nhật role và workspace_id_active user
            dispatch(
              updateUser({
                role: role,
                workspace_id_active: id,
              })
            ),
            // Chờ fetchWorkspace và fetchMission hoàn thành trước khi chuyển trang
            dispatch(fetchWorkspace(id)),
            dispatch(
              fetchMission({
                user_id: user.id,
                workspace_id: id,
              })
            ),
          ]);

          // Chuyển hướng sau khi các dữ liệu đã được tải về
          router.push(`/w/${id}/home`);
          toast.success("Chuyển không gian làm việc thành công");

          socket.emit("changeWorkspace", { workspace_id_active: id });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsChange(false);
      }, 1000);
    }
  };

  const handleClose = () => {
    setFilterValue("");
    setIsSearch(false);
  };

  if (isChange) {
    return <Loading backgroundColor={"white"} zIndex={"100"} />;
  }

  return (
    <Popover
      onClose={handleClose}
      placement={placement}
      className="max-w-[300px] w-[270px]"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      style={{ zIndex: "49" }}
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
                style={{
                  background: `${
                    workspace && workspace.color ? workspace.color : "#9353D3"
                  }`,
                }}
                className="h-9 w-9 text-white "
                name={workspace?.name?.charAt(0)}
              />
              <div className="flex flex-col items-start justify-center gap-1 grow">
                <h4 className="text-xs  font-semibold  text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                  {workspace?.name}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <PrivateIcon size={16} /> {"\u2022"} {workspace?.total_user}{" "}
                  thành viên
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
                  onChange={(e) => setFilterValue(e.target.value)}
                  variant="faded"
                  classNames={{
                    base: "max-w-full sm:max-w-[16rem] ",
                    mainWrapper: "h-full ",
                    input: "text-small ",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-white  dark:bg-default-500/20 rounded-lg ",
                  }}
                  type="search"
                  placeholder="Tìm kiếm..."
                  size="sm"
                  startContent={<SearchIcon size={18} />}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 select-none">
                <span className=" text-md font-medium">
                  Chuyển Không gian làm việc
                </span>
                <button
                  className="rounded-lg p-1.5 hover:bg-default-300"
                  onClick={() => setIsSearch(!isSearch)}
                >
                  <SearchIcon size={14} />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 ">
              <span className="italic text-md p-2 hidden last:block   text-center text-muted-foreground">
                Không tìm thấy
              </span>
              {filteredItems?.map((item) => (
                <div
                  onClick={() => handleSwitchWorkspace(item)}
                  key={item.id}
                  className="flex gap-3 interceptor-loading  p-1.5 hover:bg-default-100 rounded-lg pointer select-none list-none items-center "
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    radius="md"
                    size="sm"
                    style={{
                      background: `${
                        item && item.color ? item.color : "#9353D3"
                      }`,
                    }}
                    className="h-9 w-9 text-white "
                    name={item?.name?.charAt(0)}
                  />
                  <div className="grow flex flex-col items-start  gap-1">
                    <h4 className="w-full max-w-[169px] text-xs   font-semibold text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                      {item?.name}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground ">
                      <PrivateIcon size={16} /> {"\u2022"}
                      <span className="mx-1">
                        {item.id === workspace.id
                          ? workspace?.total_user
                          : item?.total_user}
                      </span>
                      thành viên
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
          <CardFooter>
            <FormCreateWorkspace>
              <div className="flex p-1.5 hover:bg-default-100 rounded-lg items-center gap-2 cursor-pointer">
                <AddIcon />
                Tạo mới không gian làm việc
              </div>
            </FormCreateWorkspace>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
