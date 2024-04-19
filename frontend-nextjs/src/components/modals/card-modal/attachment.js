"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import { Avatar } from "@nextui-org/react";
import axios from "axios";
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
  const actions = [
    { label: "Bình luận" },
    { label: "Tải xuống" },
    { label: "Xóa" },
    { label: "Chỉnh sửa" },
  ];
  const downloadFile = async (id) => {
    console.log(1);
    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/âtchment/download/${id}`,
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${attachment.fileName}`;
      // link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="flex items-center gap-4">
      <Avatar
        src={isImagePath(attachment.path) && attachment.path}
        name={getFileExtension(attachment.fileName)}
        className="h-[80px] w-[110px] shrink-0 rounded-none text-md bg-gray-100 "
      />
      <div className="flex flex-col space-y-0.5">
        <p className="text-xs text-muted-foreground">
          <span
            className="text-md  text-neutral-700 font-bold"
            style={{ color: "#172b4d)" }}
          >
            {attachment.fileName}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Đã thêm{" "}
          {formatDistanceToNow(new Date(attachment.created_at), {
            addSuffix: true,
            locale: vi,
          })}{" "}
          • <a className="underline  cursor-pointer">Bình luận</a>•{" "}
          <span
            className="underline  cursor-pointer"
            onClick={() => downloadFile(attachment.id)}
          >
            Tải xuống
          </span>
          • <a className="underline  cursor-pointer">Xóa</a>•{" "}
          <a className="underline  cursor-pointer">Chỉnh sửa</a>
        </p>
      </div>
    </li>
  );
};
export default AttachmentItem;
