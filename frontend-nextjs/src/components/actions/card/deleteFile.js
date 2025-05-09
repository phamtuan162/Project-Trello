"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { deleteFileApi } from "@/services/workspaceApi";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const DeleteFile = ({ children, attachment }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const HandleDeleteFile = async () => {
    try {
      await toast
        .promise(async () => await deleteFileApi(attachment.id), {
          pending: "Đang xóa...",
        })
        .then((res) => {
          const { activity } = res;

          const attachmentsUpdate = card.attachments.filter(
            (item) => +item.id !== +attachment.id
          );

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            attachments: attachmentsUpdate,
            activities: [activity, ...card.activities],
          };

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Xóa thành công");

          socket.emit("updateCard", cardUpdate);
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
              className="mt-2 w-full interceptor-loading"
              isDisabled={
                user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner"
              }
            >
              Xóa
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteFile;
