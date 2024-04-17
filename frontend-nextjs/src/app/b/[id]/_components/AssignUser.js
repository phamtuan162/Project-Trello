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
const { updateCard } = cardSlice.actions;
const AssignUser = ({ children, isAssign, setIsAssign, cardUpdate }) => {
  const dispatch = useDispatch();
  const [timeoutId, setTimeoutId] = useState(null);
  const [keyword, setKeyWord] = useState("");
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.user.user);
  const card = useSelector((state) => state.card.card);

  const [userSearch, setUserSearch] = useState([]);
  const userNotAssignCard = useMemo(() => {
    if (!workspace || !workspace.users || !cardUpdate.users) {
      return [];
    }

    const assignedUserIds = cardUpdate.users.map((user) => user.id);
    return workspace.users.filter((user) => !assignedUserIds.includes(user.id));
  }, [workspace, cardUpdate]);

  const HandleSearchUser = async (e) => {
    const inputKeyword = e.target.value.toLowerCase().trim();
    setKeyWord(e.target.value);
    // Xóa timeout trước đó (nếu có)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Thiết lập timeout mới
    const newTimeoutId = setTimeout(async () => {
      let userNew = [];
      for (const user of userNotAssignCard) {
        if (
          user.name.trim().toLowerCase().includes(inputKeyword) ||
          user.email.trim().toLowerCase().includes(inputKeyword)
        ) {
          userNew.push(user);
        }
      }
      setUserSearch(userNew);
    }, 2000); // Thời gian trễ là 2 giây

    // Lưu ID của timeout mới vào state
    setTimeoutId(newTimeoutId);
  };

  const HandleSelectUserAssigned = async (userAssign) => {
    if (
      user.role.toLowerCase() !== "admin" &&
      user.role.toLowerCase() !== "owner"
    ) {
      toast.error("Bạn không đủ quyền thực hiện thao tác này");
      setIsAssign(false);
      return;
    }
    if (cardUpdate.users.length === 4) {
      toast.error("Tối đa 4 thành viên");
    } else {
      assignUserApi(cardUpdate.id, { user_id: userAssign.id }).then((data) => {
        if (data.status === 200) {
          const cardUpdate = data.card;
          dispatch(updateCard({ ...card, users: cardUpdate.users }));
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
      setKeyWord("");
      setUserSearch([]);
    }
  };

  const HandleUnAssignedCard = async (user) => {
    if (user) {
      unAssignUserApi(cardUpdate.id, { user_id: user.id }).then((data) => {
        if (data.status === 200) {
          const cardUpdate = data.card;
          dispatch(updateCard({ ...card, users: cardUpdate.users }));
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
    }
  };

  useEffect(() => {
    if (userNotAssignCard.length > 0) {
      setUserSearch(userNotAssignCard);
    }
  }, [userNotAssignCard]);

  const HandleReset = async () => {
    setKeyWord("");
    setUserSearch(userNotAssignCard);
  };
  return (
    <Popover
      onClose={HandleReset}
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
              onChange={(e) => HandleSearchUser(e)}
              variant="underlined"
              type="text"
              name="name"
              id="name"
              startContent={
                <div className="pl-2">
                  <SearchIcon size={16} />
                </div>
              }
              placeholder="Tìm kiếm..."
              size="xs"
              className="w-full "
            />
          </div>
          <div className=" p-2 pb-0 max-h-[200px] overflow-x-auto">
            {userSearch?.length > 0 ? (
              <>
                <p className="font-medium text-xs">Thành viên trong Bảng</p>

                {userSearch?.map((user) => (
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
      </PopoverContent>
    </Popover>
  );
};
export default AssignUser;
