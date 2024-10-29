"use client";
import { useState, useMemo } from "react";
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
} from "@nextui-org/react";
import { ChevronDownIcon } from "lucide-react";

export default function pageActivity() {
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("desc");
  const statusOptions = [
    { name: "Gần Nhất Trước ↓", uid: "desc" },
    { name: "Xa Nhất Trước ↑", uid: "asc" },
  ];

  const hasSearchFilter = Boolean(filterValue);

  const activities = useMemo(() => {
    return workspace?.activities?.length > 0
      ? workspace.activities
          .filter((activity) => activity.workspace_id)
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

    if (statusFilter) {
      filteredActivities.sort((a, b) => {
        switch (statusFilter) {
          case "asc":
            return new Date(a.created_at) - new Date(b.created_at); // Ngày tạo tăng dần
          case "desc":
            return new Date(b.created_at) - new Date(a.created_at); // Ngày tạo giảm dần
          default:
            return 0; // Không thay đổi thứ tự nếu không khớp
        }
      });
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
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Tìm kiếm bằng tên..."
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
        </div>

        <ActivityList activities={filteredItems} />
      </div>
    </div>
  ) : (
    <Loading backgroundColor={"white"} zIndex={"100"} />
  );
}
