"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";

import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { deleteCardApi } from "@/services/workspaceApi";

const { deleteCardInBoard } = boardSlice.actions;
const { clearAndHideCard } = cardSlice.actions;
const { updateActivitiesInWorkspace } = workspaceSlice.actions;

const DeleteCard = ({ children, placement = "right" }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const HandleDeleteCard = async () => {
    try {
      await toast
        .promise(async () => await deleteCardApi(card.id), {
          pending: "Đang xóa",
        })
        .then((res) => {
          const { activity } = res;

          dispatch(deleteCardInBoard(card));

          dispatch(clearAndHideCard());

          dispatch(updateActivitiesInWorkspace(activity));

          toast.success("Xóa card thành công");
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
      placement={placement}
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
              Xóa thẻ
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
              Khi bạn xóa một thẻ, tất cả thông tin và hoạt động liên quan như
              tiêu đề, mô tả, ngày hết hạn, bình luận và tệp đính kèm sẽ bị xóa.
              Thẻ không còn xuất hiện trong danh sách công việc hoặc trên bảng
              làm việc.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2 interceptor-loading"
              color="danger"
              isDisabled={
                user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner"
              }
              onClick={() => HandleDeleteCard()}
            >
              Xóa thẻ
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteCard;
