export const metadata = {
  title: "Cài đặt không gian làm việc ",
  description: "Cài đặt không gian làm việc",
};
import SidebarSettings from "./_components/SidebarSettings";
import BreadcrumbSettings from "./_components/BreadcrumbSettings";
import BreadcrumbProfile from "./_components/BreadcrumbProfile";
import { User, CreditCard, Building, Cloud } from "lucide-react";
import { CalendarIcon } from "@/components/Icon/CalenderIcon";
import { NotifyIcon } from "@/components/Icon/NotifyIcon";
export default function SettingsLayout({ children }) {
  const SettingOptions = [
    {
      href: "/settings",
      label: "Chung",
      icon: <User size={18} />,
    },
    {
      href: "/settings/billing",
      label: "Thanh toán",
      icon: <CreditCard size={18} />,
    },
    {
      href: "/settings/notifications",
      label: "Thông báo",
      icon: <NotifyIcon size={18} />,
    },
    {
      href: "/settings/my-workspace",
      label: "Không gian làm việc ",
      icon: <Building size={18} />,
    },
    {
      href: "/settings/calendar",
      label: "Lịch",
      icon: <CalendarIcon size={18} />,
    },
    // {
    //   href: "/settings/storage",
    //   label: "Lưu trữ đám mây",
    //   icon: <Cloud size={18} />,
    // },
  ];

  const ProfileOptions = [
    {
      href: "/settings",
      label: "Tài khoản",
    },
    {
      href: "/settings/password",
      label: "Mật khẩu",
    },
    {
      href: "/settings/sso",
      label: "Tài khoản được kết nối",
    },
    {
      href: "/settings/sessions",
      label: "Phiên",
    },
  ];
  return (
    <div className=" h-full flex">
      <SidebarSettings
        SettingOptions={SettingOptions}
        ProfileOptions={ProfileOptions}
      />
      <div className="grow px-6 py-4 h-full" style={{ overflowX: "auto" }}>
        <BreadcrumbSettings options={SettingOptions} origin={"Cài đặt"} />
        <BreadcrumbProfile options={ProfileOptions} />

        <div>{children}</div>
      </div>
    </div>
  );
}
