"use client";
import { Paperclip } from "lucide-react";
import AttachmentFile from "@/components/actions/card/attchmentFile";
import AttachmentItem from "./attachment";
import { useSelector } from "react-redux";
const AttachmentList = () => {
  const card = useSelector((state) => state.card.card);
  return (
    <div className="flex items-start gap-x-4 w-full">
      <Paperclip size={22} />
      <div className="w-full flex flex-col gap-4">
        <div className="flex">
          <p className="font-semibold grow  mb-2 text-sm">
            Các tập tin đính kèm
          </p>
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
