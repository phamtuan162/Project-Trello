"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { SearchIcon, UserPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { assignUserApi, unAssignUserApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
const { updateCard } = cardSlice.actions;
const { updateBoard } = boardSlice.actions;
const AssignUser = ({ children, isAssign, setIsAssign, cardUpdate }) => {
  const dispatch = useDispatch();
  const [keyword, setKeyWord] = useState("");
  const [isSelect, setIsSelect] = useState(false);
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const card = useSelector((state) => state.card.card);
  const socket = useSelector((state) => state.socket.socket);
  const hasSearchFilter = Boolean(keyword);
  const userNotAssignCard = useMemo(() => {
    if (!workspace || !workspace.users || !cardUpdate.users) {
      return [];
    }

    const assignedUserIds = cardUpdate.users.map((user) => user.id);
    return workspace.users.filter((user) => !assignedUserIds.includes(user.id));
  }, [workspace, cardUpdate]);

  const filteredItems = useMemo(() => {
    let filteredUsers =
      userNotAssignCard.filter((item) => item !== null && item !== undefined) ||
      [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword.toLowerCase()) ||
          item.email.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    return filteredUsers;
  }, [userNotAssignCard, keyword]);

  const notifyUser = (
    userAssign,
    messageType,
    cardTitle,
    boardTitle,
    workspaceName
  ) => {
    if (+userAssign.id !== +user.id) {
      socket.emit("sendNotification", {
        user_id: userAssign.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: messageType,
        content:
          messageType === "assign_user_card"
            ? `đã thêm bạn vào thẻ ${cardTitle} thuộc bảng ${boardTitle} của Không gian làm việc ${workspaceName}`
            : `đã loại bạn khỏi thẻ ${cardTitle} thuộc bảng ${boardTitle} của Không gian làm việc ${workspaceName}`,
      });
    }
  };

  const updateBoardAndCard = (updatedCard) => {
    if (+cardUpdate.id !== +card.id && card.id) {
      const columnsUpdate = board.columns.map((column) => {
        const index = column.cards.findIndex((c) => +c.id === +card.id);
        if (index !== -1) {
          return {
            ...column,
            cards: column.cards.map((c, i) => (i === index ? card : c)),
          };
        }
        return column;
      });

      dispatch(updateBoard({ ...board, columns: columnsUpdate }));
    }

    dispatch(
      updateCard({
        ...cardUpdate,
        users: updatedCard.users,
        activities: updatedCard.activities,
      })
    );
  };

  const HandleSelectUserAssigned = async (userAssign) => {
    if (isSelect) return;

    if (
      user.role.toLowerCase() !== "admin" &&
      user.role.toLowerCase() !== "owner"
    ) {
      toast.error("Bạn không đủ quyền thực hiện thao tác này");
      setIsAssign(false);
      return;
    }

    if (userAssign.role.toLowerCase() === "guest") {
      toast.error("Người này là khách không không thêm vào được");
      setIsAssign(false);
      return;
    }

    if (cardUpdate.users.length === 4) {
      toast.error("Tối đa 5 thành viên");
      return;
    }

    setIsSelect(true);

    try {
      const data = await assignUserApi(cardUpdate.id, {
        user_id: userAssign.id,
      });

      if (data.status === 200) {
        updateBoardAndCard(data.card);
        notifyUser(
          userAssign,
          "assign_user_card",
          card.title,
          board.title,
          workspace.name
        );

        setKeyWord("");
        toast.success("Người dùng đã được thêm thành công");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm người dùng");
    } finally {
      setIsSelect(false);
    }
  };

  const HandleUnAssignedCard = async (userAssign) => {
    if (isSelect || !userAssign) return;

    setIsSelect(true);

    try {
      const data = await unAssignUserApi(cardUpdate.id, {
        user_id: userAssign.id,
      });

      if (data.status === 200) {
        updateBoardAndCard(data.card);
        notifyUser(
          userAssign,
          "unassign_user_card",
          card.title,
          board.title,
          workspace.name
        );

        setKeyWord("");
        toast.success("Người dùng đã được loại bỏ thành công");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi loại bỏ người dùng");
    } finally {
      setIsSelect(false);
    }
  };

  return (
    <Popover
      onClose={() => setKeyWord("")}
      isOpen={isAssign}
      onOpenChange={(assign) => setIsAssign(assign)}
      placement="right"
      classNames={{
        base: ["before:bg-default-200 px-0"],
        content: ["p-0 -translate-x-12  w-[280px] "],
      }}
    >
      <PopoverTrigger>
        {children ? (
          children
        ) : (
          <button
            onClick={() => setIsAssign(true)}
            className="flex rounded-full items-center justify-center p-1.5  text-default-300  border-dashed border-1.5 border-default-300  hover:border-indigo-400 hover:text-indigo-400 focus-visible:outline-none "
          >
            <UserPlus size={14} />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-full rounded-lg flex flex-col ">
          <div>
            <Input
              value={keyword}
              onChange={(e) => setKeyWord(e.target.value)}
              variant="underlined"
              type="search"
              name="name"
              id="name"
              startContent={
                <div className="pl-2">
                  <SearchIcon size={16} />
                </div>
              }
              placeholder="Tìm kiếm..."
              size="xs"
              className="w-full"
            />
          </div>

          <div>
            <div className=" p-2 pb-1 max-h-[200px] overflow-x-auto">
              {filteredItems?.length > 0 ? (
                <>
                  <p className="font-medium text-xs">Thành viên trong Bảng</p>

                  {filteredItems?.map((user) => (
                    <div
                      key={user.id}
                      className=" rounded-lg p-1 px-3 cursor-pointer mt-1   hover:bg-default-300"
                      onClick={() => HandleSelectUserAssigned(user)}
                    >
                      <User
                        avatarProps={{
                          radius: "full",
                          size: "sm",
                          src: user.avatar,
                          color: "secondary",
                          name: user.name.charAt(0).toUpperCase(),
                        }}
                        classNames={{
                          description: "text-default-500",
                        }}
                        name={user.name}
                        description={user.email}
                      >
                        {user.email}
                      </User>
                    </div>
                  ))}
                </>
              ) : (
                <p className="w-full text-center text-md">
                  Không có thành viên nào
                </p>
              )}
            </div>
            {cardUpdate?.users?.length > 0 && (
              <div className=" p-2 max-h-[200px] overflow-x-auto">
                <p className="font-medium text-xs">Thành viên trong Thẻ</p>
                {cardUpdate.users.map((user) => (
                  <div
                    key={user.id}
                    className=" rounded-lg p-1 px-3 cursor-pointer mt-2 hover:bg-default-300 "
                    onClick={() => HandleUnAssignedCard(user)}
                  >
                    <User
                      avatarProps={{
                        radius: "full",
                        size: "sm",
                        src: user.avatar,
                        color: "secondary",
                        name: user.name.charAt(0).toUpperCase(),
                      }}
                      classNames={{
                        description: "text-default-500",
                      }}
                      description={user.email}
                      name={user.name}
                    >
                      {user.email}
                    </User>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUser;
