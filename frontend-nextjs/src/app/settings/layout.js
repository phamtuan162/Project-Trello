export const metadata = {
  title: "Cài đặt không gian làm việc ",
  description: "Cài đặt không gian làm việc",
};

import { User, CreditCard, Building } from "lucide-react";

import SidebarSettings from "./_components/SidebarSettings";
import BreadcrumbSettings from "./_components/BreadcrumbSettings";
import BreadcrumbProfile from "./_components/BreadcrumbProfile";

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
      href: "/settings/my-workspace",
      label: "Không gian làm việc ",
      icon: <Building size={18} />,
    },
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
      <div className="grow px-6 py-4 h-full" style={{ overflow: "auto" }}>
        <BreadcrumbSettings options={SettingOptions} origin={"Cài đặt"} />
        <BreadcrumbProfile options={ProfileOptions} />

        <div>{children}</div>
      </div>
    </div>
  );
}
