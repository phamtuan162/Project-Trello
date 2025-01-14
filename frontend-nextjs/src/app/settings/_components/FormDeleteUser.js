"use client";
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

import { Message } from "@/components/Message/Message";
import { deleteUser } from "@/services/userApi";
import { logoutApi } from "@/services/authApi";

const FormDeleteUser = ({ user }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Cảnh báo: Việc xóa tài khoản là vĩnh viễn và không thể hoàn tác, hãy nhấp vào &quot;Xóa tài khoản&quot; để xóa tài khoản của bạn."
  );
  const [isOpen, setIsOpen] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const emailRef = useRef(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (!validEmail) {
      setValidEmail(true);
    }
  };

  const handleClick = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!email.match(emailRegex)) {
      emailRef.current.focus();
      setValidEmail(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await toast
        .promise(async () => await deleteUser({ email: email, id: user.id }), {
          pending: "Đang xóa...",
        })
        .then(async (res) => {
          toast.success("Tài khoản đã bị xóa thành công.");
          await logoutApi(user.id);
        })
        .catch((error) => {
          if (error.response?.data?.isMessage) {
            setMessage(error.response.data.message);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-6" style={{ borderTop: "1px solid rgb(230, 230, 230)" }}>
      <h2 className="text-2xl font-medium mt-4">Xóa tài khoản</h2>
      <p className="mt-1">
        Tài khoản của bạn sẽ bị xóa tạm thời! Nếu không khôi phục trong 30 ngày,
        dữ liệu sẽ bị xóa vĩnh viễn. Để khôi phục, Vui lòng chọn phần &quot;Quên
        mật khẩu&quot;.
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
          className="max-w-md"
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
          value={email}
          onChange={handleChange}
          placeholder="Nhập địa chỉ email của bạn"
        />

        <Popover
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            emailRef.current.focus();
            setMessage(
              "Cảnh báo: Việc xóa tài khoản là vĩnh viễn và không thể hoàn tác, hãy nhấp vào &quot;Xóa tài khoản&quot; để xóa tài khoản của bạn."
            );
          }}
          placement="top-end"
          backdrop="opaque"
        >
          <PopoverTrigger>
            <Button
              type="button"
              onClick={handleClick}
              isDisabled={email === ""}
              color="danger"
              className="font-medium w-28 h-9 rounded-lg px-3 text-sm mt-4 mb-6"
            >
              Xóa tài khoản
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <div className="px-2 py-2 h-full w-full">
              <h2 className="text-3xl font-normal text-red-400">
                Xóa tài khoản
              </h2>
              <div className="text-default-500 text-base mt-4">
                Bạn sẽ mất quyền truy cập vào tất cả không gian làm việc, không
                gian con và dự án của mình.
              </div>

              <div className="mt-3">
                <Message message={message} />
              </div>

              <Button
                onClick={handleDeleteAccount}
                type="button"
                className="interceptor-loading rounded-lg text-xl font-medium text-white mt-4 w-full flex items-center justify-center py-2"
                color="danger"
              >
                Xóa tài khoản
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};

export default FormDeleteUser;
