"use client";
import { Button } from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import ActivityBoardItem from "./ActivityBoardItem";
const ActivityBoard = ({ isActivity, setIsActivity }) => {
  const workspace = useSelector((state) => state.workspace.workspace);
  return (
    <div
      className={`h-full  shrink-0 bg-white p-3 relative overflow-y-auto board-menu ${
        isActivity && "board-menu-event"
      }`}
      style={{
        boxShadow: " 0 8px 12px #091e4226, 0 0 1px #091e424f",
      }}
    >
      <Button
        onClick={() => setIsActivity(false)}
        variant="ghost"
        className="min-w-3 rounded-lg border-0  hover:bg-default-300 text-xs p-1 absolute right-1 h-auto top-1"
      >
        <CloseIcon />
      </Button>
      <div>
        <p
          className="text-sm font-medium text-center text-neutral-600 pb-2"
          style={{ borderBottom: "1px solid #091e4224" }}
        >
          Hoạt động
        </p>
        <ol className="flex flex-col gap-3 mt-4">
          <p className="hidden last:block text-xs  text-center text-muted-foreground">
            Không có hoạt động nào
          </p>
          {workspace?.activities?.length > 0 &&
            workspace?.activities?.map((activity) => (
              <ActivityBoardItem key={activity.id} activity={activity} />
            ))}
        </ol>
      </div>
    </div>
  );
};
export default ActivityBoard;
