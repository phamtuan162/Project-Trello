"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

import EditNameFile from "@/components/actions/card/editNameFile";
import DeleteFile from "@/components/actions/card/deleteFile";

const isImagePath = (path) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
  const extension = path.slice(path.lastIndexOf("."));
  return imageExtensions.includes(extension.toLowerCase());
};
const getFileExtension = (fileName) => {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return extension;
};

const AttachmentItem = ({ attachment }) => {
  const downloadFile = async (id) => {
    try {
      const res = await authorizedAxiosInstance.get(
        `/attachment/download/${id}`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: res.data.type });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${attachment.fileName}`;
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="flex items-center gap-4 cursor-pointer p-2 hover:bg-gray-100">
      <Avatar
        src={isImagePath(attachment.path) && attachment.path}
        name={getFileExtension(attachment.fileName)}
        className="h-[80px] w-[110px] shrink-0 rounded-none text-md  file-img	"
        style={{
          background: isImagePath(attachment.path) ? "#1e1f22" : "#091E420F",
        }}
      />
      <div className="flex flex-col space-y-0.5">
        <p className="text-xs text-muted-foreground">
          <span
            className="text-md  text-neutral-700 font-bold break-all"
            style={{ color: "#172b4d)" }}
          >
            {attachment.fileName}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Đã thêm
          <span className="ml-1">
            {formatDistanceToNow(new Date(attachment.created_at), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
          <span className="attachment-thumbnail-details-title-options  ">
            <a
              className="underline"
              onClick={() => downloadFile(attachment.id)}
            >
              Tải xuống
            </a>
          </span>{" "}
          <DeleteFile attachment={attachment}>
            <span className="attachment-thumbnail-details-title-options  ">
              <a className="underline ">Xóa</a>
            </span>
          </DeleteFile>{" "}
          <EditNameFile attachment={attachment}>
            <span className="attachment-thumbnail-details-title-options  ">
              <a className="underline">Chỉnh sửa</a>
            </span>
          </EditNameFile>
        </p>
      </div>
    </li>
  );
};
export default AttachmentItem;
