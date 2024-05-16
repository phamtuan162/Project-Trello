"use client";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
import { generateActivityMessage } from "@/utils/formatters";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
const ActivitiesRecent = ({ activitiesRecent }) => {
  const router = useRouter();
  const { id } = useParams();
  return (
    <div className="border-1 border-solid rounded-lg border-default-200 p-2 px-4 flex flex-col">
      <h2>Hoạt động gần đây</h2>
      <ol className="space-y-2 mt-2 flex flex-col grow">
        <p className="hidden last:block text-xs  text-center text-muted-foreground">
          Không có hoạt động nào gần đây
        </p>
        {activitiesRecent?.length > 0 &&
          activitiesRecent.map((activity) => (
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-default-100 p-1 rounded-lg"
              key={activity.id}
            >
              <Avatar
                src={activity?.userAvatar}
                name={activity?.userName?.charAt(0).toUpperCase()}
                radius="full"
                color="secondary"
                className="h-[40px] w-[40px] text-lg shrink-0"
              />
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold  text-neutral-700">
                    {activity?.userName}
                  </span>
                  {generateActivityMessage(activity)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity?.created_at &&
                    formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: vi,
                    })}
                </p>
              </div>
            </li>
          ))}
        {activitiesRecent?.length > 5 && (
          <div className="w-full flex justify-center grow items-end">
            <button
              onClick={() => router.push(`/w/${id}/activity`)}
              className="p-1 px-2 inline-block text-xs m rounded-full bg-default-100"
            >
              Xem thêm
            </button>
          </div>
        )}
      </ol>
    </div>
  );
};

export default ActivitiesRecent;
