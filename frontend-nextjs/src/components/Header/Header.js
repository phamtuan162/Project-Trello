"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  NavbarMenu,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import React from "react";
import { SearchIcon } from "../Icon/SearchIcon";
import { HelpOutlineIcon } from "../Icon/HelpOutlineIcon";
import { NotifyIcon } from "../Icon/NotifyIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import Sidebar from "../Sidebar/Sidebar";
import CreateAll from "./CreateAll";
import { User } from "./User";
import { getWorkspace } from "@/apis";

const Header = () => {
  const { id } = useParams();
  const [workspaces, setWorkspaces] = useState([]);

  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuItems = [
    "Các không gian làm việc",
    "Gần đây",
    "Đã đánh dấu sao",
    "Mẫu",
  ];
  useEffect(() => {
    async function fetchData() {
      const data = await getWorkspace();
      if (data) {
        setWorkspaces(data.data);
      }
    }
    fetchData();
  }, []);
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
          <Link href="/">
            <p className="font-bold text-inherit">Clone Trello</p>
          </Link>
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
            aria-label="0 thông báo"
            className="relative rounded-full  p-1 text-gray-400 hover:bg-gray-500 hover:text-white "
          >
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">View notifications</span>
            <NotifyIcon />
          </button>
        </NavbarItem>
        <NavbarItem>
          <button
            type="button"
            className="relative rounded-full  p-1 text-gray-400 hover:bg-gray-500 hover:text-white "
          >
            <HelpOutlineIcon />
          </button>
        </NavbarItem>

        <NavbarItem className=" lg:flex  "></NavbarItem>
      </NavbarContent>
      <User />
      <NavbarMenu className="sidebar">
        <Sidebar />
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
