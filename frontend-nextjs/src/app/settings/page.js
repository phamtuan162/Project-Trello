"use client";
import { Avatar, Input, Button, Textarea } from "@nextui-org/react";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading/Loading";
const PageSettings = () => {
  const user = useSelector((state) => state.user.user);

  return user.id ? (
    <div className="mt-6">
      <form
        action=""
        className="pb-8"
        style={{ borderBottom: "1px solid rgb(230, 230, 230)" }}
      >
        <h1 className="text-2xl font-medium">Tài khoản hồ sơ</h1>
        <p className="mt-1">
          Quản lý tài khoản ProManage của bạn. Tất cả các thay đổi trong tài
          khoản của bạn sẽ được áp dụng cho tất cả không gian làm việc của bạn.
        </p>
        <div className="mt-5">
          <label className="text-default-400">Ảnh hồ sơ</label>
          <Avatar
            src={user?.avatar}
            radius="full"
            className="w-24 h-24 mt-1 text-4xl text-indigo-700 bg-indigo-100 "
            name={user?.name?.charAt(0).toUpperCase()}
          />
          <div className="w-full flex flex-col gap-2">
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-8 mt-4">
              <Input
                id="name"
                name="name"
                labelPlacement="outside"
                radius="lg"
                size="lg"
                type="text"
                variant={"bordered"}
                className="uppercase "
                label={
                  <label htmlFor="name" className="text-default-400 text-sm">
                    Họ và tên
                  </label>
                }
                defaultValue={user?.name}
                placeholder=" "
              />
              <Input
                id="email"
                name="email"
                labelPlacement="outside"
                size="lg"
                type="email"
                variant={"bordered"}
                className="uppercase"
                label={
                  <label htmlFor="email" className="text-default-400 text-sm">
                    E-mail
                  </label>
                }
                defaultValue={user?.email}
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
                className="uppercase"
                label={
                  <label htmlFor="phone" className="text-default-400 text-sm">
                    Số điện thoại
                  </label>
                }
                defaultValue={user?.phone}
                placeholder=" "
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
                  <label
                    htmlFor="password"
                    className="text-default-400 text-sm"
                  >
                    Mật khẩu
                  </label>
                }
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
                    className="text-default-400 text-sm"
                  >
                    Lý lịch
                  </label>
                }
                labelPlacement="outside"
                minRows={6}
                className="col-span-12  md:col-span-6 mb-6 md:mb-0 max-w-sm uppercase"
                placeholder=" "
                defaultValue={user?.background}
              />
            </div>

            <Button
              type="submit"
              color="danger"
              className="font-medium w-24 h-9 rounded-lg px-3 text-sm mt-2"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
      <div className="mt-6">
        <h2 className="text-2xl font-medium">Xóa tài khoản</h2>
        <p className="mt-1 max-w-[500px]">
          Khi bạn xóa tài khoản và dữ liệu tài khoản của mình, bạn sẽ không thể
          quay lại.
        </p>
        <form action="" className="pt-6">
          <Input
            id="deleteUser"
            name="deleteUser"
            labelPlacement="outside"
            radius="lg"
            size="md"
            type="text"
            className="max-w-md uppercase "
            variant={"bordered"}
            label={
              <label htmlFor="deleteUser" className="text-default-400 text-sm">
                Xóa tài khoản và dữ liệu tài khoản của bạn
              </label>
            }
            defaultValue=" "
            placeholder=" "
          />
          <Button
            type="submit"
            color="danger"
            className="font-medium w-28 h-9 rounded-lg px-3 text-sm mt-4 mb-6"
          >
            Xóa tài khoản
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
export default PageSettings;
