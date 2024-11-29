"use client";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { changePasswordApi } from "@/services/authApi";
import { toast } from "react-toastify";
import { LockKeyhole } from "lucide-react";
const PagePassword = () => {
  const user = useSelector((state) => state.user.user);
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
    if (password_new !== password_verify) {
      toast.error("Xác nhận mật khẩu chưa trùng với Mật khẩu mới");
      return;
    }
    try {
      await toast
        .promise(
          async () =>
            await changePasswordApi(user.id, {
              password_old: password_old,
              password_new: password_new,
            }),
          {
            pending: "Đang thay đổi...",
            success: "Thay đổi mật khẩu thành công",
          }
        )
        .catch((error) => {
          console.log(error);

          if (error.response?.data?.isMessage) {
            toast.error(error.response.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setForm({ password_old: "", password_new: "", password_verify: "" });
    }
  };
  const { password_old, password_new, password_verify } = form;
  return (
    <div className="mt-6">
      <form action="" onSubmit={(e) => handleChangePassword(e)}>
        <h1 className="text-2xl font-medium mt-2">Đổi mật khẩu</h1>
        <p className="mt-1">Đảm bảo rằng nó có ít nhất 6 ký tự</p>
        <div className="pb-4 pt-5 w-1/3">
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
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
            placeholder="Nhập mật khẩu hiện tại..."
            value={password_old}
            onChange={HandleChange}
          />
        </div>
        <div className="pb-4 w-1/3">
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
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
            placeholder="Nhập mật khẩu mới..."
            value={password_new}
            onChange={HandleChange}
          />
        </div>
        <div className="pb-4 w-1/3">
          <Input
            startContent={<LockKeyhole size={20} color={"#b9bec7"} />}
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
            placeholder="Xác nhận mật khẩu mới..."
            value={password_verify}
            onChange={HandleChange}
          />
        </div>
        <Button
          type="submit"
          color="danger"
          className="font-medium w-24 h-9 rounded-lg px-3 text-sm mt-2 interceptor-loading"
        >
          Cập nhật
        </Button>
      </form>
    </div>
  );
};
export default PagePassword;
