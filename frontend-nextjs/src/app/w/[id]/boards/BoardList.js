"use client";
import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";
import { useSelector } from "react-redux";
import Link from "next/link";
export function BoardList({ boards }) {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards?.map((board) => (
          <Link
            key={board.id}
            href={`/b/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center  bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{
              backgroundImage: `url(${board.background})`,
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <FormPopoverBoard placement={"right"} length={boards?.length}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex bg-default-300 flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Tạo bảng mới</p>

            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
          </div>
        </FormPopoverBoard>
      </div>
    </div>
  );
}

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
