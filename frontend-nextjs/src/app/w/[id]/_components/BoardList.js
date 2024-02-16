import { HelpCircle, User2 } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import FormPopoverBoard from "@/components/Form/FormPopoverBoard";
import Link from "next/link";
export function BoardList({ boards }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Các bảng của bạn
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards?.map((board) => (
          <Link
            key={board.id}
            href={`/b/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center  bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1555769571-2ca68b9197cb?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=M3w1MjY4NzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk2OTcyNDN8\u0026ixlib=rb-4.0.3\u0026q=80\u0026w=200")`,
            }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <FormPopoverBoard placement={"right"} open={false}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex bg-default-100 flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>

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
