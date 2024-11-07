"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";
import ThemeSwitcher from "./ThemeSwitcher";
import { logoutApi } from "@/services/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
export function UserMenu({ user }) {
  const socket = useSelector((state) => state.socket.socket);

  const router = useRouter();
  const handleLogOut = async () => {
    toast.warning("Vui lòng click vào đây nếu bạn muốn đăng xuất? ", {
      onClick: async () => {
        try {
          await logoutApi(user.id);
          // socket.emit("logout", user.id);
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  return (
    <Dropdown
      radius="md"
      classNames={{
        base: "before:bg-default-200", // change arrow background
        content:
          "p-0 border-small border-divider bg-background min-w-[200px] text-lg",
      }}
    >
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform w-6 h-6"
          color="secondary"
          name={user?.name?.charAt(0).toUpperCase()}
          src={user?.avatar}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={["profile"]}
        className="p-3"
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >
        <DropdownSection aria-label="Profile & Actions" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            className="h-14 gap-2 opacity-100"
            textValue={user?.name}
          >
            <User
              name={user?.name}
              description={`@${
                user.name
                  ? user.name
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()
                      .replace(/\s+/g, "")
                  : ""
              }`}
              classNames={{
                name: "text-default-600 text-lg",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "md",
                src: user?.avatar,
                name: user?.name?.charAt(0).toUpperCase(),
                color: "secondary",
                className: "text-lg",
              }}
            />
          </DropdownItem>

          <DropdownItem onClick={() => router.push("/settings")} key="settings">
            Cài đặt
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Preferences" showDivider>
          <DropdownItem key="quick_search" shortcut="⌘K">
            Quick search
          </DropdownItem>
          <DropdownItem
            isReadOnly
            key="theme"
            className="cursor-default"
            endContent={<ThemeSwitcher />}
          >
            Chủ đề
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">
            Trợ giúp & Phản hồi
          </DropdownItem>
          <DropdownItem key="logout" onClick={handleLogOut}>
            Đăng xuất
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
