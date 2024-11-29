"use client";
import { useOnClickOutside } from "usehooks-ts";
import { useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar, Button, Textarea } from "@nextui-org/react";
import { toast } from "react-toastify";

import DeleteComment from "@/components/actions/comment/deleteComment";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { updateCommentApi } from "@/services/commentApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const card = useSelector((state) => state.card.card);
  const inputRef = useRef(null);
  const formRef = useRef();
  const btnRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [content, setContent] = useState("oke");

  const userComment = useMemo(() => {
    return workspace?.users?.find((u) => +u.id === +comment.user_id) || null;
  }, [workspace?.users]);

  const canEditComment = useMemo(() => {
    return user.id && userComment?.id && +user.id === +userComment.id;
  }, [userComment]);

  const canDeleteComment = useMemo(() => {
    if (+user.id === +comment.user_id) return true; // Người dùng tự xóa comment của mình

    if (user.id && userComment.id && +user.id !== +userComment.id) {
      const userRole = user.role.toLowerCase();
      const userCommentRole = userComment.role.toLowerCase();
      const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
      const isAdminEditingOwner =
        userRole === "admin" && userCommentRole === "owner";

      if (!isOwnerOrAdmin || isAdminEditingOwner) return false;
    }

    return true;
  }, [userComment]);

  const validateContent = (value) => /^.{0,200}$/.test(value);

  const isInvalid = useMemo(() => {
    if (inputRef.current && inputRef.currefnt.value) {
      const value = inputRef.current.value;
      if (value === "") return false;
      return !validateContent(value);
    }
    return false;
  }, [inputRef]);

  const enableEditing = () => {
    setIsEdit(true);
    setTimeout(() => {
      const input = inputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  };

  const disableEditing = () => {
    setIsEdit(false);
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

  const onSubmit = async () => {
    if (isInvalid) return;
    try {
      await toast
        .promise(
          async () =>
            await updateCommentApi(comment.id, {
              content: content,
            }),
          { pending: "Đang chỉnh sửa..." }
        )
        .then((res) => {
          const commentsUpdate = card.comments.map((c) => {
            if (c.id === comment.id)
              return { ...comment, content: content, isEdit: true };
            return c;
          });

          dispatch(
            updateCard({
              comments: commentsUpdate,
            })
          );

          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              comments: commentsUpdate,
            })
          );

          toast.success("Chỉnh sửa comment thành công");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsEdit(false);
    }
  };

  return (
    <li className="flex items-start gap-1.5 w-full">
      <Avatar
        src={comment?.userAvatar}
        name={comment?.userName?.charAt(0).toUpperCase()}
        radius="full"
        color="secondary"
        className="h-[32px] w-[32px] shrink-0 text-lg"
      />
      <div className="flex flex-col  space-y-1 w-full">
        {isEdit ? (
          <form
            ref={formRef}
            action={onSubmit}
            className="w-full flex flex-col gap-2"
          >
            <Textarea
              name="content"
              classNames={{
                input: "resize-y min-h-[60px] ",
                innerWrapper: "py-2",
              }}
              disableAnimation
              disableAutosize
              ref={inputRef}
              variant="bordered"
              defaultValue={comment?.content}
              size="xs"
              isInvalid={isInvalid}
              color={isInvalid && "danger"}
              errorMessage={
                isInvalid && "Bạn đã nhập quá 200 ký tự được cho phép"
              }
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <div className="flex items-center gap-x-2">
              <Button
                isDisabled={isInvalid || content === ""}
                type="submit"
                size="sm"
                radius="lg"
                color="primary"
                className="interceptor-loading"
                ref={btnRef}
              >
                Lưu
              </Button>
              <span className="interceptor-loading" onClick={disableEditing}>
                <CloseIcon size={20} />
              </span>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold  text-neutral-700 mr-2">
                {comment?.userName}
              </span>
              {formatDistanceToNow(new Date(comment?.created_at), {
                addSuffix: true,
                locale: vi,
              })}
              {comment?.isEdit && " (đã sửa)"}
            </p>
            <p
              className="cursor-pointer rounded-md flex items-center   w-full text-xs p-2  w-full h-[40px] "
              style={{ boxShadow: "0 1px 1px #091e4240, 0 0 1px #091e424f" }}
            >
              {comment?.content}
            </p>
            <div className="flex text-xs ml-2">
              {canEditComment && (
                <span
                  className=" cursor-pointer"
                  onClick={() => enableEditing()}
                >
                  <a className="underline ">Chỉnh sửa</a>
                </span>
              )}

              <span className="mx-1">•</span>
              {canDeleteComment && (
                <DeleteComment comment={comment}>
                  <span className=" cursor-pointer ">
                    <a className="underline">Xóa</a>
                  </span>
                </DeleteComment>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
};
export default CommentItem;
