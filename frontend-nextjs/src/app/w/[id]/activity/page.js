"use client";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "lucide-react";

import { Message } from "@/components/Message/Message";
import ActivityList from "./activity-list";
import Loading from "@/components/Loading/Loading";
import {
  Input,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  Button,
} from "@nextui-org/react";

const statusOptions = [
  { name: "Gần Nhất Trước ↓", uid: "desc" },
  { name: "Xa Nhất Trước ↑", uid: "asc" },
];

const operateOptions = [
  { name: "Board", uid: "board" },
  { name: "Column", uid: "column" },
  { name: "Card", uid: "card" },
];

export default function pageActivity() {
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("desc");
  const [operateFilter, setOperateFilter] = useState("all");

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    if (!workspace?.activities?.length) return [];

    // Bước 1: Loại bỏ các phần tử null hoặc undefined
    let result = workspace.activities.filter((activity) => activity != null);

    // Bước 2: Lọc theo từ khóa tìm kiếm (nếu có)
    if (hasSearchFilter) {
      result = result.filter((activity) =>
        activity.userName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Bước 3: Lọc theo loại hoạt động (operateFilter)
    if (operateFilter && operateFilter !== "all") {
      result = result.filter((activity) => {
        if (operateFilter === "board")
          return activity.board_id || activity.action.includes(operateFilter);
        if (operateFilter === "column")
          return activity.column_id || activity.action.includes(operateFilter);
        if (operateFilter === "card")
          return activity.action.includes(operateFilter);
        return false;
      });
    }

    // Bước 4: Sắp xếp theo thứ tự (statusFilter)
    if (statusFilter) {
      result = result.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        if (statusFilter === "asc") return dateA - dateB; // Tăng dần
        if (statusFilter === "desc") return dateB - dateA; // Giảm dần
        return 0;
      });
    }

    return result;
  }, [workspace.activities, filterValue, statusFilter, operateFilter]);

  return workspace.activities ? (
    <div className="h-full ">
      <h1 className="text-xl font-medium mt-4">
        Hoạt động không gian làm việc
      </h1>
      <p className="mt-1">
        Trang này cho phép các thành viên trong Không gian làm việc xem và tìm
        kiếm các hoạt động theo tên người dùng. Họ có thể theo dõi tất cả các
        hoạt động đang diễn ra trong không gian làm việc.
      </p>
      <div className="mt-3 ">
        <div className="flex gap-2 items-end mb-2">
          <Input
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Tìm kiếm theo tên thành viên..."
            size="xs"
            value={filterValue}
            variant="bordered"
            type="search"
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Dropdown classNames={{ content: ["min-w-22"] }}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={
                  <ChevronDownIcon className="text-small" size={16} />
                }
                size="sm"
                variant="flat"
              >
                Ngày tạo
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="status activities"
              closeOnSelect={false}
              selectedKeys={[statusFilter]}
              selectionMode="single"
              onSelectionChange={(value) => setStatusFilter([...value][0])}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  <div>
                    <p className="text-xs font-medium">{status.name}</p>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown classNames={{ content: ["min-w-22"] }}>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={
                  <ChevronDownIcon className="text-small" size={16} />
                }
                size="sm"
                variant="flat"
              >
                Thao tác với
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="operates activities"
              closeOnSelect={false}
              selectedKeys={[operateFilter]}
              selectionMode="single"
              onSelectionChange={(value) => setOperateFilter([...value][0])}
            >
              {operateOptions.map((operate) => (
                <DropdownItem key={operate.uid} className="capitalize">
                  <div>
                    <p className="text-xs font-medium">{operate.name}</p>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {operateFilter === "card" && (
          <Message
            type="warning"
            message="Bạn chỉ có thể xem một số thao tác với card. Để xem chi tiết, vui lòng vào card."
          />
        )}

        <ActivityList activities={filteredItems} />
      </div>
    </div>
  ) : (
    <Loading backgroundColor={"white"} zIndex={"100"} />
  );
}
