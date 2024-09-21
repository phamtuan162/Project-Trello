"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { cardSlice } from "@/stores/slices/cardSlice";
import { deleteWorkApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;
const DeleteWork = ({ work }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const HandleDeleteWork = async () => {
    setIsLoading(true);
    deleteWorkApi(work.id).then((data) => {
      if (data.status === 200) {
        const activities =
          card.activities && card.activities.length > 0
            ? [data.data, ...card.activities]
            : [data.data];
        const worksUpdate = card.works.filter((item) => +item.id !== +work.id);
        const cardUpdate = {
          ...card,
          works: worksUpdate,
          activities: activities,
        };
        dispatch(updateCard(cardUpdate));
      } else {
        const error = data.error;
        toast.error(error);
      }
      setIsLoading(false);
    });
  };
  if (
    user?.role?.toLowerCase() !== "admin" &&
    user?.role?.toLowerCase() !== "owner"
  ) {
    return;
  }

  return (
    <Popover
      placement="right"
      showArrow
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      classNames={{
        content: [" p-0"],
      }}
    >
      <PopoverTrigger>
        <button className="text-xs p-1 px-2  rounded-sm bg-gray-200">
          Xóa
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-1">
            <p
              className="w-full text-center font-medium text-xs"
              style={{ color: "#44546f" }}
            >
              Bạn muốn xóa {work?.title} ?
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
              Danh sách công việc sẽ bị xoá vĩnh viễn và không bao giờ lấy lại
              được.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2"
              color="danger"
              isDisabled={isLoading}
              onClick={() => HandleDeleteWork()}
            >
              {isLoading ? <CircularProgress /> : "Xóa danh sách công việc"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteWork;
