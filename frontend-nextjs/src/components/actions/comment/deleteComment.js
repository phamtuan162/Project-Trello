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
import { useMemo, useState } from "react";
import { cardSlice } from "@/stores/slices/cardSlice";
import { deleteCommentApi } from "@/services/commentApi";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;
const DeleteComment = ({ comment, children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const userComment = useMemo(() => {
    return (
      workspace?.users?.find((user) => +user.id === +comment.user_id) || null
    );
  }, [workspace]);

  const HandleDeleteComment = async () => {
    setIsLoading(true);

    if (+user.id === +comment.user_id) {
      deleteCommentApi(comment.id).then((data) => {
        if (data.status === 200) {
          const commentsUpdate = card.comments.filter(
            (item) => +item.id !== +comment.id
          );
          const cardUpdate = {
            ...card,
            comments: commentsUpdate,
          };
          dispatch(updateCard(cardUpdate));
        } else {
          const error = data.error;
          toast.error(error);
        }
        setIsLoading(false);
      });
    }
  };

  if (user.id && userComment.id) {
    if (+user.id !== +userComment.id) {
      return;
    }
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
              className="w-full h-[40px] mt-2"
              color="danger"
              isDisabled={isLoading}
              onClick={() => HandleDeleteComment()}
            >
              {isLoading ? <CircularProgress /> : "Xóa bình luận"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default DeleteComment;
