"use client";
import { useRef, useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { userSlice } from "@/stores/slices/userSlice";
import { updateProfile } from "@/services/userApi";
import FormUpdateAvatar from "./FormUpdateAvatar";
import { toast } from "react-toastify";
const { updateUser } = userSlice.actions;
const FormUpdateProfile = ({ user }) => {
  const dispatch = useDispatch();
  const nameRef = useRef(null);
  const [form, setForm] = useState({
    name: "Phạm Tuấn",
    phone: "",
    background: "",
  });

  const handleUpdateProfile = async (formData) => {
    try {
      const updates = Object.keys(form).reduce((acc, field) => {
        const value = formData.get(field);
        if (user[field] !== value) acc[field] = value;
        return acc;
      }, {});

      if (Object.keys(updates).length === 0) {
        toast.info("Không có thay đổi nào để cập nhật");
        return;
      }

      await toast
        .promise(async () => updateProfile(user.id, updates), {
          pending: "Đang cập nhật...",
        })
        .then((res) => {
          dispatch(updateUser(updates));
          toast.success("Cập nhật thành công");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { name, background, phone } = form;
  return (
    <form action={handleUpdateProfile} className="pb-8">
      <h1 className="text-2xl font-medium">Tài khoản hồ sơ</h1>
      <p className="mt-1">
        Quản lý tài khoản ProManage của bạn. Tất cả các thay đổi trong tài khoản
        của bạn sẽ được áp dụng cho tất cả không gian làm việc của bạn.
      </p>
      <div className="mt-5">
        <label className="text-default-400">Ảnh hồ sơ</label>
        <FormUpdateAvatar user={user} />

        <div className="w-full flex flex-col gap-2">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-8 mt-4">
            <Input
              isRequired
              ref={nameRef}
              id="name"
              name="name"
              labelPlacement="outside"
              radius="lg"
              size="lg"
              type="text"
              variant={"bordered"}
              label={
                <label
                  htmlFor="name"
                  className="text-default-400 text-xs uppercase"
                >
                  Họ và tên
                </label>
              }
              onChange={HandleChange}
              defaultValue={user?.name}
              placeholder=" "
              errorMessage={
                (name === "" && "Vui lòng nhập Họ và tên") ||
                (!name.replace(/\s/g, "").match(/^[a-zA-ZÀ-Ỹà-ỹ\s]{6,}$/) &&
                  "Tên phải chứa ít nhất 6 ký tự và chỉ bao gồm chữ cái")
              }
            />
            <Input
              isReadOnly
              id="email"
              name="email"
              labelPlacement="outside"
              size="lg"
              type="email"
              variant={"bordered"}
              className="uppercase"
              label={
                <label htmlFor="email" className="text-default-400 text-xs">
                  E-mail
                </label>
              }
              defaultValue={user?.email}
              onChange={HandleChange}
              radius="lg"
              placeholder=" "
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-8 mt-4">
            <Input
              id="phone"
              name="phone"
              labelPlacement="outside"
              radius="lg"
              size="lg"
              type="text"
              variant={"bordered"}
              label={
                <label
                  htmlFor="phone"
                  className="text-default-400 text-xs uppercase"
                >
                  Số điện thoại
                </label>
              }
              onChange={HandleChange}
              defaultValue={user?.phone}
              placeholder=" "
              errorMessage={
                !phone.match(/^(0|\+84)[0-9]{9,10}$/) &&
                phone !== "" &&
                "Số điện thoại không hợp lệ"
              }
            />
            <Input
              id="password"
              name="password"
              labelPlacement="outside"
              isDisabled
              radius="lg"
              size="lg"
              type="password"
              className="uppercase"
              variant={"bordered"}
              label={
                <label htmlFor="password" className="text-default-400 text-xs">
                  Mật khẩu
                </label>
              }
              placeholder="**********"
              onChange={HandleChange}
              defaultValue={user?.password}
            />
          </div>
          <div>
            <Textarea
              id="background"
              name="background"
              variant={"bordered"}
              label={
                <label
                  htmlFor="background"
                  className="text-default-400 text-xs uppercase"
                >
                  Lý lịch
                </label>
              }
              errorMessage={
                !background
                  .replace(/\s/g, "")
                  .match(/^[a-zA-ZÀ-Ỹà-ỹ\d\s]{10,}$/) &&
                background !== "" &&
                "Lý lịch phải chứa ít nhất 10 ký tự và chỉ bao gồm chữ cái"
              }
              labelPlacement="outside"
              minRows={6}
              className="col-span-12  md:col-span-6 mb-6 md:mb-0 max-w-sm "
              placeholder=" "
              defaultValue={user?.background}
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
        </div>
      </div>
    </form>
  );
};
export default FormUpdateProfile;
