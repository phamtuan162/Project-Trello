"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@nextui-org/react";
import { SearchIcon, ChevronDownIcon, X } from "lucide-react";
import { columns, statusOptions } from "./data";
import FormInviteUser from "../_components/FormInviteUser";
import LeaveWorkspace from "./LeaveWorkspace";
import { decentRoleApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { toast } from "react-toastify";
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];
const { decentRoleUser, updateWorkspace } = workspaceSlice.actions;
export default function PageWorkspaceUsers() {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const userActive = useSelector((state) => state.user.user);
  const socket = useSelector((state) => state.socket.socket);
  const sortedUsers = React.useMemo(() => {
    return workspace && workspace.users
      ? [...workspace.users].sort((a, b) => {
          const roleA = a.role.toLowerCase();
          const roleB = b.role.toLowerCase();
          if (roleA === "owner") return -1;
          if (roleB === "owner") return 1;
          if (roleA === "admin") return -1;
          if (roleB === "admin") return 1;
          return 0; // Mặc định sắp xếp không thay đổi vị trí
        })
      : [];
  }, [workspace]);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const roles = [
    {
      name: "Owner",
      value: "owner",
      desc: "Quản lý Không gian, Con người, Thanh toán và các cài đặt Không gian làm việc khác.",
    },
    {
      name: "Admin",
      value: "admin",
      desc: "Quản lý Không gian, Con người, Thanh toán và các cài đặt Không gian làm việc khác.",
    },
    {
      name: "Member",
      value: "member",
      desc: "Thao tác với các phần được chỉ định và giao cho.",
    },
    {
      name: "Guest",
      value: "guest",
      desc: "Quyền truy cập vào Không gian công cộng, Tài liệu và Trang tổng quan.",
    },
  ];
  useEffect(() => {
    const handleUserOnline = (data) => {
      console.log(data);
      if (data.id && workspace?.users?.length > 0) {
        const usersUpdate = workspace.users.map((item) => {
          if (+item.id === +data.id) {
            return { ...item, isOnline: data.isOnline };
          }
          return item;
        });
        if (usersUpdate) {
          dispatch(updateWorkspace({ ...workspace, users: usersUpdate }));
        }
      }
    };

    if (socket) {
      socket.on("getUserOnline", handleUserOnline);

      return () => {
        socket.off("getUserOnline", handleUserOnline);
      };
    }
  }, [socket]);
  const rolesUser = React.useMemo(() => {
    if (userActive?.role?.toLowerCase() === "admin") {
      return roles.filter(
        (role) =>
          role.value.toLowerCase() !== "admin" &&
          role.value.toLowerCase() !== "owner"
      );
    }
    if (userActive?.role?.toLowerCase() === "owner") {
      return roles.filter((role) => role.value.toLowerCase() !== "owner");
    }
    return roles;
  }, [userActive]);
  const pages = Math.ceil(workspace?.users?.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = workspace?.users
      ? sortedUsers.filter((user) => user !== null && user !== undefined)
      : [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.isOnline ? "online" : "offline")
      );
    }

    return filteredUsers;
  }, [workspace, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const handleDecentRole = async (role, user) => {
    const roleNew = [...role][0];
    if (roleNew && user.id) {
      decentRoleApi(workspace.id, {
        user_id: user.id,
        role: roleNew,
      }).then((data) => {
        if (data.status === 200) {
          const updatedUsers = workspace.users.map((item) => {
            return +item.id === user.id ? { ...item, role: roleNew } : item;
          });

          const newActivities =
            workspace.activities.length > 0
              ? workspace.activities.concat(data.data)
              : [data.data];

          const workspaceUpdate = {
            ...workspace,
            users: updatedUsers,
            activities: newActivities,
          };

          dispatch(updateWorkspace(workspaceUpdate));

          socket.emit("sendNotification", {
            user_id: user.id,
            userName: userActive.name,
            userAvatar: userActive.avatar,
            type: "cancel_user",
            content: `đã thay đổi tư cách của bạn thành ${roleNew} trong Không gian làm việc ${workspace.name} `,
          });
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
    }
  };
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "full",
              size: "sm",
              src: user.avatar,
              color: "secondary",
              name: cellValue.charAt(0).toUpperCase(),
            }}
            classNames={{
              description: "text-default-500",
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return user.role.toLowerCase() === "owner" ||
          (userActive?.role?.toLowerCase() !== "admin" &&
            userActive?.role?.toLowerCase() !== "owner") ||
          +userActive.id === +user.id ? (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        ) : (
          <Select
            variant="bordered"
            size="xs"
            aria-label="Roles"
            classNames={{
              label: "group-data-[filled=true]:-translate-y-5",
              trigger: "w-[100px]",
            }}
            selectedKeys={new Set([user.role.toLowerCase()])}
            onSelectionChange={(role) => handleDecentRole(role, user)}
          >
            {rolesUser.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.name}
              </SelectItem>
            ))}
          </Select>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={user.isOnline ? "success" : "default"}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return <LeaveWorkspace user={user} />;
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Tìm kiếm bằng tên hoặc email..."
            size="xs"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
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
                  Trạng thái
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
                      <p>{capitalize(status.name)}</p>
                      <p className="max-w-[200px] text-xs text-default-400 whitespace-pre-wrap mt-2">
                        {status.desc}
                      </p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <ChevronDownIcon className="text-small" size={16} />
                  }
                  size="sm"
                  variant="flat"
                >
                  Các cột
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <FormInviteUser rolesUser={rolesUser} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng cộng {workspace?.users?.length.toString()} người dùng tham gia
          </span>
          <label className="flex items-center text-default-400 text-small">
            Hàng trên mỗi trang:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    workspace?.users?.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} trên ${filteredItems.length} đã chọn`}
        </span>
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Trước
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Sau
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div>
      <h1 className="text-xl font-medium mt-4">
        Thành viên không gian làm việc
      </h1>
      <p className="mt-1">
        Các thành viên trong Không gian làm việc có thể xem và tham gia tất cả
        các bảng Không gian làm việc hiển thị và tạo ra các bảng mới trong Không
        gian làm việc.
      </p>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background ",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        className="mt-9 pb-8 "
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
