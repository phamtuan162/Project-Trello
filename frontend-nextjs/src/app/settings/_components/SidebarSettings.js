"use client";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { logoutApi } from "@/services/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const SidebarSettings = ({ SettingOptions, ProfileOptions }) => {
  const pathname = usePathname();
  const check = ProfileOptions.some((ProfileOption) => {
    return ProfileOption.href.includes(pathname);
  });
  const router = useRouter();
  const handleLogOut = async () => {
    toast.warning("Bạn có chắc chắn muốn đăng xuất không? ", {
      onClick: async () => {
        logoutApi().then((data) => {
          if (data) {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            window.location.href = "/auth/login";
          }
        });
      },
    });
  };
  return (
    <div
      className="h-full md:w-64 w-max-[300px] dark-border flex flex-col justify-center md:justify-start"
      style={{
        borderRight: "1px solid rgb(232, 234, 237)",
      }}
    >
      <div
        className=" p-2 dark-border pr-5"
        style={{
          borderBottom: "1px solid rgb(232, 234, 237)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="flex p-2 gap-2 items-center rounded-lg hover:bg-default-100 text-sm cursor-pointer w-full"
        >
          <ArrowLeft size={18} />

          <span className="md:block hidden">Trở lại không gian làm việc</span>
        </button>
      </div>

      <div className="grow overflow-y-auto p-3">
        {SettingOptions?.map((option, index) => (
          <div
            onClick={() => router.push(option.href)}
            key={index}
            color="foreground"
            className={`flex p-2 gap-3 items-center  rounded-lg text-md  cursor-pointer justify-center md:justify-start  mb-1 ${
              (
                check
                  ? pathname.includes(option.href)
                  : option.href.includes(pathname)
              )
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-default-100"
            } `}
          >
            {option.icon}
            <span className="md:block hidden">{option.label}</span>
          </div>
        ))}
      </div>
      <div
        className="p-2 pr-5 dark-border"
        style={{
          borderTop: "1px solid rgb(232, 234, 237)",
        }}
      >
        <button
          onClick={() => handleLogOut()}
          className="p-2 rounded-lg flex gap-2 items-center hover:bg-default-100 w-full text-sm justify-center md:justify-start"
        >
          <LogOut size={18} />
          <span className="md:block hidden">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
export default SidebarSettings;
