"use client";
import { Avatar } from "@nextui-org/react";
import { useMemo } from "react";
import { ClockIcon } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
const MissionItem = ({ mission }) => {
  const router = useRouter();
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useMemo(() => {
    return workspace?.boards?.find((board) => +mission?.board_id === +board.id);
  }, [mission, workspace]);
  return (
    <li className="flex items-center gap-4 hover:bg-default-100 p-2 rounded-lg cursor-pointer border-1 border-solid border-default-200">
      <div className="flex flex-col ">
        <p
          className={`text-md text-muted-foreground ml-2 ${
            mission.status === "success" && "line-through"
          }`}
        >
          {mission?.name}
        </p>
        <div className="mt-1 flex gap-2 flex-wrap">
          <p
            className={`text-xs ${
              mission.status === "success" && "border-green-700 text-green-700"
            } ${
              mission.status === "expired" && "bg-red-700 text-red-700"
            }text-muted-foreground p-2   rounded-full  flex gap-1 items-center border-1 border-solid border-default-200`}
          >
            <ClockIcon size={14} />
            {mission?.endDateTime
              ? format(mission?.endDateTime, "d 'tháng' M ")
              : "Không có ngày hết hạn"}
          </p>
          <Breadcrumbs
            variant={"bordered"}
            radius="full"
            classNames={{ list: ["gap-y-1 gap-x-0"], separator: ["px-0"] }}
          >
            <BreadcrumbItem
              startContent={
                <Avatar
                  src={workspace?.background}
                  radius="md"
                  size="sm"
                  className="h-5 w-5 text-xs text-indigo-700 bg-indigo-100 shrink-0 m"
                  name={workspace?.name?.charAt(0).toUpperCase()}
                />
              }
            >
              <span className="block whitespace-nowrap text-ellipsis  overflow-hidden max-w-[180px]">
                {workspace?.name}
              </span>
            </BreadcrumbItem>
            <BreadcrumbItem
              onClick={() => router.push(`/b/${board.id}`)}
              startContent={
                <Avatar
                  src={board?.background}
                  radius="md"
                  size="sm"
                  className="h-5 w-5 text-indigo-700 bg-indigo-100"
                  name={board?.title?.charAt(0).toUpperCase()}
                />
              }
            >
              {board?.title}
            </BreadcrumbItem>
            <BreadcrumbItem onClick={() => router.push(`/b/${board.id}`)}>
              {mission?.cardTittle}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>
    </li>
  );
};
export default MissionItem;
