"use client";
import { Avatar } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { ChevronDown, Plus } from "lucide-react";

import { HelpOutlineIcon } from "@/components/Icon/HelpOutlineIcon";
import { BoardsAction } from "./BoardsAction";
import WorkspaceMenu from "./WorkspaceMenu";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";

const SidebarWorkspace = ({ workspaceOptions }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  return (
    <div
      className="  h-full dark-border  lg:w-64 shrink-0  flex max-w-[250px]  flex-col"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className="flex p-2 max-h-[70px] dark-border justify-center lg:justify-start "
        style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
      >
        <WorkspaceMenu workspace={workspace}>
          <div className="flex gap-2 p-1.5 items-center hover:bg-default-100 rounded-lg ">
            <Avatar
              style={{
                background: `${
                  workspace && workspace.color ? workspace.color : "#9353D3"
                }`,
              }}
              radius="md"
              size="sm"
              className="h-6 md:w-6 text-white  w-6"
              name={workspace?.name?.charAt(0).toUpperCase()}
            />
            <div className="flex items-center gap-2">
              <p className="lg:block hidden overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[110px]  text-sm ">
                {workspace?.name}
              </p>
              <button className="">
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        </WorkspaceMenu>
        <div className="w-6 h-6 lg:block hidden"></div>
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
              onClick={() => router.push(`.${option.href}`)}
              key={index}
              color="foreground"
              className={`flex  p-2 gap-4 items-center justify-center lg:justify-start  rounded-lg max-h-[32px] text-md  cursor-pointer  mb-1 ${
                index > 4 ? "hidden" : ""
              } ${
                pathname.includes(option.href)
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-default-100"
              } `}
            >
              {option.icon}
              <span className="lg:block hidden">{option.label}</span>
            </div>
          ))}
        </div>

        <div className="p-2 px-4">
          <BoardsAction />
          <FormPopoverBoard
            placement={"top-right"}
            workspaces={user?.workspaces}
          >
            <div className="flex p-1.5 hover:bg-default-100 rounded-lg justify-center lg:justify-start items-center gap-2 text-sm  cursor-pointer">
              <Plus size={16} />

              <span className="lg:block hidden">Tạo bảng mới</span>
            </div>
          </FormPopoverBoard>
        </div>
      </div>

      <div className="p-2 flex flex-col lg:flex-row justify-center items-center lg:h-[50px] gap-1 ">
        <button
          onClick={() => router.push(`/w/${workspace.id}/users`)}
          className={`flex gap-1 items-center text-sm py-1.5 flex items-center justify-center rounded-lg hover:bg-default-100 lg:flex-1 w-full`}
        >
          <img
            src="https://app-cdn.clickup.com/invite-gradient.d97ffc8ac2bc7a4f39e36f57c5c4f410.svg"
            alt="invite"
          />
          <span className="invite lg:block hidden">Mời</span>
        </button>
        <span className="lg:w-px w-2/3 h-0.5 rounded-lg lg:h-2/3 bg-default-100"></span>
        <button className="flex gap-1 items-center text-sm py-1.5 flex items-center justify-center  rounded-lg  hover:bg-default-100 lg:flex-1 w-full">
          <HelpOutlineIcon />
          <span className="lg:block hidden"> Giúp đỡ</span>
        </button>
      </div>
    </div>
  );
};
export default SidebarWorkspace;
