import { useState, useEffect, useRef, useMemo } from "react";
import { Input, Avatar } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import FormPopoverBoard from "@/components/Form/FormPopoverBoard";
import { BoardIcon } from "@/components/Icon/BoardIcon";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import SortBoard from "@/components/actions/board/sortBoard";

export function BoardsAction() {
  const router = useRouter();
  const pathname = usePathname();

  const inputRef = useRef(null);

  const workspace = useSelector((state) => state.workspace.workspace);

  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("desc");
  const [isSearch, setIsSearch] = useState(false);
  const [isAction, setIsAction] = useState(false);

  const boards = useMemo(() => {
    if (!workspace?.boards?.length) return [];

    return workspace.boards
      .filter((b) => b.workspace_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [workspace?.boards]);

  const filteredItems = useMemo(() => {
    let filteredBoards = [...boards];

    if (filterValue) {
      filteredBoards = filteredBoards.filter((board) =>
        board.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredBoards.sort((a, b) => {
        switch (statusFilter) {
          case "asc":
            return new Date(a.created_at) - new Date(b.created_at); // Ngày tạo tăng dần
          case "desc":
            return new Date(b.created_at) - new Date(a.created_at); // Ngày tạo giảm dần
          case "nameAZ":
            return a.title.localeCompare(b.title); // A-Z
          case "nameZA":
            return b.title.localeCompare(a.title); // Z-A
          default:
            return 0; // Không thay đổi thứ tự nếu không khớp
        }
      });
    }

    return filteredBoards;
  }, [boards, filterValue, statusFilter]);

  useEffect(() => {
    if (isSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearch]);

  return (
    <div>
      {isSearch ? (
        <div className="my-2 lg:block hidden">
          <Input
            ref={inputRef}
            onChange={(e) => setFilterValue(e.target.value)}
            onBlur={() => {
              setFilterValue("");
              setIsSearch(!isSearch);
            }}
            variant="faded"
            classNames={{
              base: "max-w-full sm:max-w-[16rem] ",
              mainWrapper: "h-full ",
              input: "text-small ",
              inputWrapper:
                "h-full font-normal text-default-500 bg-white  dark:bg-default-500/20 rounded-lg ",
            }}
            placeholder="Tìm kiếm..."
            size="sm"
            startContent={<Search size={18} />}
          />
        </div>
      ) : (
        <div
          className="w-full mb-1  justify-between items-center lg:flex hidden"
          style={{ height: "32px" }}
          onMouseOver={() => setIsAction(true)}
          onMouseOut={() => setIsAction(false)}
        >
          <span
            className="text-sm font-medium  block"
            style={{ color: "rgb(101, 111, 125)" }}
          >
            Bảng
          </span>

          <div className={`items-center  ${isAction ? "flex" : "hidden"}`}>
            <SortBoard
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              isAction={isAction}
            >
              <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
                <MoreIcon size={14} />
              </button>
            </SortBoard>

            <button
              className="outline-0 p-1 rounded-lg hover:bg-default-100"
              onClick={() => setIsSearch(!isSearch)}
            >
              <Search size={14} />
            </button>
            <FormPopoverBoard placement={"top-right"}>
              <button className="outline-0 p-1 rounded-lg hover:bg-default-100">
                <Plus size={14} />
              </button>
            </FormPopoverBoard>
          </div>
        </div>
      )}
      {filteredItems?.slice(0, 3).map((board) => (
        <div
          onClick={() => router.push(`/b/${board.id}`)}
          key={board.id}
          className="lg:flex gap-2 p-1.5 items-center justify-center  lg:justify-start  hover:bg-default-100 rounded-lg w-auto mb-1 hidden"
        >
          <Avatar
            src={board?.background}
            radius="md"
            size="sm"
            className="h-6 w-6 text-indigo-700 bg-indigo-100"
            name={board?.title?.charAt(0).toUpperCase()}
          />
          <div className="flex items-center gap-2">
            <p className="lg:block hidden overflow-hidden whitespace-nowrap text-ellipsis rounded-lg  cursor-pointer max-w-[140px] text-sm ">
              {board?.title}
            </p>
          </div>
        </div>
      ))}
      <div
        onClick={() => router.push(`/w/${workspace.id}/boards`)}
        className={`flex p-1.5 hover:bg-default-100 rounded-lg items-center justify-center lg:justify-start gap-2 text-sm  cursor-pointer ${
          pathname.includes("boards")
            ? "bg-indigo-100 text-indigo-700"
            : "hover:bg-default-100"
        }`}
      >
        <BoardIcon size={16} />

        <span className="lg:block hidden">Xem tất cả bảng</span>
      </div>
    </div>
  );
}
