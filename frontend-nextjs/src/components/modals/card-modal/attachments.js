"use client";
import { Paperclip } from "lucide-react";
import AttachmentFile from "@/components/actions/card/attchmentFile";
import AttachmentItem from "./attachment";
import { useSelector } from "react-redux";
const AttachmentList = () => {
  const card = useSelector((state) => state.card.card);

  console.log(card?.attachments);

  return (
    <div className="flex items-start gap-x-4 w-full">
      <span className="mt-0.5">
        <Paperclip size={22} />
      </span>

      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center">
          <p className="font-semibold grow   text-sm">Các tập tin đính kèm</p>
          <AttachmentFile>
            <button className="text-xs p-1 px-2  rounded-sm bg-gray-200">
              Thêm
            </button>
          </AttachmentFile>
        </div>

        <ol className=" space-y-4">
          {card?.attachments?.map((attachment) => (
            <AttachmentItem attachment={attachment} key={attachment.id} />
          ))}
        </ol>
      </div>
    </div>
  );
};
export default AttachmentList;
