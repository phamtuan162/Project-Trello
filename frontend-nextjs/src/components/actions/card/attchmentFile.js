"use client";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { attachmentFileApi } from "@/services/workspaceApi";
import { boardSlice } from "@/stores/slices/boardSlice";
import { cardSlice } from "@/stores/slices/cardSlice";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AttachmentFile = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);

  const inputRef = useRef();

  const HandleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        toast.error("Chưa chọn tệp đính kèm!");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      await toast
        .promise(async () => await attachmentFileApi(card.id, formData), {
          pending: "Đang đính kèm tệp...",
        })
        .then((res) => {
          const { attachment, activity } = res;

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            attachments: [attachment, ...card.activities],
            activities: [activity, ...card.activities],
          };

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Đính kèm file thành công!");

          socket.emit("updateCard", cardUpdate);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
      e.target.value = "";
    }
  };

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
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="py-3 rounded-lg w-[300px]">
          <div className="relative pb-1">
            <p
              className="w-full text-center font-medium text-xs"
              style={{ color: "#44546f" }}
            >
              Đính kèm
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
            <p className="text-xs font-medium">
              Đính kèm tệp từ máy tính của bạn
            </p>
            <input
              ref={inputRef}
              onChange={(e) => HandleUploadFile(e)}
              type="file"
              accept="*/*"
              hidden
              alt="Upload"
              name="upl_file"
              id="upl_file"
            />
            <label
              htmlFor="upl_file"
              className="interceptor-loading bg-default-100 hover:bg-default-200 cursor-pointer  rounded-lg text-sm font-medium  mt-4   flex items-center justify-center py-2 px-6 relative z-50 data-[hover=true]:opacity-100"
            >
              Chọn tệp
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AttachmentFile;
