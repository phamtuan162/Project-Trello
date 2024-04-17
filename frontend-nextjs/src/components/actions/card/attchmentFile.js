"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Input,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
const AttachmentFile = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(selectedFile);
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
              Đính kèm
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
            <p className="text-xs font-medium">
              Đính kèm tệp từ máy tính của bạn
            </p>
            <input
              onChange={(e) => setSelectedFile(e.target.files[0])}
              type="file"
              accept="*/*"
              hidden
              alt="Upload"
              name="upl_file"
              id="upl_file"
            />
            <label
              htmlFor="upl_file"
              className="bg-default-200  rounded-lg text-sm font-medium  mt-4   flex items-center justify-center py-2 px-6 relative z-50 data-[hover=true]:opacity-100"
            >
              Chọn tệp
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AttachmentFile;
