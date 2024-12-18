"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

import { boardSlice } from "@/stores/slices/boardSlice";
import { deleteColumn } from "@/services/workspaceApi";

const { deleteColumnInBoard } = boardSlice.actions;

const DeleteColumn = ({ children, column }) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state) => state.user.user);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const handleDeleteColumn = async () => {
    try {
      await toast
        .promise(async () => await deleteColumn(column.id), {
          pending: "Đang xóa...",
        })
        .then(() => {
          dispatch(deleteColumnInBoard(column.id));

          toast.success("Bạn đã xóa danh sách này thành công");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Popover
      placement="left"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        content: [" p-0"],
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-1">
            <p
              className="w-full text-center font-medium text-xs"
              style={{ color: "#44546f" }}
            >
              Xóa danh sách thẻ
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-lg p-1.5 absolute -top-1.5 right-3 hover:bg-default-200"
              type="button"
            >
              <X size={14} color={"#626f86"} />
            </button>
          </div>
          <div
            className="px-3  p-1 cursor-pointer"
            style={{ color: "#44546f" }}
          >
            <p className="text-xs mt-1">
              Khi bạn xóa danh sách thẻ, tất cả các thông tin và hoạt động liên
              quan đến danh sách sẽ bị xóa hoặc ngưng lại. Khi danh sách thẻ đã
              bị loại bỏ, bạn sẽ không còn thấy nó xuất hiện trên bảng làm việc.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2 interceptor-loading"
              color="danger"
              isDisabled={!checkRole}
              onClick={() => handleDeleteColumn()}
            >
              Xóa danh sách thẻ
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteColumn;
