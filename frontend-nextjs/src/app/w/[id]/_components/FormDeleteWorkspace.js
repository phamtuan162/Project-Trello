"use client";
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useState, useRef } from "react";
import { Message } from "@/components/Message/Message";
import { deleteWorkspaceApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
const FormDeleteWorkspace = ({ workspace }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "Bằng cách xóa không gian làm việc này, bạn sẽ xóa tất cả các bảng và dự án.Tất cả dữ liệu và tín dụng thanh toán của bạn sẽ bị mất."
  );
  const [isOpen, setIsOpen] = useState(false);

  const nameRef = useRef(null);

  const handleClick = () => {
    setIsOpen(true);
  };

  const HandleDeleteWorkspace = async () => {
    if (name === workspace.name) {
      // deleteWorkspaceApi(workspace.id).then((data) => {
      //   if (data.status === 200) {
      //     toast.success("Xóa thành công ");
      //   } else {
      //     const error = data.error;
      //     setMessage(error);
      //   }
      // });
    } else {
      setMessage(
        "Tên không gian làm việc không trừng khớp, Vui lòng nhập lại!"
      );
      nameRef.current.focus();
    }
  };
  return (
    <div className="pt-8 w-full border-t-1 border-solid border-default-400">
      <h2 className="text-2xl font-medium">Xóa Không gian làm việc</h2>
      <p className="mt-1 max-w-[500px]">
        Khi bạn xóa không gian làm việc các bảng,danh sách,v.v trong không gian
        làm việc sẽ bị xóa cùng
      </p>

      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);

          setMessage(
            "Bằng cách xóa không gian làm việc này, bạn sẽ xóa tất cả các bảng và dự án.Tất cả dữ liệu và tín dụng thanh toán của bạn sẽ bị mất."
          );
        }}
        placement="top-end"
        style={{
          width: "50%",
          top: "50%",
          left: "50%",
        }}
        backdrop="opaque"
        left={"50%"}
        classNames={{
          base: ["-translate-y-1/2 translate-x-1/2 "],
          content: ["py-3 px-4 border border-default-200 "],
        }}
      >
        <PopoverTrigger>
          <Button
            type="button"
            onClick={handleClick}
            color="danger"
            className="font-medium  h-9 rounded-lg px-3 text-sm mt-4 mb-6 text-md"
          >
            Xóa không gian làm việc
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" w-full ">
          {(titleProps) => (
            <div className="px-2 py-2 h-full w-full ">
              <h2 className="text-3xl font-normal text-red-400" {...titleProps}>
                Xóa không gian làm việc
              </h2>

              <div className="mt-3">
                <Message message={message} />
              </div>

              <p className="mt-4">
                Vui lòng nhập lại
                <span className="font-bold text-md mx-1">
                  Không gian làm việc
                </span>
                để xác nhận
              </p>

              <Input
                isRequired
                type="text"
                name="name"
                id="name"
                placeholder="Tên không gian làm việc..."
                variant="bordered"
                className="mt-3"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex w-full justify-end gap-3 mt-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="rounded-lg text-md font-medium text-white   flex items-center justify-center py-2"
                  color="primary"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={() => HandleDeleteWorkspace()}
                  type="button"
                  className="rounded-lg text-md font-medium text-white   flex items-center justify-center py-2"
                  color="danger"
                >
                  Xóa bỏ
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default FormDeleteWorkspace;
