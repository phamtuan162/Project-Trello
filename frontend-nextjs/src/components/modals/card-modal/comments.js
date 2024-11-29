"use client";
import { MessagesSquare } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useRef, useState } from "react";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { useOnClickOutside } from "usehooks-ts";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { createCommentApi } from "@/services/commentApi";
import { toast } from "react-toastify";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import CommentItem from "./comment";

const { createCommentInCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const CommentCard = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isComment, setIsComment] = useState(false);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const formRef = useRef();
  const btnRef = useRef();

  const comments = useMemo(() => {
    if (!Array.isArray(card?.comments)) {
      return [];
    }

    return card.comments
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [card?.comments]);

  const validateContent = (value) => /^.{6,200}$/.test(value);

  const isInvalid = useMemo(() => {
    if (content === "") return false;
    return !validateContent(content);
  }, [content]);

  const enableEditing = () => {
    setIsComment(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsComment(false);
    setContent("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      disableEditing();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnRef.current?.click();
    }
  };

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (e) => {
    if (isInvalid) return;
    e.preventDefault();
    try {
      await toast
        .promise(
          async () =>
            await createCommentApi({
              content: content,
              card_id: card.id,
              user_id: user.id,
            }),
          { pending: "Đang bình luận..." }
        )
        .then((res) => {
          const { data } = res;

          dispatch(createCommentInCard(data));
          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              comments: [data, ...card.comments],
            })
          );
          toast.success("Bình luận thành công!");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsComment(false);
      setContent("");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-x-4 w-full">
        <MessagesSquare size={24} />
        <div className="w-full">
          <p className="font-semibold mb-2 text-sm">Bình luận</p>
        </div>
      </div>
      <div className="w-full">
        <div
          className={`flex ${
            isComment ? "items-start" : "items-center"
          } gap-1.5 w-full`}
        >
          <Avatar
            src={user?.avatar}
            name={user?.name?.charAt(0).toUpperCase()}
            radius="full"
            color="secondary"
            className="h-[32px] w-[32px] shrink-0"
          />
          <div className="grow">
            {isComment ? (
              <form
                ref={formRef}
                onSubmit={onSubmit}
                className="w-full flex flex-col gap-2 cursor-pointer"
              >
                <Textarea
                  placeholder="Viết bình luận..."
                  name="content"
                  classNames={{
                    input: "resize-y min-h-[60px]",
                    innerWrapper: "py-2",
                  }}
                  disableAnimation
                  disableAutosize
                  ref={inputRef}
                  variant="bordered"
                  value={content}
                  isInvalid={isInvalid}
                  color={isInvalid && "danger"}
                  errorMessage={
                    isInvalid &&
                    "Nội dung phải có ít nhất 6 ký tự và không được vượt quá 200 ký tự."
                  }
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={onKeyDown}
                  size="xs"
                />
                <div className="flex items-center gap-x-2 ">
                  <Button
                    isDisabled={isInvalid || content === ""}
                    type="submit"
                    size="sm"
                    radius="lg"
                    color="primary"
                    className="interceptor-loading cursor-pointer"
                    ref={btnRef}
                  >
                    Bình luận
                  </Button>
                  <span
                    className="interceptor-loading"
                    onClick={disableEditing}
                  >
                    <CloseIcon size={20} />
                  </span>
                </div>
              </form>
            ) : (
              <span
                onClick={enableEditing}
                className="cursor-pointer rounded-md flex items-center w-full text-xs p-2 h-[40px]"
                style={{
                  boxShadow: "0 1px 1px #091e4240, 0 0 1px #091e424f",
                }}
              >
                Viết bình luận...
              </span>
            )}
          </div>
        </div>

        {comments?.length > 0 && (
          <ol className="mt-2 space-y-4 mt-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
