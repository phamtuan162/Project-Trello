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
import { deleteUser } from "@/services/userApi";
const FormDeleteUser = (user) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Cảnh báo: Việc xóa tài khoản là vĩnh viễn và không thể hoàn tác, hãy nhấp vào “Xóa tài khoản” để xóa tài khoản của bạn."
  );
  const [isOpen, setIsOpen] = useState(false);

  const [validEmail, setValidEmail] = useState(true);
  const emailRef = useRef(null);
  const HandleChange = (e) => {
    setEmail(e.target.value);
    if (!validEmail) {
      setValidEmail(true);
    }
  };

  const handleClick = () => {
    setIsOpen(false);

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!email.match(emailRegex)) {
      emailRef.current.focus();

      setValidEmail(false);
    } else {
      setIsOpen(true);
    }
  };

  const HandleDeleteAccount = async () => {
    deleteUser({ email: email, id: user.id }).then((data) => {
      if (!data.error) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    });
  };
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-medium">Xóa tài khoản</h2>
      <p className="mt-1 max-w-[500px]">
        Khi bạn xóa tài khoản và dữ liệu tài khoản của mình, bạn sẽ không thể
        quay lại.
      </p>
      <form action="" className="pt-6">
        <Input
          ref={emailRef}
          id="email"
          name="email"
          labelPlacement="outside"
          radius="lg"
          size="md"
          type="email"
          className="max-w-md  "
          variant={"bordered"}
          label={
            <label
              htmlFor="email"
              className="text-default-400 text-sm uppercase"
            >
              Xóa tài khoản và dữ liệu tài khoản của bạn
            </label>
          }
          errorMessage={
            !validEmail && email !== "" && "Địa chỉ email không hợp lệ"
          }
          defaultValue=" "
          placeholder=" "
          onChange={HandleChange}
        />

        <Popover
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            emailRef.current.focus();
            setMessage(
              "Cảnh báo: Việc xóa tài khoản là vĩnh viễn và không thể hoàn tác, hãy nhấp vào “Xóa tài khoản” để xóa tài khoản của bạn."
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
              isDisabled={email === "" ? true : false}
              color="danger"
              className="font-medium w-28 h-9 rounded-lg px-3 text-sm mt-4 mb-6"
            >
              Xóa tài khoản
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-full ">
            {(titleProps) => (
              <div className="px-2 py-2 h-full w-full ">
                <h2
                  className="text-3xl font-normal text-red-400"
                  {...titleProps}
                >
                  Xóa tài khoản
                </h2>
                <div className=" text-default-500 text-base mt-4">
                  Bạn sẽ mất quyền truy cập vào tất cả không gian làm việc,
                  không gian con và dự án của mình
                </div>

                <div className="mt-3">
                  <Message message={message} />
                </div>

                <Button
                  onClick={() => HandleDeleteAccount()}
                  type="button"
                  className="rounded-lg text-xl font-medium text-white mt-4 w-full flex items-center justify-center py-2"
                  color="danger"
                >
                  Xóa tài khoản
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};
export default FormDeleteUser;
