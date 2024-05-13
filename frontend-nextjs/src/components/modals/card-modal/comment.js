"use client";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
import DeleteComment from "@/components/actions/comment/deleteComment";
const CommentItem = ({ comment }) => {
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
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold  text-neutral-700 mr-2">
            {comment.userName}
          </span>
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
            locale: vi,
          })}
          {comment?.isEdit && "(Đã sửa)"}
        </p>
        <p
          className="cursor-pointer rounded-md flex items-center   w-full text-xs p-2  w-full h-[40px] "
          style={{ boxShadow: "0 1px 1px #091e4240, 0 0 1px #091e424f" }}
        >
          {comment?.content}
        </p>
        <div className="flex text-xs ml-2">
          <span className=" cursor-pointer">
            <a className="underline ">Chỉnh sửa</a>
          </span>
          <span className="mx-1">•</span>
          <DeleteComment comment={comment}>
            <span className=" cursor-pointer ">
              <a className="underline">Xóa</a>
            </span>
          </DeleteComment>
        </div>
      </div>
    </li>
  );
};
export default CommentItem;
