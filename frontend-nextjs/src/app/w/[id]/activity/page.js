"use client";
import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import ActivityList from "./activity-list";
import Loading from "@/components/Loading/Loading";
import {
  Input,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownTrigger,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { SearchIcon, ChevronDownIcon } from "lucide-react";

export default function pageActivity() {
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const statusOptions = [
    { name: "Gần Nhất Trước ↓", uid: "desc" },
    { name: "Xa Nhất Trước ↑", uid: "asc" },
  ];
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const activities = useMemo(() => {
    return workspace?.activities?.length > 0
      ? workspace.activities
          .filter(
            (activity) =>
              activity.board_id ||
              (!activity.card_id && !activity.board_id && !activity.column_id)
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : [];
  }, [workspace]);

  const filteredItems = useMemo(() => {
    let filteredActivities = workspace?.activities
      ? activities.filter(
          (activity) => activity !== null && activity !== undefined
        )
      : [];
    if (hasSearchFilter) {
      filteredActivities = filteredActivities.filter((activity) =>
        activity.userName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      console.log(statusFilter);
      if (Array.from(statusFilter).includes("asc")) {
        filteredActivities.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      } else if (Array.from(statusFilter).includes("desc")) {
        filteredActivities.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
    }

    return filteredActivities;
  }, [workspace, filterValue, statusFilter]);

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
        <div className="flex gap-2 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Tìm kiếm bằng tên..."
            size="xs"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
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
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
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
        </div>

        {filteredItems.length > 0 ? (
          <ActivityList activities={filteredItems} />
        ) : (
          <p className="hidden last:block text-xs  text-center text-muted-foreground mt-2">
            Không tìm thấy hoạt động của người này
          </p>
        )}
      </div>
    </div>
  ) : (
    <Loading backgroundColor={"white"} zIndex={"100"} />
  );
}
