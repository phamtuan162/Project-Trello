"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { deleteCommentApi } from "@/services/commentApi";
import { socket } from "@/socket";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const DeleteComment = ({ comment, children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);

  const HandleDeleteComment = async () => {
    try {
      await toast
        .promise(async () => await deleteCommentApi(comment.id), {
          pending: "Đang xóa...",
        })
        .then((res) => {
          const commentsUpdate = card.comments.filter(
            (c) => c.id !== comment.id
          );

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            comments: commentsUpdate,
          };

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));
          toast.success("Xóa comment thành công");

          socket.emit("updateCard", cardUpdate);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpen(false);
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
              Bạn muốn xóa bình luận?
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
              Bình luận sẽ bị xóa vĩnh viễn và bạn không thể hoàn tác.
            </p>
            <Button
              type="button"
              className="w-full h-[40px] mt-2 interceptor-loading"
              color="danger"
              onClick={() => HandleDeleteComment()}
            >
              Xóa bình luận
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteComment;
