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
import { AddIcon } from "../Icon/AddIcon";
import { logoutApi } from "@/services/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
export function UserMenu({ user }) {
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
    <Dropdown
      radius="md"
      classNames={{
        base: "before:bg-default-200", // change arrow background
        content:
          "p-0 border-small border-divider bg-background min-w-[260px] text-lg",
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
          <DropdownItem key="dashboard">Dashboard</DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem
            key="new_project"
            endContent={<AddIcon className="text-large" />}
          >
            New Project
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
            Theme
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Help & Feedback">
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" onClick={handleLogOut}>
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
