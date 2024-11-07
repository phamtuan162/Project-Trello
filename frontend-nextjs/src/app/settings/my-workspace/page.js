"use client";
import { useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
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
import { PlusIcon, ChevronDownIcon } from "lucide-react";
import FormCreateWorkspace from "@/components/Form/FormCreateWorkspace";
import RestoreWorkspace from "./storeWorkspace";
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "desc",
  "total_user",
  "deleted_at",
  "actions",
];
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "MEMBER", uid: "total_user", sortable: true },
  { name: "DESC", uid: "desc" },
  { name: "STATUS", uid: "deleted_at", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];
const statusOptions = [
  { name: "Normal", uid: "normal" },
  { name: "Deleted", uid: "deleted" },
];
const PageMyWorkspace = () => {
  const dispatch = useDispatch();
  const my_workspaces = useSelector(
    (state) => state.my_workspaces.my_workspaces
  );
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  const my_workspaces_sort = useMemo(() => {
    return (
      my_workspaces?.filter((item) => item.role.toLowerCase() === "owner") || []
    );
  }, [my_workspaces]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredWorkspaces =
      my_workspaces_sort?.filter(
        (item) => item !== null && item !== undefined
      ) || [];

    if (hasSearchFilter) {
      filteredWorkspaces = filteredWorkspaces.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filteredWorkspaces = filteredWorkspaces.filter((item) => {
        return statusFilter === "normal" ? !item.deleted_at : item.deleted_at;
      });
    }

    return filteredWorkspaces;
  }, [my_workspaces_sort, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const sortDirection = sortDescriptor.direction === "descending" ? -1 : 1;

      if (first === null || second === null) {
        if (first === second) return 0;
        if (first === null) return sortDirection;
        if (second === null) return -sortDirection;
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return cmp * sortDirection;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{
                radius: "full",
                size: "sm",

                color: "secondary",
                name: cellValue.charAt(0).toUpperCase(),
              }}
              classNames={{
                description: "text-default-500",
              }}
              name={cellValue}
            />
          );

        case "total_user":
          return (
            <p className="text-bold text-small capitalize">{`${cellValue} thành viên`}</p>
          );

        case "deleted_at":
          return (
            <Chip
              className="capitalize "
              color={item.deleted_at ? "danger" : "success"}
              variant="flat"
              size="sm"
            >
              {item.deleted_at ? "Đã xóa" : "Bình thường"}
            </Chip>
          );
        case "actions":
          return (
            item.deleted_at && (
              <RestoreWorkspace workspace={item}>
                <button
                  type="button"
                  className=" bg-red-600 text-white flex items-center justify-center gap-1 px-2 h-[30px] font-medium text-xs  w-[90px]  rounded-md focus-visible:outline-0"
                  color="danger"
                >
                  "Khôi phục"
                </button>
              </RestoreWorkspace>
            )
          );
        default:
          return cellValue;
      }
    },
    [my_workspaces_sort]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Tìm kiếm bằng tên..."
            size="xs"
            type="search"
            value={filterValue}
            variant="bordered"
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
                aria-label="status my workspaces"
                closeOnSelect={false}
                selectedKeys={[statusFilter]}
                selectionMode="single"
                onSelectionChange={(value) => setStatusFilter([...value][0])}
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
            <FormCreateWorkspace>
              <button
                className=" bg-foreground text-background text-white flex gap-1 justify-center items-center px-2 py-1.5 rounded-lg text-sm"
                style={{ background: "#7f77f1" }}
                size="sm"
              >
                <PlusIcon size={16} />
                Thêm
              </button>
            </FormCreateWorkspace>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Tổng cộng {my_workspaces_sort?.length} Không gian làm việc
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
    my_workspaces_sort,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
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

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-5xl"],
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
    <div className="mt-2 max-w-5xl">
      <h1 className="text-2xl font-medium">Không gian làm việc của tôi</h1>
      <p className="mt-1">
        Các không gian làm việc do bạn tạo ra là nơi bạn có thể quản lý dự án,
        cộng tác với đồng đội, và theo dõi tiến độ công việc. Bạn có thể tạo
        bảng, thêm thẻ, và gán nhiệm vụ cho các thành viên trong nhóm để đảm bảo
        mọi thứ diễn ra suôn sẻ và hiệu quả.
      </p>

      <Table
        isCompact
        classNames={classNames}
        aria-label="Table my-workspaces"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background ",
          },
        }}
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
        <TableBody emptyContent={"No workspace found"} items={sortedItems}>
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
};
export default PageMyWorkspace;
