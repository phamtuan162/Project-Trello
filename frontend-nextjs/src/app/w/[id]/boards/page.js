"use client";
import { useCallback, useMemo, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";
import { SearchIcon, ChevronDownIcon, User2 } from "lucide-react";
import { BoardList } from "../_components/BoardList";
import capitalize from "@/utils/capitalize";

const statusOptions = [
  { name: "Gần Nhất Trước ↓", uid: "desc" },
  { name: "Xa Nhất Trước ↑", uid: "asc" },
  { name: "Theo bảng chữ cái A-Z", uid: "nameAZ" },
  { name: "Theo bảng chữ cái Z-A", uid: "nameZA" },
];

export default function PageBoards({ params }) {
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("desc");

  const boards = useMemo(() => {
    if (!workspace?.boards?.length) return [];

    return workspace.boards
      .filter((b) => b.workspace_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [workspace.boards]);

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

  return (
    <div className="w-full mb-20">
      <div className="px-2 md:px-4 mt-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700 mt-2">
          <User2 className="h-6 w-6 mr-2" />
          Các bảng của bạn
        </div>
        <Skeleton isLoaded={Boolean(workspace?.boards)}>
          <Suspense fallback={<BoardList.Skeleton />}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between gap-3 items-end">
                <div className="flex gap-2">
                  <Dropdown>
                    <DropdownTrigger className="hidden sm:flex">
                      <Button
                        endContent={
                          <ChevronDownIcon className="text-small" size={16} />
                        }
                        size="sm"
                        variant="flat"
                      >
                        Sắp xếp theo
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="status boards"
                      closeOnSelect={false}
                      selectedKeys={[statusFilter]}
                      selectionMode="single"
                      onSelectionChange={(value) =>
                        setStatusFilter([...value][0])
                      }
                    >
                      {statusOptions.map((status) => (
                        <DropdownItem key={status.uid} className="capitalize">
                          <div>
                            <p>{capitalize(status.name)}</p>
                          </div>
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <Input
                  isClearable
                  classNames={{
                    base: "w-full sm:max-w-[44%]",
                    inputWrapper: "border-1",
                  }}
                  placeholder="Tìm kiếm các bảng..."
                  size="xs"
                  startContent={<SearchIcon className="text-default-300" />}
                  value={filterValue}
                  variant="bordered"
                  onClear={() => setFilterValue("")}
                  onValueChange={(value) => setFilterValue(value)}
                />
              </div>
            </div>
            <BoardList boards={filteredItems} />
          </Suspense>
        </Skeleton>
      </div>
    </div>
  );
}
