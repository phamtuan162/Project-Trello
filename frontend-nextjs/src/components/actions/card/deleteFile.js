"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createWorkApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { cardSlice } from "@/stores/slices/cardSlice";
import { deleteFileApi } from "@/services/workspaceApi";
const { updateCard } = cardSlice.actions;
const DeleteFile = ({ children, attachment }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const HandleDeleteFile = async () => {
    setIsLoading(true);

    deleteFileApi(attachment.id).then((data) => {
      if (data.status === 200) {
        const attachmentsUpdate = card.attachments.filter(
          (item) => +item.id !== +attachment.id
        );
        const cardUpdate = {
          ...card,
          attachments: attachmentsUpdate,
          activities: [data.data, ...card.activities],
        };
        dispatch(updateCard(cardUpdate));
        setIsLoading(false);
        setIsOpen(false);
      } else {
        const error = data.error;
        toast.error(error);
        setIsLoading(false);
      }
    });
  };
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-3 px-3">
        <div className="w-full">
          <div className="flex justify-between items-center relative">
            <h1 className="grow text-center ">
              Bạn muốn xóa tập tin đính kèm?
            </h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon size={16} />
            </Button>
          </div>
          <div
            className="px-3  p-1 cursor-pointer"
            style={{ color: "#44546f" }}
          >
            <p className="text-xs mt-1">
              Tập tin đính kèm sẽ bị xoá vĩnh viễn và bạn sẽ không thể hoàn tác.
            </p>

            <Button
              onClick={() => HandleDeleteFile()}
              type="button"
              color="danger"
              className="mt-2 w-full"
              isDisabled={
                (user?.role?.toLowerCase() !== "admin" &&
                  user?.role?.toLowerCase() !== "owner") ||
                isLoading
              }
            >
              {isLoading ? <CircularProgress /> : "Xóa"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteFile;
