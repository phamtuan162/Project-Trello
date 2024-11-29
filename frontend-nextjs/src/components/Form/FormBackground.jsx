"use client";
import { useState } from "react";
import FormPicker from "./FormPicker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { CloseIcon } from "../Icon/CloseIcon";
const FormBackground = ({
  children,
  HandleBackground,
  placement = "right",
  isCardActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      placement={placement}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[250px] p-2 px-3">
        <form className="w-full" action={HandleBackground}>
          <div className="flex justify-between items-center	relative">
            <h1 className="grow text-center ">Ảnh Bìa</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>

          <div className="my-2">
            <p className="text-xs font-medium">Ảnh từ Unsplash</p>
            <div className="mt-2 flex flex-col gap-2 ">
              <FormPicker id="image" />
            </div>
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full interceptor-loading"
          >
            Thay đổi
          </Button>

          <div className=" text-xs mt-2">
            Bằng cách sử dụng hình ảnh từ Unsplash, bạn đồng ý với
            <a
              href="https://unsplash.com/license"
              target="_blank"
              className="mx-1 text-blue-400 hover:underline"
            >
              giấy phép
            </a>
            và
            <a
              href="https://unsplash.com/terms"
              target="_blank"
              className="ml-1 text-blue-400 hover:underline"
            >
              Điều khoản dịch vụ
            </a>
          </div>

          {isCardActive && (
            <div className="w-full ">
              <input
                type="file"
                accept="image/*"
                hidden
                alt="Upload"
                name="upl_avatar"
                id="upl_avatar"
                onChange={HandleBackground}
              />
              <label
                htmlFor="upl_avatar"
                className="interceptor-loading  rounded-lg text-xs w-full bg-gray-100 hover:bg-gray-300 cursor-pointer mx-auto font-medium text-slate-600 mt-4  flex items-center justify-center  p-1"
              >
                Tải ảnh từ máy lên
              </label>
            </div>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default FormBackground;
