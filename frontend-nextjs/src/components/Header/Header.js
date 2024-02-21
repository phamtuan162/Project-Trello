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
import { AddIcon } from "../Icon/AddIcon";
import { NotifyIcon } from "../Icon/NotifyIcon";
import ThemeSwitcher from "./ThemeSwitcher";
import { QuickMenuIcon } from "../Icon/QuickMenuIcon";
import Sidebar from "../Sidebar/Sidebar";
import FormOption from "../Form/FormOption";
import { User } from "./User";
import { getWorkspace } from "@/apis";

const Header = () => {
  const options = [
    {
      label: "Thêm không gian ",
      icon: <AddIcon />,
      title: "",
    },
    {
      label: "Thông báo",
      icon: <NotifyIcon />,
      title: "",
    },
    {
      label: "Thông tin",
      icon: <HelpOutlineIcon />,
      title: "",
    },
    {
      label: "Trình đơn thao tác nhanh",
      icon: <QuickMenuIcon />,
      title: "",
    },
  ];
  const { id } = useParams();
  const [workspaces, setWorkspaces] = useState([]);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      className=" border-b-1 dark:border-slate-300/10 "
      onMenuOpenChange={setIsMenuOpen}
      key={"header"}
    >
      <NavbarContent style={{ flexGrow: "0" }}>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit">Trello</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center h-[40px]" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small ",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-lg",
          }}
          placeholder="Tìm kiếm..."
          size="sm"
          startContent={<SearchIcon size={24} />}
          type="search"
        />
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {options?.map((option, index) => (
          <FormOption option={option} key={index} />
        ))}

        <NavbarItem className="ml-6">
          <User />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="sidebar">
        <Sidebar />
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
// <NavbarItem>
// <Link
//   href="#"
//   color="foreground"
//   className=" hover:bg-default p-2 rounded-md	"
// >
//   Gần đây
// </Link>
// </NavbarItem>
// <NavbarItem>
// <Link color="foreground" className=" hover:bg-default p-2 rounded-md	">
//   Đã đánh dấu sao
// </Link>
// </NavbarItem>
// <NavbarItem>
// <Link color="foreground" className=" hover:bg-default p-2 rounded-md	">
//   Mẫu
// </Link>
// </NavbarItem>
// <NavbarItem>
// <button
//   style={{ marginRight: "-10px" }}
//   type="button"
//   aria-label="thêm"
//   className="relative rounded-lg  p-2 text-gray-400 hover:bg-gray-500 hover:text-white flex gap-2 items-center text-lg  "
// >
//   <AddIcon />
//   New
// </button>
// </NavbarItem>
// <NavbarItem className="h-full">
// <button
//   onMouseEnter={handleMouseEnter}
//   onMouseLeave={handleMouseLeave}
//   style={{ marginRight: "-10px" }}
//   type="button"
//   aria-label="0 thông báo"
//   className="relative rounded-lg  p-2 text-gray-400 hover:bg-gray-500 hover:text-white h-full"
// >
//   <NotifyIcon />
//   <Popover
//     showArrow
//     isOpen={isPopoverOpen}
//     onOpenChange={(open) => setIsPopoverOpen(open)}
//     placement="bottom"
//     classNames={{
//       base: ["before:bg-default-800"],
//       content: [
//         "p-2 bg-default-800 text-white text-lg",
//         "dark:from-default-100 dark:to-default-50",
//       ],
//     }}
//   >
//     <PopoverTrigger>
//       <span className=""></span>
//     </PopoverTrigger>
//     <PopoverContent>Thông báo</PopoverContent>
//   </Popover>
// </button>
// </NavbarItem>
// <NavbarItem>
// <button
//   style={{ marginRight: "-10px" }}
//   type="button"
//   className="relative rounded-lg  p-2 text-gray-400 hover:bg-gray-500 hover:text-white "
// >
//   <HelpOutlineIcon />
// </button>
// </NavbarItem>
// <NavbarItem>
// <button
//   style={{ marginRight: "-10px" }}
//   type="button"
//   className="relative rounded-lg  p-2 text-gray-400 hover:bg-gray-500 hover:text-white "
// >
//   <QuickMenuIcon />
// </button>
// </NavbarItem>
