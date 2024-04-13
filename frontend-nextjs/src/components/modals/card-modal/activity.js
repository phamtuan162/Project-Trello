"use client";
import { ActivityIcon } from "lucide-react";
import { Avatar } from "@nextui-org/react";
const ActivityCard = () => {
  return (
    <div className="flex items-start gap-x-4 w-full">
      <ActivityIcon size={20} />
      <div className="w-full">
        <p className="font-semibold  mb-2 text-sm">Hoạt động</p>
        <ol className="mt-2 space-y-4">
          <li className="flex items-center gap-x-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold lowercase text-neutral-700"></span>
              </p>
              <p className="text-xs text-muted-foreground"></p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
export default ActivityCard;
