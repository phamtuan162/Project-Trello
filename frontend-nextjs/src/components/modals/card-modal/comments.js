"use client";
import { MessagesSquare } from "lucide-react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useRef, useState } from "react";
import { Avatar, Button, Textarea, CircularProgress } from "@nextui-org/react";
import { useOnClickOutside } from "usehooks-ts";
import { createComment } from "@/services/commentApi";
import { toast } from "react-toastify";
import { cardSlice } from "@/stores/slices/cardSlice";
import CommentItem from "./comment";

const { updateCard } = cardSlice.actions;

const CommentCard = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [isComment, setIsComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const formRef = useRef();
  const btnRef = useRef();
  const comments = useMemo(() => {
    if (!card || !Array.isArray(card.comments)) {
      return [];
    }

    return [...card.comments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [card]);

  const validateContent = (value) => /^.{0,200}$/.test(value);

  const isInvalid = useMemo(() => {
    if (content === "") return false;
    return !validateContent(content);
  }, [content]);

  const enableEditing = () => {
    setIsComment(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableEditing = () => {
    setIsComment(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      disableEditing();
    }
    if (e.key === "Enter") {
      btnRef.current.click();
    }
  };

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLoading) {
        setIsLoading(true);

        const data = await createComment({
          content: content,
          card_id: card.id,
          user_id: user.id,
        });

        if (data.status === 200) {
          const commentNew = data.data;
          const commentsUpdate = [...card.comments, commentNew];
          const cardUpdate = { ...card, comments: commentsUpdate };
          dispatch(updateCard(cardUpdate));
          setContent("");
        } else {
          toast.error(data.error);
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo bình luận.");
    } finally {
      setIsComment(false);
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
                className="w-full flex flex-col gap-2"
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
                    isInvalid && "Bạn đã nhập quá 200 ký tự được cho phép"
                  }
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={onKeyDown}
                  size="xs"
                />
                <div className="flex items-center gap-x-2">
                  <Button
                    isDisabled={isInvalid || content === "" || isLoading}
                    type="submit"
                    size="sm"
                    radius="lg"
                    color="primary"
                    ref={btnRef}
                  >
                    {isLoading ? <CircularProgress /> : "Lưu"}
                  </Button>
                  {!isLoading && (
                    <span onClick={disableEditing}>
                      <CloseIcon size={20} />
                    </span>
                  )}
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
