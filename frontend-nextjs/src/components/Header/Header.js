"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuToggle,
  Tooltip,
  Badge,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { fetchWorkspace } from "@/stores/middleware/fetchWorkspace";
import { fetchMission } from "@/stores/middleware/fetchMission";
import Loading from "../Loading/Loading";
import Sidebar from "../Sidebar/Sidebar";
import { UserMenu } from "./UserMenu";
import { HelpOutlineIcon } from "../Icon/HelpOutlineIcon";
import { AddIcon } from "../Icon/AddIcon";
import { NotifyIcon } from "../Icon/NotifyIcon";
import { QuickMenuIcon } from "../Icon/QuickMenuIcon";
import FormCreateWorkspace from "../Form/FormCreateWorkspace";
import Notification from "../Notification";
import { notificationSlice } from "@/stores/slices/notificationSlice";
import { userSlice } from "@/stores/slices/userSlice";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
import SearchWorkspace from "./SearchWorkspace";
import { fetchNotification } from "@/stores/middleware/fetchNotification";
import { fetchProfileUser } from "@/stores/middleware/fetchProfileUser";

import { socket } from "@/socket";
import useSocketEvents from "@/hooks/useSocketEvents";

const { createNotification } = notificationSlice.actions;

const { createWorkspaceInUser, updateUser, updateWorkspaceInUser } =
  userSlice.actions;
const {
  inviteUserInWorkspace,
  cancelUserInWorkspace,
  updateWorkspace,
  deleteBoardInWorkspace,
} = workspaceSlice.actions;
const { clearBoard } = boardSlice.actions;
const {
  createMissionInMissions,
  deleteMissionInMissions,
  updateMissionInMissions,
  updateStatusUserInWorkspace,
} = missionSlice.actions;

const Header = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const board = useSelector((state) => state.board.board);

  const notificationsClick = useMemo(() => {
    return notifications?.filter((notification) => !notification.onClick);
  }, [notifications]);

  const isLogin = Cookies.get("isLogin");

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
          content={notificationsClick?.length}
          isInvisible={!notificationsClick?.length > 0}
          shape="circle"
          className="text-sm"
        >
          <Notification notificationsClick={notificationsClick}>
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

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      // Fetch profile user
      const data = await dispatch(fetchProfileUser()).unwrap();

      if (!data) return;

      socket.emit("newUser", {
        id: data.id,
        workspace_id_active: data.workspace_id_active,
        isOnline: data.isOnline,
        name: data.name,
        avatar: data.avatar,
      });

      // Fetch notifications, workspace and mission
      await Promise.all([
        dispatch(fetchNotification({ user_id: data.id })),
        dispatch(
          fetchWorkspace(data.workspace_id_active),
          dispatch(
            fetchMission({
              user_id: data.id,
              workspace_id: data.workspace_id_active,
            })
          )
        ),
      ]);

      // Redirect to active workspace if current path does not matches
      if (pathname.startsWith(`/w/${id}`) && id !== data?.workspace_id_active) {
        const currentURL = window.location.href.replace(
          id.toString(),
          data.workspace_id_active.toString()
        );
        router.push(currentURL);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLogin === "true" && !user?.id) {
      fetchUserProfile();
    }

    if (board?.id && !pathname.includes(`b/${board.id}`)) {
      dispatch(clearBoard());
    }
  }, [pathname]);

  const handleUsersWorkspace = (data) => {
    if (!data) return;

    const { type, user: userUpdate, workspace: workspaceUpdate } = data;

    const actionType = type.toLowerCase().trim();

    switch (actionType) {
      case "invite_user":
        if (userUpdate.id === user.id && workspaceUpdate) {
          dispatch(createWorkspaceInUser(workspaceUpdate));
        } else {
          dispatch(inviteUserInWorkspace(userUpdate));
        }
        break;

      case "remove_user":
        if (+user.id === +userUpdate.id) {
          if (+workspace.id === +workspaceUpdate.id) {
            toast.info("Bạn đã bị loại bỏ ra khỏi không gian làm việc này");
            setTimeout(() => (window.location.href = "/"), 1000);
          } else {
            const workspacesUpdate = user.workspaces.filter(
              (w) => w.id !== workspaceUpdate.id
            );
            dispatch(updateUser({ workspaces: workspacesUpdate }));
          }
        } else {
          dispatch(cancelUserInWorkspace(userUpdate));
        }
        break;

      default:
        break;
    }
  };

  const handleResultDeleteWorkspace = async ({ workspace_id }) => {
    if (!workspace_id || !user.workspaces.some((w) => w.id === workspace_id))
      return;

    if (+workspace.id === +workspace_id) {
      toast.info(
        "Không gian làm việc này đã bị xóa, bạn sẽ được chuyển đến nơi khác."
      );
      setTimeout(() => (window.location.href = "/"), 1000);
      return;
    }

    const updatedWorkspaces = user.workspaces.filter(
      (w) => w.id !== workspace_id
    );
    dispatch(updateUser({ workspaces: updatedWorkspaces }));
  };

  const handleResultDeleteBoard = async ({ board_id }) => {
    if (!board_id) return;

    dispatch(deleteBoardInWorkspace(board_id));

    if (window.location.pathname.startsWith(`/b/${board_id}`)) {
      toast.info("Bảng này đã bị xóa, bạn sẽ được chuyển về trang chính.");
      router.push(`/w/${workspace.id}/boards`);
    }
  };

  const handleGetWorkspaceUpdated = (data) => {
    if (!data) return;

    dispatch(updateWorkspace(data));

    if (data.name) {
      dispatch(updateWorkspaceInUser(data));
    }
  };

  const handleGetActionMission = ({ type, missionUpdate }) => {
    if (!type || !missionUpdate) return;

    const actions = {
      assign: () => dispatch(createMissionInMissions(missionUpdate)),
      un_assign: () => dispatch(deleteMissionInMissions(missionUpdate.id)),
      update: () => dispatch(updateMissionInMissions(missionUpdate)),
      delete: () => dispatch(deleteMissionInMissions(missionUpdate.id)),
    };

    actions[type.toLowerCase().trim()]?.();
  };
  const getStatusUser = (data) => {
    if (!data) return;

    dispatch(
      updateStatusUserInWorkspace({ id: data.id, isOnline: data.isOnline })
    );
  };

  const handleGetNotification = (data) => {
    if (!data) return;

    dispatch(createNotification(data));
  };

  useSocketEvents([
    { event: "getStatusUser", handler: getStatusUser },
    { event: "getUserWorkspace", handler: handleUsersWorkspace },
    { event: "resultDeleteWorkspace", handler: handleResultDeleteWorkspace },
    { event: "resultDeleteBoard", handler: handleResultDeleteBoard },
    { event: "getWorkspaceUpdated", handler: handleGetWorkspaceUpdated },
    { event: "getActionMission", handler: handleGetActionMission },
    { event: "getNotification", handler: handleGetNotification },
  ]);

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
          className="hidden"
        />
        <NavbarBrand>
          <Link onClick={() => router.push(`/w/${workspace.id}/boards`)}>
            <p className="font-bold text-inherit cursor-pointer">ProManage</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-2" justify="end">
        <SearchWorkspace isLoading={isLoading} setIsLoading={setIsLoading} />
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
