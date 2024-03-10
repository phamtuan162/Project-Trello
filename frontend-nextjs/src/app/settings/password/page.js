"use client";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Message } from "@/components/Message/Message";
import { changePasswordApi } from "@/services/authApi";
import { toast } from "react-toastify";
const PagePassword = () => {
  const user = useSelector((state) => state.user.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    password_old: "",
    password_new: "",
    password_verify: "",
  });
  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password_new === password_verify) {
      changePasswordApi(user.id, {
        password_old: password_old,
        password_new: password_new,
      }).then((data) => {
        if (!data.error) {
          toast.success("Thay đổi mật khẩu thành công");
          setErrorMessage("");
          setForm({ password_old: "", password_new: "", password_verify: "" });
        } else {
          const error = data.error;
          setErrorMessage(error);
        }
      });
    } else {
      setErrorMessage("Xác nhận mật khẩu chưa trùng với Mật khẩu mới");
    }
  };
  const { password_old, password_new, password_verify } = form;
  return (
    <div className="mt-6">
      <form action="" onSubmit={(e) => handleChangePassword(e)}>
        <div>
          <Message message={errorMessage} />
        </div>
        <h1 className="text-2xl font-medium mt-2">Đổi mật khẩu</h1>
        <p className="mt-1">Đảm bảo rằng nó có ít nhất 6 ký tự</p>
        <div className="pb-4 pt-5 w-1/3">
          <Input
            isRequired
            minLength={6}
            id="password_old"
            name="password_old"
            labelPlacement="outside"
            radius="lg"
            size="sm"
            type="password"
            variant={"bordered"}
            label={
              <label
                htmlFor="password_old"
                className="text-default-400 text-xs uppercase"
              >
                Mật khẩu hiện tại
              </label>
            }
            placeholder=" "
            value={password_old}
            onChange={HandleChange}
          />
        </div>
        <div className="pb-4 w-1/3">
          <Input
            isRequired
            minLength={6}
            id="password_new"
            name="password_new"
            labelPlacement="outside"
            radius="lg"
            size="sm"
            type="password"
            variant={"bordered"}
            label={
              <label
                htmlFor="password_new"
                className="text-default-400 text-xs uppercase"
              >
                Mật khẩu mới
              </label>
            }
            placeholder=" "
            value={password_new}
            onChange={HandleChange}
          />
        </div>
        <div className="pb-4 w-1/3">
          <Input
            isRequired
            minLength={6}
            id="password_verify"
            name="password_verify"
            labelPlacement="outside"
            radius="lg"
            size="sm"
            type="password"
            variant={"bordered"}
            label={
              <label
                htmlFor="password_verify"
                className="text-default-400 text-xs uppercase"
              >
                Xác nhận mật khẩu
              </label>
            }
            placeholder=" "
            value={password_verify}
            onChange={HandleChange}
          />
        </div>
        <Button
          type="submit"
          color="danger"
          className="font-medium w-24 h-9 rounded-lg px-3 text-sm mt-2"
        >
          Cập nhật
        </Button>
      </form>
    </div>
  );
};
export default PagePassword;
