"use client";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Listbox,
  ListboxItem,
  Link,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { BoardIcon } from "../../../../components/Icon/BoardIcon";
import { HeartIcon } from "../../../../components/Icon/HeartIcon";
import { UserIcon } from "../../../../components/Icon/UserIcon";
import { CalendarIcon } from "../../../../components/Icon/CalenderIcon";
import { MissionIcon } from "../../../../components/Icon/MissionIcon";
import { RecentlyIcon } from "../../../../components/Icon/RecentlyIcon";
import { StarIcon } from "../../../../components/Icon/StarIcon";
import { HomeIcon } from "../../../../components/Icon/HomeIcon";
import { SettingIcon } from "../../../../components/Icon/SettingIcon";
import { MoreIcon } from "../../../../components/Icon/MoreIcon";
import { Activity } from "lucide-react";
import { ChevronDown } from "lucide-react";
import FormPopoverWorkSpace from "@/components/Form/FormPopoverWorkSpace";
const SidebarWorkspace = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id: workspaceId } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );
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
      href: "/boards",
      label: "Tất cả bảng",
      icon: <BoardIcon />,
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
      className="  h-full  w-64 shrink-0 hidden lg:block max-w-[250px]"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className="flex p-2 max-h-[70px] "
        style={{ borderBottom: "1px solid rgb(232, 234, 237)" }}
      >
        <FormPopoverWorkSpace workspace={workspace}>
          <div className="flex gap-2 p-1 items-center hover:bg-default-100 rounded-lg w-auto">
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
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 124px)" }}
      >
        <div
          className="p-2"
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
      </div>
    </div>
  );
};
export default SidebarWorkspace;
//  <Skeleton
//           isLoaded={workspaces?.length > 0 ? true : false}
//           className="rounded-lg h-full"
//           style={{ maxHeight: "calc(100vh - 200px)" }}
//         >
//           <Accordion
//             defaultSelectedKeys={workspaceId}
//             showDivider={false}
//             selectionMode="multiple"
//             className=" flex flex-col gap-1 w-full "
//             itemClasses={itemClasses}
//           >
//             {workspaces?.map((workspace) => (
//               <AccordionItem
//                 key={workspace.id}
//                 aria-label={workspace.desc}
//                 title={workspace.name}
//                 startContent={
//                   <Avatar
//                     color="success"
//                     radius="lg"
//                     src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
//                   />
//                 }
//               >
//                 <Listbox aria-label="Listbox Variants">
//                   {routes?.map((route, index) => {
//                     return (
//                       <ListboxItem
//                         href={`/w/${workspace.id}/${route.href}`}
//                         className="max-h-9 rounded-lg data-[hover=true]:bg-default-100 "
//                         textValue={route.label}
//                         key={index}
//                         style={{ color: "#172b4d" }}
//                       >
//                         <Button
//                           variant="ghost"
//                           className="border-0 no-hover max-h-9 pl-9 "
//                         >
//                           {route.icon}
//                           {route.label}
//                         </Button>
//                       </ListboxItem>
//                     );
//                   })}
//                 </Listbox>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </Skeleton>
