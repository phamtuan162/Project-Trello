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
    return workspace?.boards?.find((board) => +mission.board_id === +board.id);
  }, [mission]);
  console.log(board);
  return (
    <li className="flex items-center gap-4 hover:bg-default-100 p-2 rounded-lg cursor-pointer border-1 border-solid border-default-200">
      <div className="flex flex-col space-y-1">
        <p
          className={`text-md text-muted-foreground ml-2 ${
            mission.status === "success" && "line-through"
          }`}
        >
          {mission?.name}
        </p>
        <div className="flex gap-2">
          <p
            className={`text-xs ${
              mission.status === "success" && "border-green-700 text-green-700"
            } ${
              mission.status === "expired" && "bg-red-700 text-red-700"
            }text-muted-foreground px-2   rounded-full  flex gap-1 items-center border-1 border-solid border-default-200`}
          >
            <ClockIcon size={14} />
            {mission?.endDateTime
              ? format(mission?.endDateTime, "d 'tháng' M ")
              : "Không có ngày hết hạn"}
          </p>
          <Breadcrumbs variant={"bordered"} radius="full">
            <BreadcrumbItem
              startContent={
                <Avatar
                  src={workspace?.background}
                  radius="md"
                  size="sm"
                  className="h-4 w-4 text-indigo-700 bg-indigo-100"
                  name={workspace?.name?.charAt(0).toUpperCase()}
                />
              }
            >
              {workspace?.name}
            </BreadcrumbItem>
            <BreadcrumbItem
              onClick={() => router.push(`/b/${board.id}`)}
              startContent={
                <Avatar
                  src={board?.background}
                  radius="md"
                  size="sm"
                  className="h-4 w-4 text-indigo-700 bg-indigo-100"
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
