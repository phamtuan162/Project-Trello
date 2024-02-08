"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  NavbarMenu,
  NavbarMenuToggle,
  Avatar,
  Button,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import React from "react";
import { SearchIcon } from "../Icon/SearchIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import Sidebar from "../Sidebar/Sidebar";
import CreateAll from "./CreateAll";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    "Các không gian làm việc",
    "Gần đây",
    "Đã đánh dấu sao",
    "Mẫu",
  ];
  return (
    <Navbar
      className=" border-b-1 dark:border-slate-300/10"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent style={{ flexGrow: "0" }}>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">Clone Trello</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-4 " justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            href="/"
            className=" hover:bg-default p-2 rounded-md	"
          >
            Các không gian làm việc
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="#"
            color="foreground"
            className=" hover:bg-default p-2 rounded-md	"
          >
            Gần đây
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" className=" hover:bg-default p-2 rounded-md	">
            Đã đánh dấu sao
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" className=" hover:bg-default p-2 rounded-md	">
            Mẫu
          </Link>
        </NavbarItem>
        <NavbarItem>
          <CreateAll />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small ",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-lg",
          }}
          placeholder="Tìm kiếm..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        <NavbarItem>
          <button
            type="button"
            className="relative rounded-full  p-1 text-gray-400 hover:bg-gray-500 hover:text-white "
          >
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">View notifications</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>
        </NavbarItem>

        <NavbarItem className=" lg:flex  ">
          <Dropdown className="account" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="sidebar">
        <Sidebar />
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
