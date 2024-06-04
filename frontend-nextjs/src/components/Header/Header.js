"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getProfile } from "@/services/authApi";
import { fetchWorkspace } from "@/stores/middleware/fetchWorkspace";
import { fetchMission } from "@/stores/middleware/fetchMission";
import { userSlice } from "@/stores/slices/userSlice";
import { providerSlice } from "@/stores/slices/providerSlice";
import Loading from "../Loading/Loading";
import Sidebar from "../Sidebar/Sidebar";
import { UserMenu } from "./UserMenu";
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
  Badge,
} from "@nextui-org/react";
import { HelpOutlineIcon } from "../Icon/HelpOutlineIcon";
import { AddIcon } from "../Icon/AddIcon";
import { NotifyIcon } from "../Icon/NotifyIcon";
import { QuickMenuIcon } from "../Icon/QuickMenuIcon";
import FormCreateWorkspace from "../Form/FormCreateWorkspace";
import { socketSlice } from "@/stores/slices/socket";
import { io } from "socket.io-client";
import Notification from "../Notification";
import { notificationSlice } from "@/stores/slices/notificationSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { clickNotification } from "@/services/workspaceApi";
import SearchWorkspace from "./SearchWorkspace";
import { toast } from "react-toastify";
const { updateUser } = userSlice.actions;
const { updateProvider } = providerSlice.actions;
const { updateSocket } = socketSlice.actions;
const { updateNotification } = notificationSlice.actions;
const { updateWorkspace } = workspaceSlice.actions;
const Header = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const notificationsClick = useMemo(() => {
    return notifications?.filter((notification) => !notification.onClick);
  }, [notifications]);

  const socket = useSelector((state) => state.socket.socket);

  const { id } = useParams();
  const access_token = Cookies.get("access_token");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useSelector((state) => state.board.board);

  const [isLoading, setIsLoading] = useState(true);

  const handleClickNotify = async () => {
    if (notificationsClick?.length > 0) {
      const notificationsUpdate = notifications.map((notification) => {
        return { ...notification, onClick: true };
      });
      dispatch(updateNotification(notificationsUpdate));
      clickNotification({ user_id: user.id }).then((data) => {
        if (data.status === 200) {
        } else {
          toast.error(data.error);
        }
      });
    }
  };
  const options = [
    {
      label: "Thêm không gian ",
      icon: <AddIcon />,
      title: "",
      component: (
        <FormCreateWorkspace>
          <button className="focus-visible:outline-0 rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-auto  flex items-center ">
            <AddIcon />
          </button>
        </FormCreateWorkspace>
      ),
    },
    {
      label: "Thông báo",
      icon: <NotifyIcon />,
      title: "",
      component: (
        <Badge
          color="danger"
          content={notificationsClick.length}
          isInvisible={!notificationsClick.length > 0}
          shape="circle"
          className="text-sm"
        >
          <Notification handleClickNotify={handleClickNotify}>
            <button className="focus-visible:outline-0 rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-auto  flex items-center">
              <NotifyIcon />
            </button>
          </Notification>
        </Badge>
      ),
    },
    {
      label: "Thông tin",
      icon: <HelpOutlineIcon />,
      title: "",
      component: (
        <button className="focus-visible:outline-0 rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-auto  flex items-center">
          <HelpOutlineIcon />
        </button>
      ),
    },
    {
      label: "Trình đơn thao tác nhanh",
      icon: <QuickMenuIcon />,
      title: "",
      component: (
        <button className="rounded-lg  p-1.5 text-gray-400 hover:bg-gray-500 hover:text-white h-auto  flex items-center">
          <QuickMenuIcon />
        </button>
      ),
    },
  ];
  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:3001");
      dispatch(updateSocket(newSocket));
    }
  }, []);
  useEffect(() => {
    if (!user.id && !pathname.startsWith("/auth/")) {
      getProfile(access_token).then((data) => {
        if (data?.status === 200) {
          const user = data.data;
          dispatch(updateUser(user));
          dispatch(updateProvider(user.providers));

          if (pathname.startsWith(`/w/${id}`)) {
            let currentURL = window.location.href;
            currentURL = currentURL.replace(
              id.toString(),
              user.workspace_id_active.toString()
            );
            router.push(currentURL);
          }
        }
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (user.id && workspace.id) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, workspace]);

  useEffect(() => {
    const getUsersWorkspace = (data) => {
      if (data?.type) {
        const { type, user: userUpdated } = data;
        const lowerType = type.toLowerCase().trim();
        if (lowerType === "invite_user") {
          const usersUpdated = [...workspace.users, userUpdated];
          dispatch(
            updateWorkspace({
              ...workspace,
              total_user: workspace.total_user + 1,
              users: usersUpdated,
            })
          );
          if (+userUpdated.id === +user.id) {
            dispatch(
              updateUser({ ...user, workspaces: userUpdated.workspaces })
            );
          }
        }

        if (lowerType === "remove_user") {
          if (+user.id === +userUpdated.id) {
            if (
              +user.workspace_id_active === +userUpdated.workspace_id_active
            ) {
              toast.info("Bạn đã bị loại bỏ ra khỏi không gian làm việc này");
              setTimeout(() => {
                window.location.href = "/";
              }, 2000);
            } else {
              dispatch(
                updateUser({ ...user, workspaces: userUpdated.workspaces })
              );
            }
          } else {
            if (pathname.startsWith(`/b/${board.id}`)) {
              let currentURL = window.location.href;
              window.location.href = currentURL;
              // router.push(currentURL);
              return;
            }
            const usersUpdated = workspace.users.filter(
              (item) => item.id !== userUpdated.id
            );
            dispatch(
              updateWorkspace({
                ...workspace,
                total_user: workspace.total_user - 1,
                users: usersUpdated,
              })
            );
          }
        }
      }
    };

    if (user.id && socket && !workspace.id) {
      socket.emit("newUser", user.id);
      dispatch(fetchWorkspace(user.workspace_id_active));
      dispatch(
        fetchMission({
          user_id: user.id,
          workspace_id: user.workspace_id_active,
        })
      );
      dispatch(updateNotification(user.notifications));
    }

    if (socket && workspace?.users?.length > 0) {
      socket.on("getUserWorkspace", getUsersWorkspace);

      return () => {
        socket.off("getUserWorkspace", getUsersWorkspace);
      };
    }
  }, [socket, user]);

  if (isLoading) {
    return <Loading backgroundColor={"white"} zIndex={"100"} />;
  }

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
          <Link onClick={() => router.push(`/w/${workspace.id}/boards`)}>
            <p className="font-bold text-inherit cursor-pointer">ProManage</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-2" justify="end">
        <SearchWorkspace />
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
            <div>{option?.component}</div>
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
