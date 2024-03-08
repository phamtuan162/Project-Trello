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
  Tooltip,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { SearchIcon } from "../Icon/SearchIcon";
import { HelpOutlineIcon } from "../Icon/HelpOutlineIcon";
import { AddIcon } from "../Icon/AddIcon";
import { NotifyIcon } from "../Icon/NotifyIcon";
import { QuickMenuIcon } from "../Icon/QuickMenuIcon";
import Sidebar from "../Sidebar/Sidebar";
import { UserMenu } from "./UserMenu";
import { fetchData } from "@/stores/middleware/fetchData";
import { getProfile } from "@/services/authApi";
import { userSlice } from "@/stores/slices/userSlice";
const { updateUser } = userSlice.actions;
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

  const access_token = Cookies.get("access_token");
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (!user.id && !pathname.startsWith("/auth/")) {
      getProfile(access_token).then((data) => {
        if (data?.status === 200) {
          const user = data.data.dataValues;
          dispatch(updateUser(user));
          dispatch(fetchData({ user_id: user.id }));
        }
      });
    }
  }, [pathname]);

  return (
    <Navbar
      className=" border-b-1 dark:border-slate-300/10  text-md "
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
            <p className="font-bold text-inherit">ProManage </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-2" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[16rem] ",
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
        {options?.map((option, index) => (
          <Tooltip
            showArrow
            placement="bottom"
            key={index}
            color={"default"}
            content={option?.label}
            delay={0}
            closeDelay={0}
            motionProps={{
              variants: {
                exit: {
                  opacity: 0,
                  transition: {
                    duration: 0.1,
                    ease: "easeIn",
                  },
                },
                enter: {
                  opacity: 1,
                  transition: {
                    duration: 0.15,
                    ease: "easeOut",
                  },
                },
              },
            }}
          >
            <button className="rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-auto  flex items-center">
              {option?.icon}
            </button>
          </Tooltip>
        ))}
        <NavbarItem className="ml-4">
          <UserMenu user={user} />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="sidebar">
        <Sidebar />
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
