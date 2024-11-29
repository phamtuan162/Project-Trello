"use client";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { Activity, SearchIcon, UserPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { assignUserApi, unAssignUserApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AssignUser = ({
  children,
  isAssign,
  setIsAssign,
  card,
  placement = "right",
}) => {
  const dispatch = useDispatch();
  const [keyword, setKeyWord] = useState("");
  const [isSelect, setIsSelect] = useState(false);
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const cardActive = useSelector((state) => state.card.card);
  const socket = useSelector((state) => state.socket.socket);

  const hasSearchFilter = Boolean(keyword);

  const userNotAssignCard = useMemo(() => {
    // Kiểm tra xem workspace và cardUpdate có dữ liệu không
    if (!workspace?.users || !card?.users) return [];

    // Tạo một Set chứa các user.id đã được gán
    const assignedUserIds = new Set(card.users.map((user) => user.id));

    // Trả về những người dùng trong workspace chưa được gán vào card
    return workspace.users.filter((user) => !assignedUserIds.has(user.id));
  }, [workspace?.users, card?.users]);

  const filteredItems = useMemo(() => {
    // Nếu không có người dùng nào chưa được gán, trả về mảng trống
    if (!userNotAssignCard.length) return [];

    // Nếu không có bộ lọc tìm kiếm, trả về danh sách người dùng chưa được gán
    if (!hasSearchFilter || !keyword) return userNotAssignCard;

    // Nếu có bộ lọc tìm kiếm, lọc người dùng theo từ khóa
    const lowerCaseKeyword = keyword.toLowerCase();

    return userNotAssignCard.filter(
      (item) =>
        item?.name?.toLowerCase().includes(lowerCaseKeyword) ||
        item?.email?.toLowerCase().includes(lowerCaseKeyword)
    );
  }, [userNotAssignCard, keyword, hasSearchFilter]);

  const notifyUser = (
    userAssign,
    messageType,
    cardTitle,
    boardTitle,
    workspaceName
  ) => {
    if (+userAssign.id !== +user.id) {
      // socket.emit("sendNotification", {
      //   user_id: userAssign.id,
      //   userName: user.name,
      //   userAvatar: user.avatar,
      //   type: messageType,
      //   content:
      //     messageType === "assign_user_card"
      //       ? `đã thêm bạn vào thẻ ${cardTitle} thuộc bảng ${boardTitle} của Không gian làm việc ${workspaceName}`
      //       : `đã loại bạn khỏi thẻ ${cardTitle} thuộc bảng ${boardTitle} của Không gian làm việc ${workspaceName}`,
      // });
    }
  };

  const HandleSelectUserAssigned = async (userAssign) => {
    if (isSelect) return;
    try {
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

      if (card.users.length === 4) {
        toast.error("Tối đa 5 thành viên");
        return;
      }

      setIsSelect(true);

      await toast
        .promise(
          async () =>
            await assignUserApi(card.id, {
              user_id: userAssign.id,
            }),
          { pending: "Đang thêm thành viên..." }
        )
        .then((res) => {
          const { cardUpdated } = res;

          if (cardActive) {
            dispatch(
              updateCard({
                users: cardUpdated.users,
                Activities: cardUpdated.activities,
              })
            );
          }

          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              users: cardUpdated.users,
              activities: cardUpdated.activities,
            })
          );

          notifyUser(
            userAssign,
            "assign_user_card",
            card.title,
            board.title,
            workspace.name
          );

          toast.success("Thành viên này đã được thêm thành công");
          setKeyWord("");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSelect(false);
    }
  };

  const HandleUnAssignedCard = async (userAssign) => {
    if (isSelect || !userAssign) return;

    setIsSelect(true);

    try {
      await toast
        .promise(
          async () =>
            await unAssignUserApi(card.id, {
              user_id: userAssign.id,
            }),
          { pending: "Đang loại bỏ thành viên..." }
        )
        .then((res) => {
          const { cardUpdated } = res;
          console.log(cardUpdated.users);

          if (cardActive) {
            dispatch(
              updateCard({
                users: cardUpdated.users,
                Activities: cardUpdated.activities,
              })
            );
          }

          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              users: cardUpdated.users,
              activities: cardUpdated.activities,
            })
          );
          notifyUser(
            userAssign,
            "unassign_user_card",
            card.title,
            board.title,
            workspace.name
          );

          setKeyWord("");
          toast.success("Thành viên đã được loại bỏ thành công");
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSelect(false);
    }
  };

  const usersCard = useMemo(() => {
    if (!card?.users?.length) return null;

    return (
      <div className=" p-2 max-h-[200px] overflow-x-auto">
        <p className="font-medium text-xs">Thành viên trong Thẻ</p>
        {card.users.map((user) => (
          <div
            key={user.id}
            className=" rounded-lg p-1 px-3 cursor-pointer mt-2 hover:bg-default-300 interceptor-loading"
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
    );
  }, [card?.users]);

  const usersSearchCard = useMemo(() => {
    if (filteredItems?.length === 0) return null;

    return (
      <div>
        <p className="font-medium text-xs">
          Thành viên trong Không gian làm việc
        </p>

        {filteredItems.map((user) => (
          <div
            key={user.id}
            className=" rounded-lg p-1 px-3 cursor-pointer mt-1   hover:bg-default-300  interceptor-loading"
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
      </div>
    );
  }, [filteredItems]);

  return (
    <Popover
      onClose={() => setKeyWord("")}
      isOpen={isAssign}
      onOpenChange={setIsAssign}
      placement={placement}
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
              <p className="hidden last:block text-md w-full  text-center text-muted-foreground">
                Không có thành viên nào
              </p>
              {usersSearchCard}
            </div>
            {usersCard}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default AssignUser;
