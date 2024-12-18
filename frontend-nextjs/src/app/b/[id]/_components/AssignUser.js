"use client";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { SearchIcon, UserPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { assignUserApi, unAssignUserApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { socket } from "@/socket";

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

  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const board = useSelector((state) => state.board.board);
  const cardActive = useSelector((state) => state.card.card);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

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

  const HandleSelectUserAssigned = async (userAssign) => {
    try {
      if (!checkRole) {
        toast.error("Bạn không đủ quyền thực hiện thao tác này");
        setIsAssign(false);
        return;
      }

      if (userAssign.role.toLowerCase() === "guest") {
        toast.error("Người này là khách không không thêm vào được");
        return;
      }

      if (card.users.length === 4) {
        toast.error("Tối đa 5 thành viên");
        return;
      }

      const notification = {
        user_id: userAssign.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: "assign_user_card",
        content: `đã thêm bạn vào thẻ ${card.title} thuộc bảng ${board.title} của Không gian làm việc ${workspace.name}`,
        status: "unread",
        onClick: false,
      };

      await toast
        .promise(
          async () =>
            await assignUserApi(card.id, {
              user_id: userAssign.id,
              notification,
            }),
          { pending: "Đang thêm thành viên..." }
        )
        .then((res) => {
          const { activity, notification: notificationNew } = res;

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            users: [userAssign, ...card.users],
            activities: [activity, ...card.users],
          };

          dispatch(updateCardInBoard(cardUpdate));

          if (cardActive && cardActive.id === card.id) {
            dispatch(updateCard(cardUpdate));
          }

          toast.success("Thành viên này đã được thêm thành công");

          socket.emit("updateCard", cardUpdate);

          if (notificationNew) {
            socket.emit("sendNotification", {
              user_id: userAssign.id,

              notification: notificationNew,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setKeyWord("");
          setIsAssign(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const HandleUnAssignedCard = async (userAssign) => {
    if (!userAssign) return;

    try {
      if (!checkRole) {
        toast.error("Bạn không đủ quyền thực hiện thao tác này");
        setIsAssign(false);
        return;
      }

      const notification = {
        user_id: userAssign.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: "unassign_user_card",
        content: `đã loại bạn khỏi thẻ ${card.title} thuộc bảng ${board.title} của Không gian làm việc ${workspace.name}`,
        status: "unread",
        onClick: false,
      };

      await toast
        .promise(
          async () =>
            await unAssignUserApi(card.id, {
              user_id: userAssign.id,
              notification,
            }),
          { pending: "Đang loại bỏ thành viên..." }
        )
        .then((res) => {
          const { activity, notification: notificationNew } = res;

          const cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            users: card.users.filter((u) => u.id !== userAssign.id),
            activities: [activity, ...card.activities],
          };

          dispatch(updateCardInBoard(cardUpdate));

          if (cardActive && cardActive.id === card.id) {
            dispatch(updateCard(cardUpdate));
          }

          toast.success("Thành viên đã được loại bỏ thành công");

          socket.emit("updateCard", cardUpdate);

          if (notificationNew) {
            socket.emit("sendNotification", {
              user_id: userAssign.id,
              notification: notificationNew,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsAssign(false);
          setKeyWord("");
        });
    } catch (error) {
      console.log(error);
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
